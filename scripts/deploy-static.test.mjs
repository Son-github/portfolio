import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  readConfiguration,
  assertIdentity,
  assertPrivateBucket,
  assertDistribution,
  assertBuild,
} from "./deploy-static.mjs";

const base = {
  GITHUB_ACTIONS: "true",
  GITHUB_REPOSITORY: "Son-github/portfolio",
  GITHUB_REF: "refs/heads/main",
  GITHUB_EVENT_NAME: "push",
  AWS_REGION: "ap-northeast-2",
  AWS_ACCOUNT_ID: "111111111111",
  AWS_ROLE_ARN: "arn:aws:iam::111111111111:role/test-deploy",
  S3_BUCKET_NAME: "test-portfolio-bucket",
  CLOUDFRONT_DISTRIBUTION_ID: "ETEST1234567890",
  SITE_URL: "https://portfolio.example.com",
};
function distribution() {
  return {
    Id: base.CLOUDFRONT_DISTRIBUTION_ID,
    Status: "Deployed",
    DomainName: "example.cloudfront.net",
    DistributionConfig: {
      Enabled: true,
      DefaultCacheBehavior: { TargetOriginId: "site" },
      Aliases: { Items: ["portfolio.example.com"] },
      Origins: {
        Items: [
          {
            Id: "site",
            DomainName: `${base.S3_BUCKET_NAME}.s3.${base.AWS_REGION}.amazonaws.com`,
            OriginAccessControlId: "test-oac",
          },
        ],
      },
    },
  };
}

test("trusted main push and manual run can validate without contacting AWS", () => {
  assert.equal(readConfiguration(base).bucket, base.S3_BUCKET_NAME);
  assert.equal(
    readConfiguration({ ...base, GITHUB_EVENT_NAME: "workflow_dispatch" })
      .account,
    base.AWS_ACCOUNT_ID,
  );
});

test("local, fork, PR, and other branches are blocked before deployment", () => {
  for (const override of [
    { GITHUB_ACTIONS: "false" },
    { GITHUB_REPOSITORY: "fork/portfolio" },
    { GITHUB_REF: "refs/heads/feature" },
    { GITHUB_EVENT_NAME: "pull_request_target" },
  ]) {
    assert.throws(
      () => readConfiguration({ ...base, ...override }),
      /main GitHub Actions/,
    );
  }
  const script = fileURLToPath(new URL("./deploy-static.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [script], {
    env: { ...process.env, GITHUB_ACTIONS: "false" },
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /main GitHub Actions/);
});

test("missing settings, cross-account roles, and non-root HTTPS URLs are rejected", () => {
  assert.throws(
    () => readConfiguration({ ...base, S3_BUCKET_NAME: "" }),
    /필수/,
  );
  assert.throws(
    () => readConfiguration({ ...base, AWS_ACCOUNT_ID: "222222222222" }),
    /역할 ARN/,
  );
  for (const url of [
    "http://portfolio.example.com",
    "https://user:password@portfolio.example.com",
    "https://portfolio.example.com/path",
    "https://portfolio.example.com?key=value",
  ]) {
    assert.throws(
      () => readConfiguration({ ...base, SITE_URL: url }),
      /HTTPS 사이트/,
    );
  }
});

test("an authenticated but wrong AWS account cannot publish", () => {
  assert.throws(
    () => assertIdentity({ Account: "222222222222" }, readConfiguration(base)),
    /실제 AWS 계정/,
  );
});

test("all four bucket public-access protections must be enabled", () => {
  const block = {
    BlockPublicAcls: true,
    IgnorePublicAcls: true,
    BlockPublicPolicy: true,
    RestrictPublicBuckets: true,
  };
  assert.doesNotThrow(() =>
    assertPrivateBucket({ PublicAccessBlockConfiguration: block }),
  );
  for (const key of Object.keys(block))
    assert.throws(
      () =>
        assertPrivateBucket({
          PublicAccessBlockConfiguration: { ...block, [key]: false },
        }),
      /공개 접근 차단/,
    );
});

test("CDN must use the expected bucket, OAC, distribution ID, and site hostname", () => {
  const config = readConfiguration(base);
  assert.doesNotThrow(() => assertDistribution(distribution(), config));
  const wrongBucket = distribution();
  wrongBucket.DistributionConfig.Origins.Items[0].DomainName =
    "another-bucket.s3.ap-northeast-2.amazonaws.com";
  assert.throws(() => assertDistribution(wrongBucket, config), /기본 원본/);
  const noOac = distribution();
  delete noOac.DistributionConfig.Origins.Items[0].OriginAccessControlId;
  assert.throws(() => assertDistribution(noOac, config), /기본 원본/);
  assert.throws(
    () => assertDistribution({ ...distribution(), Id: "OTHER" }, config),
    /기본 원본/,
  );
  assert.throws(
    () =>
      assertDistribution({ ...distribution(), Status: "InProgress" }, config),
    /기본 원본/,
  );
  assert.throws(
    () =>
      assertDistribution(distribution(), {
        ...config,
        site: new URL("https://unrelated.example.com"),
      }),
    /별칭/,
  );
});

test("incomplete or symlinked HTML build entries cannot be uploaded", (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), "portfolio-build-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  assert.throws(() => assertBuild(directory));
  writeFileSync(path.join(directory, "index.html"), "<html></html>");
  writeFileSync(path.join(directory, "404.html"), "not found");
  assert.doesNotThrow(() => assertBuild(directory));
  rmSync(path.join(directory, "index.html"));
  symlinkSync(
    path.join(directory, "404.html"),
    path.join(directory, "index.html"),
  );
  assert.throws(() => assertBuild(directory), /정적 빌드 파일/);
});

test("deployment uses Seoul and rejects an origin in the certificate region", () => {
  assert.equal(readConfiguration(base).region, "ap-northeast-2");
  assert.throws(
    () => readConfiguration({ ...base, AWS_REGION: "us-east-1" }),
    /서울/,
  );
  const wrongRegion = distribution();
  wrongRegion.DistributionConfig.Origins.Items[0].DomainName = `${base.S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com`;
  assert.throws(
    () => assertDistribution(wrongRegion, readConfiguration(base)),
    /기본 원본/,
  );
});
