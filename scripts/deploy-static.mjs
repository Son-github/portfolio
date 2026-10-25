import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const repository = "Son-github/portfolio";

// 로컬 실행/PR/다른 저장소에서 업로드를 시작하지 않습니다. AWS 호출 이전에 검사합니다.
export function readConfiguration(env) {
  if (
    env.GITHUB_ACTIONS !== "true" ||
    env.GITHUB_REPOSITORY !== repository ||
    env.GITHUB_REF !== "refs/heads/main" ||
    !["push", "workflow_dispatch"].includes(env.GITHUB_EVENT_NAME)
  ) {
    throw new Error(
      "이 배포 도구는 Son-github/portfolio의 main GitHub Actions에서만 실행합니다.",
    );
  }
  for (const key of [
    "AWS_REGION",
    "AWS_ACCOUNT_ID",
    "AWS_ROLE_ARN",
    "S3_BUCKET_NAME",
    "CLOUDFRONT_DISTRIBUTION_ID",
    "SITE_URL",
  ]) {
    if (!env[key]?.trim())
      throw new Error(`필수 GitHub Actions Variable이 없습니다: ${key}`);
  }
  if (env.AWS_REGION !== "ap-northeast-2")
    throw new Error("S3와 같은 서울(ap-northeast-2) 배포 리전을 지정하세요.");
  if (!/^[0-9]{12}$/.test(env.AWS_ACCOUNT_ID))
    throw new Error("AWS_ACCOUNT_ID 형식이 올바르지 않습니다.");
  if (!env.AWS_ROLE_ARN.startsWith(`arn:aws:iam::${env.AWS_ACCOUNT_ID}:role/`))
    throw new Error("배포 역할 ARN과 계정 ID가 다릅니다.");
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(env.S3_BUCKET_NAME))
    throw new Error("S3 버킷 이름 형식이 올바르지 않습니다.");
  if (!/^[A-Z0-9]{10,32}$/.test(env.CLOUDFRONT_DISTRIBUTION_ID))
    throw new Error("CloudFront 배포 ID 형식이 올바르지 않습니다.");
  const site = new URL(env.SITE_URL);
  if (
    site.protocol !== "https:" ||
    site.username ||
    site.password ||
    site.port ||
    site.pathname !== "/" ||
    site.search ||
    site.hash
  )
    throw new Error(
      "SITE_URL에는 활성화된 HTTPS 사이트의 루트 주소만 입력하세요.",
    );
  return {
    region: env.AWS_REGION,
    account: env.AWS_ACCOUNT_ID,
    bucket: env.S3_BUCKET_NAME,
    distributionId: env.CLOUDFRONT_DISTRIBUTION_ID,
    site,
  };
}

export function assertIdentity(identity, config) {
  if (identity.Account !== config.account)
    throw new Error("실제 AWS 계정이 지정한 배포 계정과 다릅니다.");
}

export function assertPrivateBucket(result) {
  const block = result.PublicAccessBlockConfiguration;
  if (
    ![
      "BlockPublicAcls",
      "IgnorePublicAcls",
      "BlockPublicPolicy",
      "RestrictPublicBuckets",
    ].every((key) => block?.[key] === true)
  )
    throw new Error("배포 대상 S3의 공개 접근 차단 설정을 확인하세요.");
}

export function assertDistribution(distribution, config) {
  const settings = distribution.DistributionConfig;
  const origin = settings?.Origins?.Items?.find(
    (item) => item.Id === settings.DefaultCacheBehavior?.TargetOriginId,
  );
  const bucketHosts = [
    `${config.bucket}.s3.${config.region}.amazonaws.com`,
    `${config.bucket}.s3.amazonaws.com`,
  ];
  if (
    distribution.Id !== config.distributionId ||
    distribution.Status !== "Deployed" ||
    !settings?.Enabled ||
    !origin?.OriginAccessControlId ||
    !bucketHosts.includes(origin.DomainName)
  )
    throw new Error(
      "CloudFront의 기본 원본이 지정한 비공개 S3/OAC와 일치하지 않습니다.",
    );
  const hosts = [distribution.DomainName, ...(settings.Aliases?.Items ?? [])];
  if (!hosts.includes(config.site.hostname))
    throw new Error(
      "SITE_URL이 지정한 CloudFront 배포의 주소/별칭과 다릅니다.",
    );
}

export function assertBuild(directory) {
  for (const filename of ["index.html", "404.html"]) {
    const file = path.join(directory, filename);
    if (!lstatSync(file).isFile())
      throw new Error(`정상적인 정적 빌드 파일이 필요합니다: ${filename}`);
  }
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function main() {
  const config = readConfiguration(process.env);
  const out = path.join(root, "out");
  assertBuild(out);
  if (process.argv.includes("--check")) {
    console.log(
      "배포 설정과 정적 산출물 확인 완료. AWS 호출은 하지 않았습니다.",
    );
    return;
  }

  const awsEnv = { ...process.env, AWS_PAGER: "", AWS_CLI_AUTO_PROMPT: "off" };
  const common = [
    "--region",
    config.region,
    "--no-cli-pager",
    "--cli-connect-timeout",
    "10",
    "--cli-read-timeout",
    "30",
  ];
  function aws(args, json = true) {
    const result = spawnSync(
      "aws",
      [...args, ...common, ...(json ? ["--output", "json"] : [])],
      { cwd: root, env: awsEnv, encoding: "utf8", maxBuffer: 5 * 1024 * 1024 },
    );
    if (result.error) throw result.error;
    if (result.status !== 0)
      throw new Error(result.stderr.trim() || "AWS 명령이 실패했습니다.");
    return json && result.stdout.trim() ? JSON.parse(result.stdout) : undefined;
  }
  assertIdentity(aws(["sts", "get-caller-identity"]), config);
  assertPrivateBucket(
    aws([
      "s3api",
      "get-public-access-block",
      "--bucket",
      config.bucket,
      "--expected-bucket-owner",
      config.account,
    ]),
  );
  assertDistribution(
    aws(["cloudfront", "get-distribution", "--id", config.distributionId])
      .Distribution,
    config,
  );

  const destination = `s3://${config.bucket}/`;
  // 먼저 버전이 붙은 자산, 다음 일반 자산, 마지막 HTML을 올립니다. 이전 JS는 지우지 않습니다.
  console.log("1/3 버전별 정적 자산 업로드");
  aws(
    [
      "s3",
      "sync",
      "out/",
      destination,
      "--exclude",
      "*",
      "--include",
      "_next/static/*",
      "--size-only",
      "--cache-control",
      "public,max-age=31536000,immutable",
      "--only-show-errors",
    ],
    false,
  );
  console.log("2/3 일반 자산 업로드");
  aws(
    [
      "s3",
      "cp",
      "out/",
      destination,
      "--recursive",
      "--exclude",
      "_next/static/*",
      "--exclude",
      "*.html",
      "--cache-control",
      "public,max-age=300",
      "--only-show-errors",
    ],
    false,
  );
  console.log("3/3 HTML 반영");
  // cp는 과거 실행의 아티팩트도 타임스탬프에 관계없이 다시 반영합니다.
  aws(
    [
      "s3",
      "cp",
      "out/",
      destination,
      "--recursive",
      "--exclude",
      "*",
      "--include",
      "*.html",
      "--cache-control",
      "public,max-age=0,s-maxage=300,must-revalidate",
      "--only-show-errors",
    ],
    false,
  );
  const { Invalidation } = aws([
    "cloudfront",
    "create-invalidation",
    "--distribution-id",
    config.distributionId,
    "--paths",
    "/*",
  ]);
  aws([
    "cloudfront",
    "wait",
    "invalidation-completed",
    "--distribution-id",
    config.distributionId,
    "--id",
    Invalidation.Id,
  ]);

  const expected = sha256(readFileSync(path.join(out, "index.html")));
  let error;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(config.site, {
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
      if (
        response.status !== 200 ||
        !response.headers.get("content-type")?.includes("text/html")
      )
        throw new Error(`사이트 응답이 올바르지 않습니다: ${response.status}`);
      if (sha256(Buffer.from(await response.arrayBuffer())) !== expected)
        throw new Error("사이트 HTML이 이번 빌드 산출물과 다릅니다.");
      console.log(`배포 검증 완료: ${config.site.origin}`);
      return;
    } catch (caught) {
      error = caught;
      if (attempt < 2)
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw error;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
