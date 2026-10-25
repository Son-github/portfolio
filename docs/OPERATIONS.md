# 요청량 확인과 비용 운영

사이트: **https://www.son-portfolio.site** · 정적 호스팅: S3 + CloudFront · DNS: 가비아

이 구성은 CloudFront 요청량·전송량을 확인하고 비용 알림을 받은 뒤 운영자가 중지를 판단하는 방식입니다. 별도의 방문자 분석 스크립트는 사용하지 않습니다. 예산 관리는 기본 비활성화이며 아래 설정을 마쳐야 동작합니다. 자동 차단·자동 중지 기능은 없습니다.

## 1. CloudFront 무료 기본 지표

AWS **CloudFront → Monitoring → 해당 배포** 또는 배포 상세의 **Monitoring** 탭을 엽니다. 사용자 도메인과 배포 ID를 확인하고 시간 범위를 선택합니다.

| 기본 지표       | 해석                                                  | CloudWatch에서 직접 조회할 때 |
| --------------- | ----------------------------------------------------- | ----------------------------- |
| Requests        | HTML·JS·CSS·이미지·봇·실패 요청을 포함한 전체 요청 수 | Sum                           |
| BytesDownloaded | 사용자에게 다운로드된 바이트                          | Sum                           |
| 4xxErrorRate    | 전체 요청 중 4xx 비율                                 | Average                       |
| 5xxErrorRate    | 전체 요청 중 5xx 비율                                 | Average                       |

**Requests는 방문자 수가 아닙니다.** 한 번의 방문에서도 여러 파일을 요청합니다. CloudWatch 콘솔을 이용한다면 **미국 동부(버지니아 북부 / us-east-1) → Metrics → AWS/CloudFront**에서 `DistributionId`, `Region=Global` 차원을 선택합니다. 이는 S3가 서울에 있다는 사실과 별개입니다.

이미 제공되는 기본 지표만 봅니다. Additional metrics, 유료 모니터링 구독, CloudWatch Dashboard/Alarm, Logs, SNS, Lambda는 추가하지 않습니다. 누적 비용은 Billing에서 따로 확인합니다.

## 2. 기존 AWS Budgets 재사용

2026-10-25 읽기 전용 확인에서 계정에 월 $5 COST 예산 `My Monthly Cost Budget`과 `한달5천원`이 있었습니다. 사용자가 선택한 **`My Monthly Cost Budget`만 재사용**합니다. `한달5천원`과 다른 인프라는 관리 대상에 추가하지 않습니다.

`infra/terraform/budgets.tf`는 조건부 **import 블록**으로 기존 예산을 가져옵니다. 기본 `enable_cost_budget = false`에서는 예산 변경을 계획하지 않습니다. 활성화 후 대상 예산이 존재하지 않으면 import가 실패하므로 새 예산으로 대체 생성하지 않습니다.

| 항목                | 설정                                                       |
| ------------------- | ---------------------------------------------------------- |
| 유형·주기·기존 한도 | COST · MONTHLY · USD 5 유지                                |
| 새 알림             | ACTUAL / ABSOLUTE_VALUE / $1, $3 / 이메일                  |
| 비교 조건           | GREATER_THAN: 집계 비용이 각 금액을 **초과**하면 알림 대상 |
| 기존 알림 조건      | ACTUAL 85%, ACTUAL 100%, FORECASTED 100% 유지              |
| 수신자              | 5개 알림 모두 `budget_alert_email`로 지정한 주소로 통일    |
| 자동 조치           | 없음. Budget Actions·SNS·Lambda 없음                       |

정확히 $1 또는 $3이 되는 순간의 실시간 알림을 보장하지 않습니다. AWS가 갱신한 실제 비용이 기준을 넘을 때 평가됩니다. 기존 예산의 다른 수신자에게도 계속 알림이 필요하면 적용 전에 수신자 설정을 검토하세요.

### 감시 범위와 비용 기준

**해당 AWS 계정의 전체 비용**을 감시합니다. 포트폴리오·CloudFront만의 예산이 아닙니다. 다른 프로젝트나 서비스도 포함하므로 포트폴리오 트래픽이 없어도 알림이 올 수 있습니다.

가져오는 기존 설정은 기본 Billing View의 `UnblendedCost`이며 `Credit`, `Refund` 레코드를 제외합니다. 따라서 크레딧·환불 차감 전 발생 비용을 감시하고, 최종 결제액·순 청구액과 차이가 날 수 있습니다. 태그나 서비스 필터로 포트폴리오 비용만 좁히지 않습니다. 다른 계정에서 재사용한다면 기존 예산의 필터·비용 기준을 먼저 맞춰야 합니다.

AWS Budgets 데이터와 이메일에는 **집계 지연**이 있습니다. 알림 전에 $3을 넘을 수 있고 이후에도 비용이 늘어납니다. 예산 한도는 결제 상한이나 서비스 차단 장치가 아닙니다. Bills 화면도 함께 확인하세요.

### 이메일 등록과 적용 절차

기존 `infra/terraform/terraform.tfvars`를 그대로 사용하고 다음 **3개 항목만 추가**합니다. 도메인·인증서·OIDC 플래그를 예제 기본값으로 덮어쓰면 안 됩니다.

```hcl
enable_cost_budget = true
cost_budget_name   = "My Monthly Cost Budget"
budget_alert_email = "you@example.com" # 반드시 본인의 실제 수신 주소로 교체
```

이메일은 Git에 커밋하지 않는 로컬 `.tfvars` 또는 `TF_VAR_budget_alert_email`로 입력합니다. 변수는 sensitive이며 일반 출력에서 마스킹하지만, 상태·저장된 계획에는 주소가 포함될 수 있습니다. `.tfstate`, `.tfplan`, `.tfvars`는 공개하지 마세요. GitHub Actions는 예산 이메일을 필요로 하지 않으며 Terraform을 실행하지 않습니다.

이번 검증에서 **전체 plan에 기존 CloudFront origin 설정 차이**가 발견됐습니다. 호스팅 코드는 이번에 수정하지 않았습니다. 이 차이를 검토하지 않은 상태에서 전체 계획을 적용하지 마세요. 이번 예산 도입은 예외적으로 예산만 대상으로 제한합니다.

```sh
cd infra/terraform
terraform fmt -check
terraform validate
# 전체 리소스 차이도 읽어서 파악합니다. 이 결과는 자동 적용하지 않습니다.
terraform plan -input=false
# 기존 호스팅에 영향을 주지 않도록 이번 예산 import/알림만 검토합니다.
terraform plan -input=false -target=aws_budgets_budget.monthly -out=budget.tfplan
```

예산 전용 계획에서 **기존 예산 1개 import, 그 예산의 in-place 변경, 0개 생성·0개 삭제**를 확인하세요. 기존 비용 기준과 $5 한도, $1·$3 알림 및 수신 주소를 확인합니다. 다른 리소스 변경이나 교체(`-/+`)가 있으면 진행하지 마세요. 계획 검토 후 **사용자가 직접** 실행합니다.

```sh
terraform apply budget.tfplan
```

위 `apply`는 안내용이며 이번 작업에서는 실행하지 않았습니다. 검증용 임시 계획은 실제 수신자가 아니므로 적용하지 마세요. 새 실제 이메일로 계획을 다시 만드세요. 대상 제한은 이번 기존 예산 편입을 위한 예외이며 일상 운영의 전체 drift 검토를 대체하지 않습니다.

적용 후 Billing and Cost Management → Budgets → 해당 예산에서 비용 범위와 알림 5개·이메일을 확인합니다. 임계값을 넘지 않았다면 알림이 즉시 오지 않는 것이 정상입니다. AWS의 수신 확인 안내가 있는 경우 메일을 확인하고 스팸함도 확인하세요.

`prevent_destroy`로 예산 삭제·이름 변경에 따른 교체를 막았습니다. 관리에 편입한 뒤 `enable_cost_budget`를 false로 바꾸면 보호 오류가 발생합니다. 기존 예산을 콘솔에 남긴 채 Terraform 관리에서만 분리하려면 별도의 상태 이관 절차가 필요하며 단순히 비활성화하지 마세요.

## 3. 방문 급증 시 수동 중지·재개

1. 먼저 CloudFront Requests/BytesDownloaded 및 Billing 비용을 확인합니다.
2. AWS **CloudFront → Distributions**에서 `www.son-portfolio.site`가 연결된 배포를 선택합니다. 배포 중이면 완료를 기다립니다.
3. **Disable → 확인**을 선택합니다. **Delete는 선택하지 않습니다.** 전 세계 엣지에 전파되는 데 시간이 걸리므로 즉시 차단으로 보지 마세요.
4. 배포 상태가 Disabled가 되었는지, 실제 사이트가 더 이상 제공되지 않는지 확인합니다. 이미 브라우저에 캐시된 화면은 남아 있을 수 있습니다.
5. 재개는 같은 배포를 선택해 **Enable → 확인**합니다. 배포 완료 후 HTTPS 접속을 확인합니다. DNS·ACM·S3는 삭제하거나 변경하지 않습니다.

현재 Terraform의 `cdn.tf`는 `enabled = true`입니다. 콘솔에서 수동 Disable하면 코드와 실제 상태가 달라집니다. 이후 **전체 Terraform apply가 다시 활성화할 수 있습니다.** 중지를 유지해야 하면 사용자가 코드의 `enabled`도 false로 맞추고 계획을 검토하세요. 재개 시 true로 되돌립니다. 이번 코드에서는 기존 값을 바꾸지 않았습니다.

사이트를 중지한 동안에는 GitHub Repository Variable **`DEPLOY_ENABLED=false`**로 정적 파일 배포도 잠시 멈출 수 있습니다. GitHub 배포 역할은 CloudFront 활성화 변경 권한이 없으므로 일반 사이트 배포 자체가 CloudFront를 재활성화하지는 않습니다. 재개 후 변수도 필요에 따라 복원하세요.

CloudFront 비활성화는 계정 전체 비용 중지가 아닙니다. S3 저장 비용, 기존 발생 비용, 도메인 갱신 및 다른 프로젝트 비용은 남습니다. 누적 비용도 취소되지 않습니다. 예산 이메일은 중지 후에도 올 수 있습니다.

## 4. 비용과 검증 범위

| 추가 구성                 | 비용                                                                  |
| ------------------------- | --------------------------------------------------------------------- |
| CloudFront 기본 지표      | 무료 기본 지표만 조회. 리소스 추가 없음                               |
| 기존 AWS Budgets + 이메일 | 모니터링·이메일 알림 무료. Actions 없음                               |
| 기존 호스팅               | S3 저장·요청, CloudFront 종량제/무효화, 도메인 갱신 등 기존 과금 유지 |

방문량이 늘면 기존 호스팅 비용은 증가할 수 있습니다. 이 변경이 AWS 전체 비용을 무료로 만들거나 상한을 설정하는 것은 아닙니다.

코드 검증과 읽기 전용 plan 결과는 [이번 검증 기록](OPERATIONS-VALIDATION.md)을 확인하세요. 실제 예산 적용·메일 수신·중지/재개는 사용자의 설정과 확인이 필요합니다.

## 공식 참고

- [CloudFront 기본 지표](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/viewing-cloudfront-metrics.html)
- [CloudFront 비활성화 절차](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowToDeleteDistribution.html) — 삭제 안내 중 Disable 단계만 사용
- [AWS Budgets 요금](https://aws.amazon.com/aws-cost-management/aws-budgets/pricing/)
- [AWS Budgets 집계 지연](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)
