# 포트폴리오용 Terraform 구성 파일

비공개 S3 + CloudFront + 선택적 ACM 인증서 구성입니다. DNS는 가비아에서 관리합니다. **Route 53, WAF, CloudFront Free 정액제 구독은 생성하지 않습니다.**

설정 파일만 제공하며, 이번 작업에서 Terraform 명령이나 AWS 변경은 실행하지 않았습니다. 실제 애플리케이션 배포는 [GitHub Actions](../../docs/DEPLOYMENT.md)가 담당하고, 워크플로에서 인프라를 생성하지 않습니다.

## 구조

```text
방문자 → CloudFront HTTPS → OAC 서명 → 비공개 S3(서울 ap-northeast-2)
가비아 DNS: www CNAME → CloudFront
ACM(us-east-1): DNS 소유권 검증 후 인증서 연결
GitHub main → 검사·빌드 → OIDC 임시 역할 → S3 업로드·CDN 캐시 갱신
```

기본 서비스 도메인은 `www.son-portfolio.site`입니다. 루트 `son-portfolio.site`의 별도 연결/리디렉션은 포함하지 않습니다. 가비아 네임서버를 유지하고 DNS 레코드를 수정합니다.

## 파일별 역할

| 파일                          | 역할                                                   |
| ----------------------------- | ------------------------------------------------------ |
| `versions.tf`, `providers.tf` | 제공자 버전, 계정 제한, 프로필·리전                    |
| `variables.tf`, `main.tf`     | 변수 검증, 이름 규칙, AWS 관리형 정책 ID               |
| `storage.tf`                  | 비공개 S3, AES256 암호화, 해당 CDN만 읽도록 허용       |
| `cdn.tf`                      | CloudFront 종량제, HTTPS, 압축, 캐시, 404 처리         |
| `dns.tf`                      | ACM 인증서 요청과 발급 확인. DNS 레코드는 만들지 않음  |
| `github-actions.tf`           | 특정 저장소·브랜치에 제한한 OIDC 역할과 최소 배포 권한 |
| `outputs.tf`                  | 버킷·CDN·역할·인증용 CNAME 출력                        |
| `terraform.tfvars.example`    | 실제 설정을 작성할 때 참고하는 예제                    |

## 처음 준비

Git 업로드, 로컬 Terraform 설정, GitHub 변수 등록, 가비아 CNAME 등록은 [처음 배포 안내](../../docs/GETTING_STARTED.md)에 순서대로 정리했습니다. 해당 문서의 Terraform 명령은 **사용자가 실행할 때 실제 AWS 자원을 생성하고 비용이 발생할 수 있는 절차**입니다. 이 파일 작성 작업에서는 실행하지 않았습니다.

AWS 프로필은 `default`입니다. 기본 제공자는 서울(`ap-northeast-2`)을 사용하며 S3·배포 대상 리전도 서울입니다. CloudFront용 ACM 인증서와 발급 확인만 `aws.us_east_1` 별칭 제공자로 버지니아(`us-east-1`)를 사용합니다. 두 제공자 모두 같은 프로필과 계정 제한을 적용합니다. `expected_account_id`로 의도한 계정만 허용하고 인증 키는 코드에 저장하지 않습니다.

## 단계별 플래그

| 단계                       | `request_certificate` | `enable_custom_domain` | 결과                                                                  |
| -------------------------- | --------------------- | ---------------------- | --------------------------------------------------------------------- |
| 기본 주소로 최초 배포      | false                 | false                  | S3·CloudFront 기본 HTTPS 주소                                         |
| 인증서만 요청              | true                  | false                  | ACM 인증 CNAME을 출력. 외부 DNS 입력을 기다리며 전체 구성을 막지 않음 |
| 인증서 ISSUED 확인 후 연결 | true                  | true                   | 검증된 인증서를 CDN 별칭에 연결                                       |

가비아에 `acm_dns_validation_records` 출력의 CNAME을 등록하고 인증서 발급이 끝난 뒤 연결합니다. 인증 CNAME은 자동 갱신에도 사용되므로 유지합니다. 서비스용 `www` CNAME은 `cloudfront_domain_name` 출력으로 별도로 등록합니다.

## GitHub Actions 권한

- `enable_github_actions`는 기본 false입니다. 사용자가 초기 인프라를 준비할 때 배포 역할도 필요하면 true로 지정합니다.
- `github_repository`는 `Son-github/portfolio`, `github_deploy_branch`는 `main`입니다.
- `create_github_oidc_provider = false`는 기존 GitHub OIDC 제공자를 읽어 재사용합니다. 계정에 제공자가 없을 때만 true로 지정합니다.
- 역할은 해당 S3 버킷의 조회·업로드와 해당 CDN의 조회·캐시 갱신만 허용합니다. 인프라 변경·객체 삭제 권한은 없습니다.
- `github_actions_variables` 출력은 GitHub Repository Variables로 옮길 값입니다. `DEPLOY_ENABLED`는 false로 출력하므로 준비가 끝난 뒤 별도로 활성화합니다.

## 비용 범위

CloudFront는 종량제입니다. 2026-10-25 기준 전송 1TB·HTTP/HTTPS 요청 1,000만 건의 월 무료 사용량이 있으며, 계정/조직의 다른 사용량과 공유될 수 있고 초과분은 과금됩니다. 정액제의 S3 저장 크레딧은 이 구성에 포함되지 않습니다.

S3 저장·PUT/GET/LIST, 무료 범위 밖의 CDN 사용 및 무효화 요청, 가비아 도메인 등록·갱신 비용은 별도입니다. 무료 적용이나 월 지출 상한을 보장하지 않습니다.

EC2, ECS, ALB, NAT Gateway, RDS, KMS 키, 로그 저장소, 원격 상태용 S3는 정의하지 않습니다. IAM/OIDC 배포 역할은 선택적이며 장기 AWS 키를 GitHub에 보관하지 않습니다.

`force_destroy_bucket = false`로 파일이 있는 버킷의 강제 삭제를 방지합니다. 이전 빌드 파일은 자동 삭제하지 않으므로 장기 운영 시 사용자가 별도로 관리합니다.

## 검증 범위

초기 파일 작성 단계에서는 Terraform 명령을 실행하지 않았습니다. 이후 운영 기능 추가(2026-10-25)에서 사용자의 요청에 따라 `fmt`, `validate`, 읽기 전용 `plan`을 수행했습니다. `apply`는 실행하지 않았습니다. 결과와 기존 CloudFront drift는 [검증 기록](../../docs/OPERATIONS-VALIDATION.md)에 정리했습니다. `.tfvars`, `.tfstate`, 계획 파일과 `.terraform/`은 Git에서 제외하고, 제공자 잠금 파일 `.terraform.lock.hcl`은 향후 초기화 후 버전 관리할 수 있습니다.

## 공식 참고

- [CloudFront 종량제 요금](https://aws.amazon.com/cloudfront/faqs/)
- [S3 요금](https://aws.amazon.com/s3/pricing/)
- [ACM DNS 검증](https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html)
- [CloudFront 도메인 연결](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html)

## OIDC subject 형식과 인증 실패 확인

`Son-github/portfolio`는 2026-10-25 생성된 저장소이므로, 2026-07-15 이후의 숫자 ID 포함 subject를 사용합니다. 공개 GitHub API로 확인한 소유자 ID는 `83553103`, 저장소 ID는 `1432895806`입니다.

```text
repo:Son-github@83553103/portfolio@1432895806:ref:refs/heads/main
```

`github_owner_id`, `github_repository_id`로 숫자 ID를 관리하며, IAM은 `StringEquals`로 이 subject 하나와 `sts.amazonaws.com` audience를 허용합니다. 와일드카드로 조건을 넓히지 않습니다. 저장소를 변경·재생성하면 숫자 ID와 이름을 함께 확인해야 합니다.

`Not authorized to perform sts:AssumeRoleWithWebIdentity`가 발생하면 Actions의 `Inspect OIDC subject without logging the token` 단계에 나온 `sub`/`aud`, AWS 역할의 신뢰 정책, GitHub `AWS_ROLE_ARN`을 대조합니다. 이 단계는 JWT 원문을 출력하지 않습니다. 커스텀 subject나 GitHub Environment를 사용하는 경우에는 실제 발급 형식과 맞춰야 합니다.

Terraform 파일을 push하는 것만으로 AWS 역할 정책이 바뀌지는 않습니다. 사용자가 로컬에서 새 계획을 검토하고 신뢰 정책 변경을 직접 반영해야 합니다. 기존 인프라를 먼저 삭제할 필요는 없습니다.

[GitHub의 immutable subject 공식 설명](https://docs.github.com/en/actions/reference/security/oidc#immutable-subject-claims)

## 기존 예산과 운영 관측

`budgets.tf`는 새 예산을 만들지 않고 `My Monthly Cost Budget`을 조건부 import합니다. `enable_cost_budget` 기본값은 false입니다. 기존 월 $5 한도·비용 기준·3개 알림 조건을 유지하며 ACTUAL 절대 금액 $1·$3 초과 이메일을 추가합니다. 5개 알림 수신자는 민감 변수 `budget_alert_email`로 통일합니다. Budget Actions는 없습니다.

감시 범위는 계정 전체이며 크레딧·환불 제외 UnblendedCost 기준입니다. 이 예산의 Project 태그는 비용 필터가 아닙니다. 알림 집계에는 지연이 있으며 결제 상한이나 자동 차단이 아닙니다.

기존 CloudFront에 별도 origin drift가 있어 전체 계획의 무검토 적용은 피해야 합니다. 이번 예산 편입의 제한된 계획·사용자 적용 절차, 이메일 입력과 수동 중지·재개는 [운영 안내](../../docs/OPERATIONS.md)를 확인하세요. AWS 호스팅·가비아 DNS에는 변경이 없습니다.
