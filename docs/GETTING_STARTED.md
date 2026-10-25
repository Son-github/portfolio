# GitHub 업로드부터 최초 자동 배포까지

이 문서의 명령은 **사용자가 직접 실행하는 순서**입니다. 문서 작성 과정에서는 Git 초기화·push, Terraform 명령, AWS 변경을 실행하지 않았습니다.

구성은 **비공개 S3 + CloudFront 종량제 + ACM + 가비아 DNS**입니다. Route 53, WAF, CloudFront Free 정액제 구독은 없습니다. 도메인은 가비아 CNAME으로 연결하기 쉬운 **`www.son-portfolio.site`**를 기준으로 합니다.

## 1. 포트폴리오 폴더에 Git 저장소 만들기

현재 확인한 Git 루트는 `/Users/jonginson`입니다. 먼저 프로젝트 폴더에 별도 저장소를 만들어 홈 폴더 저장소와 분리합니다.

```sh
cd ~/Desktop/포트폴리오_웹사이트
git init -b main
git rev-parse --show-toplevel
```

마지막 출력이 **포트폴리오_웹사이트 폴더**인지 확인한 후 진행합니다. `/Users/jonginson`만 표시되는 상태에서 진행하지 않습니다. 홈 폴더의 기존 `.git`은 삭제하지 않습니다.

```sh
git add .
git status --short
git commit -m "Set up portfolio and deployment pipeline"
git remote add origin https://github.com/Son-github/portfolio.git
git push -u origin main
```

`.env*`, 실제 `.tfvars`, `.tfstate`, `.tfplan`, `.terraform/`, `node_modules/`, `.next/`, `out/`은 `.gitignore`로 제외합니다. `.tfvars.example`은 참고 파일이므로 포함합니다.

이미 이 폴더 안에 별도 Git 저장소를 만든 경우에는 원격 주소와 브랜치를 먼저 확인하고 초기화/원격 추가를 반복하지 않습니다. 원격에 기존 커밋이 있어 push가 거절되면 강제 push하지 않고 이력을 먼저 확인합니다.

## 2. GitHub에서 CI 성공 확인

저장소의 **Actions → Portfolio CI and Deploy**에서 검사·테스트·빌드가 통과하는지 확인합니다. 초기에는 `DEPLOY_ENABLED` 변수가 없으므로 **배포 작업은 skipped**가 정상입니다.

Next.js가 생성하는 경로 타입을 사용하므로 워크플로는 빌드 후 별도 타입 검사도 실행합니다. CI에 AWS 장기 키나 Terraform 실행은 필요하지 않습니다.

## 3. AWS와 Terraform 초기 값 준비

여기부터는 사용자가 직접 실제 AWS 자원을 준비하는 단계입니다. **실행하면 저장·요청·트래픽에 따라 비용이 발생할 수 있습니다.**

프로젝트 폴더에서:

```sh
cd infra/terraform
cp -n terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars`를 열고 다음을 확인합니다.

```hcl
aws_profile         = "default"
aws_region          = "ap-northeast-2"
expected_account_id = "본인의 12자리 AWS 계정 ID"
project_name        = "son-jongin-portfolio"
domain_name         = "www.son-portfolio.site"

request_certificate  = false
enable_custom_domain = false
force_destroy_bucket = false

enable_github_actions = true
github_repository     = "Son-github/portfolio"
github_deploy_branch  = "main"
github_owner_id       = "83553103"
github_repository_id  = "1432895806"
```

`aws_region`과 GitHub `AWS_REGION`은 S3가 위치한 서울(`ap-northeast-2`)입니다. CloudFront용 인증서만 Terraform의 `aws.us_east_1` 제공자로 버지니아에 생성합니다.

`expected_account_id`는 본인 default 프로필의 계정과 같아야 합니다. 확인이 필요하면 직접 `aws sts get-caller-identity --profile default`를 실행할 수 있습니다.

AWS IAM 콘솔의 Identity providers에서 `token.actions.githubusercontent.com`이 이미 있는지도 확인합니다.

- 이미 있으면 `create_github_oidc_provider = false`로 재사용합니다. audience에 `sts.amazonaws.com`이 있어야 합니다.
- 없으면 `create_github_oidc_provider = true`로 구성합니다.

모든 값을 검토한 다음에만 사용자가 직접 실행합니다.

```sh
terraform init
terraform validate
terraform plan -out=portfolio.tfplan
```

계획의 생성 대상과 계정이 맞는지 확인한 뒤:

```sh
terraform apply portfolio.tfplan
```

예상 대상은 S3·CloudFront·OAC·선택한 OIDC/IAM 역할입니다. 이 단계에는 WAF·Route 53·Free 구독·ACM 인증서가 없어야 합니다. 별도 EC2·ECS·ALB·NAT·RDS도 만들지 않습니다. 적용이 끝나면:

```sh
terraform output github_actions_variables
```

이 출력은 다음 단계에서 사용할 값입니다. 로컬 상태 파일은 Git에 올리지 않으며, 이후 같은 인프라를 수정할 때도 이 작업 폴더와 상태를 유지합니다. 초기화로 생성된 `.terraform.lock.hcl`은 버전 관리할 수 있습니다.

## 4. GitHub Repository Variables 등록

저장소 **Settings → Secrets and variables → Actions → Variables**에서 Repository Variable을 등록합니다.

| 이름                         | 값                                                            |
| ---------------------------- | ------------------------------------------------------------- |
| `DEPLOY_ENABLED`             | 처음에는 `false`, 나머지 등록을 마친 뒤 `true`                |
| `AWS_ROLE_ARN`               | `github_deploy_role_arn` 출력. null이면 역할 활성화 설정 확인 |
| `AWS_ACCOUNT_ID`             | 본인의 12자리 계정 ID                                         |
| `AWS_REGION`                 | `ap-northeast-2`                                              |
| `S3_BUCKET_NAME`             | `bucket_name` 출력                                            |
| `CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` 출력                             |
| `SITE_URL`                   | 최초에는 `cloudfront_url` 출력의 HTTPS 주소                   |

AWS access key와 secret key를 Secrets에 등록하지 않습니다. OIDC 임시 자격 증명을 사용합니다. Environment Variables가 아닌 **Repository Variables**에 넣습니다.

## 5. 첫 배포 실행

CDN 생성과 변수 등록이 끝나면 `DEPLOY_ENABLED`를 `true`로 바꿉니다. **Actions → Portfolio CI and Deploy → Run workflow → main**으로 최초 배포를 실행합니다.

워크플로가 S3에 파일을 올리고 CDN 캐시 갱신 뒤 실제 HTML을 검증합니다. 완료 후 `SITE_URL` 주소에서 포트폴리오를 확인합니다. 아직 빈 버킷에 파일을 올리기 전이면 기본 CDN 주소에서 403/404가 보일 수 있습니다.

이후 `main`에 push하면 같은 과정이 자동 실행됩니다. GitHub 변수만 바꾸는 동작은 워크플로를 자동 시작하지 않으므로 최초 실행이나 변수 변경 검증에는 수동 실행을 사용합니다.

## 6. 가비아 도메인과 HTTPS 연결

기본 주소로 배포가 정상 동작한 뒤 진행합니다. **네임서버는 가비아를 유지합니다.** 이전에 전달한 AWS 네임서버 4개는 삭제된 영역의 값이므로 사용하지 않습니다. 이미 변경했다면 가비아 기본 네임서버로 되돌린 뒤 DNS를 관리합니다.

### 인증서 요청

로컬 `terraform.tfvars`에서:

```hcl
request_certificate  = true
enable_custom_domain = false
```

변경할 때마다 새 계획을 만들어 검토한 뒤 직접 반영합니다. 이전 단계의 저장된 계획을 재사용하지 않습니다.

```sh
terraform plan -out=portfolio.tfplan
terraform apply portfolio.tfplan
terraform output acm_dns_validation_records
```

출력의 **name / type(CNAME) / value**를 가비아 DNS 관리 화면에 등록합니다. 이 레코드는 인증용이며 서비스용 `www` CNAME과 다릅니다.

가비아 입력란이 도메인 이름을 자동으로 붙인다면 호스트에서 `son-portfolio.site` 부분을 중복 입력하지 않습니다. 예를 들어 `_abc.www.son-portfolio.site.`의 호스트 부분은 `_abc.www`입니다. 실제 출력과 입력 화면을 확인해 등록합니다. 인증용 CNAME은 자동 갱신에도 필요하므로 유지합니다.

### 인증서와 도메인 별칭 연결

AWS ACM 콘솔의 **미국 동부 버지니아 북부(us-east-1)**에서 해당 인증서가 `ISSUED`인지 확인합니다. 그다음:

```hcl
request_certificate  = true
enable_custom_domain = true
```

다시 새 계획을 검토·반영하면 CloudFront에 인증서와 `www.son-portfolio.site` 별칭을 연결합니다. CDN 업데이트가 완료된 후:

```sh
terraform output cloudfront_domain_name
```

가비아 DNS에 서비스용 레코드를 추가합니다.

| 유형  | 호스트 | 값                                        |
| ----- | ------ | ----------------------------------------- |
| CNAME | `www`  | 위에서 출력된 `xxxxx.cloudfront.net` 주소 |

값에 `https://`나 경로는 넣지 않습니다. DNS 반영 뒤 `https://www.son-portfolio.site` 접속을 확인하고, GitHub `SITE_URL`도 이 주소로 바꿔 워크플로를 다시 실행합니다. Open Graph URL도 새 도메인으로 빌드됩니다.

루트 `https://son-portfolio.site`는 이번 구성에 별도로 연결하지 않습니다. 해당 주소도 필요하면 가비아의 루트 연결/포워딩 지원 방식을 검토해야 하며, CloudFront IP를 임의로 A 레코드에 고정하지 않습니다.

## 7. 이후 평소 작업

프로젝트 루트에서 수정·저장한 뒤:

```sh
git add .
git commit -m "Update portfolio content"
git push
```

GitHub Actions가 검사와 배포를 수행합니다. 인프라 변경은 이 파이프라인에서 실행하지 않습니다. 서버를 로컬에서 켰다면 작업 후 해당 터미널에서 **Control + C**로 종료합니다.

상세 권한·캐시·실패 대응은 [배포 안내](DEPLOYMENT.md), 리소스별 설명은 [Terraform 안내](../infra/terraform/README.md)에 있습니다.
