# GitHub Actions 배포·운영 안내

대상 저장소는 **`Son-github/portfolio`**, 배포 브랜치는 **`main`**입니다. 이 구성은 워크플로·스크립트·IAM 정의만 제공하며, AWS 설정 변경이나 Terraform 실행, GitHub 변수 등록, 실제 배포는 수행하지 않았습니다.

## 배포 흐름

```text
PR → npm ci → lint → 배포 검사 테스트 → 정적 빌드 → typecheck → 아티팩트 보관
main push / main에서 수동 실행
  → 같은 검사와 빌드
  → 빌드한 아티팩트를 ID로 다운로드
  → 필수 설정 검사
  → GitHub OIDC로 15분짜리 AWS 임시 자격 증명 발급
  → AWS 계정·S3 공개 차단·CloudFront 원본 확인
  → 버전 자산 → 일반 자산 → HTML 순서로 업로드
  → CDN 캐시 갱신 완료 대기
  → 실제 사이트 HTML과 빌드 HTML의 SHA-256 비교
```

- PR, 포크, `main` 이외의 브랜치는 AWS 배포를 하지 않습니다.
- `DEPLOY_ENABLED`가 정확히 `true`일 때만 배포 작업을 실행합니다. 초기에는 검증·빌드만 실행할 수 있습니다.
- 실행 중인 배포를 새 push 때문에 취소하지 않고 같은 브랜치의 실행을 직렬화합니다. GitHub의 동시 실행 규칙에 따라 대기 중인 중간 실행 대신 최신 실행이 남을 수 있습니다.
- 배포 작업은 빌드 작업의 산출물을 그대로 사용합니다. 다른 러너에서 재빌드하지 않습니다.
- 외부 Actions는 확인한 커밋 SHA로 고정했습니다. 버전 갱신 시 공식 저장소의 태그·변경 사항을 확인해 SHA와 주석을 함께 수정합니다.

처음 GitHub에 올리는 순서부터 보려면 [처음 배포 안내](GETTING_STARTED.md)를 참고하세요.

## 처음 활성화할 때 필요한 것

### 1. 호스팅과 배포 역할 준비

[Terraform 구성](../infra/terraform/README.md)에 다음 정의가 포함되어 있습니다.

- 비공개 S3, CloudFront/OAC 종량제, 가비아 DNS에서 검증하는 선택적 ACM 인증서
- `github-actions.tf`의 OIDC 제공자 조회/생성, 배포 역할과 최소 권한

기본 `enable_github_actions`는 `false`입니다. 사용자가 향후 인프라를 직접 준비할 때 아래 값을 검토합니다. 이 문서나 워크플로에서 Terraform 초기화·계획·적용을 자동 실행하지 않습니다.

| Terraform 변수                | 용도                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `enable_github_actions`       | 역할 구성이 필요하면 사용자가 `true`로 지정                                                      |
| `github_repository`           | `Son-github/portfolio`                                                                           |
| `github_deploy_branch`        | `main`                                                                                           |
| `create_github_oidc_provider` | 기존 GitHub OIDC 제공자가 있으면 `false`로 재사용. 계정에 없는 경우에만 `true`로 생성하도록 지정 |

CDN 생성 완료를 확인한 뒤 콘텐츠 배포를 활성화합니다. Route 53·WAF·Free 정액제 구독은 정의하지 않습니다. 현재는 구성 파일만 있으며, 삭제한 과거 리소스의 ID를 재사용하지 않습니다.

### 2. GitHub Repository Variables 등록

저장소 Settings의 **Actions → Variables**에 등록합니다. Environment Variables가 아닌 Repository Variables를 사용합니다.

| 변수                         | 입력할 값                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| `DEPLOY_ENABLED`             | 초기에는 `false`. 모든 설정이 준비되면 `true`                                                          |
| `AWS_ROLE_ARN`               | Terraform의 `github_deploy_role_arn`                                                                   |
| `AWS_ACCOUNT_ID`             | `expected_account_id`와 같은 12자리 계정 ID                                                            |
| `AWS_REGION`                 | `ap-northeast-2`                                                                                       |
| `S3_BUCKET_NAME`             | Terraform의 `bucket_name`                                                                              |
| `CLOUDFRONT_DISTRIBUTION_ID` | Terraform의 `cloudfront_distribution_id`                                                               |
| `SITE_URL`                   | **실제로 접속 가능한** HTTPS 루트 주소. 도메인 연결 전에는 `cloudfront_url`, 연결 후에는 `website_url` |

S3와 파일 업로드는 서울(`ap-northeast-2`), CloudFront용 ACM 인증서는 버지니아(`us-east-1`)를 사용합니다. GitHub `AWS_REGION`에는 인증서 리전이 아닌 서울을 입력합니다. CloudFront와 IAM/OIDC는 글로벌 서비스입니다.

`github_actions_variables` 출력에도 대응하는 값이 정리되어 있습니다. 출력은 `DEPLOY_ENABLED = false`를 기본으로 하므로 배포 활성화는 별도로 결정합니다. AWS access key나 secret key를 GitHub Secrets에 넣을 필요는 없습니다.

`SITE_URL`은 빌드 시 `NEXT_PUBLIC_SITE_URL`로 사용되어 Open Graph URL에도 반영됩니다. HTTP, 경로·쿼리·인증 정보가 포함된 URL은 배포 도구에서 거부합니다. 아직 인증서나 DNS가 준비되지 않은 도메인을 먼저 입력하지 않습니다.

### 3. 코드 반영

워크플로를 저장소에 반영하고 설정을 완료하면, 이후 `main`에 push할 때 자동으로 검사·배포합니다. 수동 실행은 Actions의 **Portfolio CI and Deploy**에서 `main`을 선택합니다. 실제 저장소 업로드나 워크플로 실행은 이번 파일 작성 작업에 포함하지 않았습니다.

## OIDC 신뢰 범위와 IAM 권한

역할의 신뢰 조건은 다음 두 값이 정확히 일치해야 합니다.

```text
aud = sts.amazonaws.com
sub = repo:Son-github@83553103/portfolio@1432895806:ref:refs/heads/main
```

단일 저장소·브랜치에 제한하며 와일드카드는 사용하지 않습니다. 워크플로의 `id-token: write`는 배포 작업에만 있습니다. 빌드 작업에는 AWS 자격 증명을 전달하지 않습니다.

배포 역할은 해당 버킷의 `ListBucket`, `GetBucketPublicAccessBlock`, 객체 `GetObject`/`PutObject`, 해당 CloudFront의 `GetDistribution`/`CreateInvalidation`/`GetInvalidation`만 허용합니다. IAM·Terraform·DNS·WAF·요금제 변경이나 S3 객체 삭제 권한은 부여하지 않습니다.

계정의 기존 OIDC 제공자를 재사용할 때는 Terraform data source로만 참조하므로 다른 서비스가 공유하는 제공자를 이 구성의 소유 리소스로 가져오지 않습니다. GitHub에는 AWS 장기 키 대신 OIDC 임시 자격 증명을 사용합니다.

현재 워크플로는 GitHub Environment를 사용하지 않습니다. 향후 `environment:`를 추가하면 OIDC의 `sub` 형식이 달라지므로 신뢰 정책과 배포 브랜치 보호 설정도 함께 검토해야 합니다.

## 캐시·업로드 방식

| 파일                      | 업로드                          | 캐시                     |
| ------------------------- | ------------------------------- | ------------------------ |
| `_next/static/`           | 해시/빌드 버전 자산을 먼저 sync | 1년, immutable           |
| 일반 이미지·SVG·기타 파일 | 기존 타임스탬프에 관계없이 복사 | 5분                      |
| HTML                      | 마지막에 항상 복사              | 브라우저 재검증, CDN 5분 |

HTML을 마지막에 반영하고 이전 JS 파일을 유지해 배포 중 오래된 HTML이 존재하지 않는 새 자산을 참조할 가능성을 줄입니다. 여러 파일 전체를 원자적으로 바꾸는 방식은 아닙니다.

`--delete`를 사용하지 않으며 배포 역할에 삭제 권한도 없습니다. 이전 빌드 자산이 누적되므로 사용자가 향후 충분한 보관 기간 이후 별도 권한으로 불필요한 버전만 정리할 수 있습니다. 빌드 아티팩트의 GitHub 보관 기간은 3일이며 GitHub Actions 사용량·저장 비용은 계정 정책에 따릅니다.

## 실패와 복구

- **build 실패:** 배포 작업은 실행되지 않습니다. lint·타입 오류·배포 검사 테스트·빌드 로그를 확인합니다.
- **설정 검사 실패:** AWS 인증 전에 멈춥니다. Repository Variables와 정적 빌드 파일을 확인합니다.
- **OIDC 실패:** 정확한 저장소/브랜치, 제공자의 `sts.amazonaws.com` audience, 역할 ARN을 확인합니다.
- **계정·S3·CDN 검사 실패:** 업로드 전에 멈춥니다. 버킷 공개 차단, 배포 ID, 기본 S3 원본과 OAC, `SITE_URL`을 확인합니다.
- **사이트 검증 실패:** 캐시 갱신·DNS·인증서·실제 HTML 해시를 확인합니다. 자동 롤백은 하지 않습니다. 업로드 도중 실패했다면 일부 파일이 반영되었을 수 있습니다.
- **코드 복구:** 문제 변경을 되돌리는 커밋을 `main`에 반영하면 같은 검증·배포 흐름을 다시 거칩니다. 과거 실행 재시도도 당시 아티팩트가 보존된 경우 사용할 수 있으며 HTML과 일반 자산은 타임스탬프와 관계없이 다시 복사됩니다.

저장소나 배포 브랜치를 변경하면 Terraform 변수, `.github/workflows/portfolio.yml`의 트리거·조건, `scripts/deploy-static.mjs`의 허용 컨텍스트를 함께 수정합니다.

## 로컬 검증 범위

`npm run test:deploy`는 실제 AWS 없이 계정·컨텍스트·비공개 버킷·CDN 원본·정적 산출물 검사를 테스트합니다. 배포 스크립트는 로컬 직접 실행을 거부합니다. 테스트가 실제 IAM/OIDC 연동, GitHub 러너 또는 운영 배포 성공을 의미하지는 않습니다.

이번에는 로컬 검사와 파일 작성을 수행하며, AWS API 호출이나 Terraform 명령, GitHub Actions 원격 실행은 하지 않습니다.

## 공식 참고

- [GitHub OIDC와 AWS 설정](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
- [AWS 자격 증명 Action](https://github.com/aws-actions/configure-aws-credentials)
- [GitHub 빌드 아티팩트](https://github.com/actions/upload-artifact)
- [IAM OIDC 제공자](https://github.com/hashicorp/terraform-provider-aws/blob/v6.70.0/website/docs/r/iam_openid_connect_provider.html.markdown)

## OIDC subject 형식과 인증 실패 확인

`Son-github/portfolio`는 2026-10-25 생성된 저장소이므로, 2026-07-15 이후의 숫자 ID 포함 subject를 사용합니다. 공개 GitHub API로 확인한 소유자 ID는 `83553103`, 저장소 ID는 `1432895806`입니다.

```text
repo:Son-github@83553103/portfolio@1432895806:ref:refs/heads/main
```

`github_owner_id`, `github_repository_id`로 숫자 ID를 관리하며, IAM은 `StringEquals`로 이 subject 하나와 `sts.amazonaws.com` audience를 허용합니다. 와일드카드로 조건을 넓히지 않습니다. 저장소를 변경·재생성하면 숫자 ID와 이름을 함께 확인해야 합니다.

`Not authorized to perform sts:AssumeRoleWithWebIdentity`가 발생하면 Actions의 `Inspect OIDC subject without logging the token` 단계에 나온 `sub`/`aud`, AWS 역할의 신뢰 정책, GitHub `AWS_ROLE_ARN`을 대조합니다. 이 단계는 JWT 원문을 출력하지 않습니다. 커스텀 subject나 GitHub Environment를 사용하는 경우에는 실제 발급 형식과 맞춰야 합니다.

Terraform 파일을 push하는 것만으로 AWS 역할 정책이 바뀌지는 않습니다. 사용자가 로컬에서 새 계획을 검토하고 신뢰 정책 변경을 직접 반영해야 합니다. 기존 인프라를 먼저 삭제할 필요는 없습니다.

[GitHub의 immutable subject 공식 설명](https://docs.github.com/en/actions/reference/security/oidc#immutable-subject-claims)
