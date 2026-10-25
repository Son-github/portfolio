# 운영 기능 추가 검증 기록

검증일: 2026-10-25. 이 문서는 이번 변경의 코드·로컬 화면·읽기 전용 계획 결과이며, 실제 배포 완료를 의미하지 않습니다.

## 변경 파일

| 파일                                       | 변경 내용                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `src/data/portfolio.ts`                    | GitHub 프로필 주소 설정, 기존 헤더 표시 유지 플래그                     |
| `src/components/sections/Contact.tsx`      | 이메일·전화번호 옆에 동일 형식의 GitHub 연락처 표시                     |
| `src/components/layout/Header.tsx`         | 연락처 주소 설정으로 기존 헤더 메뉴가 늘어나지 않도록 처리              |
| `src/app/globals.css`                      | 사용하지 않는 이전 GitHub 링크 전용 스타일 정리                         |
| `src/app/layout.tsx`                       | 외부 분석 스크립트 없이 본문만 렌더링                                   |
| `.gitignore`                               | 비밀값 없는 `.env.example`만 버전 관리 허용                             |
| `infra/terraform/budgets.tf`               | 기존 예산 조건부 import, ACTUAL $1·$3 이메일, 기존 조건 보존, 삭제 방지 |
| `infra/terraform/variables.tf`             | 예산 관리 활성화·기존 이름·민감 이메일 변수                             |
| `infra/terraform/terraform.tfvars.example` | 기본 비활성화 예산 설정 예제                                            |
| `infra/terraform/versions.tf`              | `terraform fmt`의 공백 정리만 적용                                      |
| `infra/terraform/README.md`                | 기존 예산 편입과 검증 범위 안내                                         |
| `README.md`                                | 요청량 확인·비용 운영·실무 흐름을 중심으로 문서 정리                    |
| `docs/architecture.svg`                    | 지역·서비스 경계와 콘텐츠/제어 흐름을 나눈 아키텍처                     |
| `docs/DEVELOPMENT.md`                      | GitHub 연락처와 비용 운영 관리 위치 안내                                |
| `docs/OPERATIONS-VALIDATION.md`            | 이 기록                                                                 |

작업 시작 전에 이미 수정되어 있던 배포 문제 해결 코드와 이전 콘텐츠 변경은 유지했습니다. 이번 작업에서 S3·CloudFront·ACM·DNS·OIDC 리소스 정의는 변경하지 않았습니다. 로컬 `terraform.tfvars`는 fmt로 공백만 정리됐고 실제 설정값은 바꾸지 않았습니다.

## 완료한 검증

- `npm run lint`: 통과.
- `npm run test:deploy`: 기존 배포 검증 8개 모두 통과. 실제 배포 실행 없음.
- `npm run build`: Next.js 정적 빌드·내보내기 통과.
- `npm run typecheck`: 통과.
- 로컬 정적 빌드를 실제 브라우저에서 확인: 데스크톱 1440×900, 모바일 320×568. 연락처 3개 가독성·가로 넘침 없음·GitHub 정확한 URL 및 새 탭 속성 확인.
- 문서 아키텍처 SVG의 실제 브라우저 렌더링 확인.
- `terraform fmt -check`: 통과.
- `terraform validate`: 설치된 AWS provider 6.70.0 기준 통과.
- `terraform plan`: 기존 상태와 실제 AWS를 읽어 전체 변경 확인.
- `terraform plan -target=aws_budgets_budget.monthly`: 예산만 가져오는 계획 확인.
- `git diff --check`: 통과.

## Terraform 계획 결과

실제 수신자를 임의로 정하지 않기 위해 `enable_cost_budget=true`, `budget_alert_email=verification-only@example.invalid`를 **계획에만** 전달했습니다. 로컬 실제 tfvars에는 이 값을 저장하지 않았습니다.

| 범위           | 가져오기    | 생성 | 수정                       | 삭제 |
| -------------- | ----------- | ---- | -------------------------- | ---- |
| 전체 계획      | 기존 예산 1 | 0    | 예산 + 기존 CloudFront = 2 | 0    |
| 예산 전용 계획 | 기존 예산 1 | 0    | 예산 1                     | 0    |

예산 전용 JSON 계획에서 실제 변경 필드는 `notification`과 제공자 기본 태그 `tags_all`뿐입니다. 기존 $5 한도, `UnblendedCost`, 기본 Billing View, 크레딧·환불 제외 필터는 보존됩니다. 5개 알림은 기존 ACTUAL 85%/100%, FORECASTED 100% 및 새 ACTUAL 절대 금액 1/3 USD입니다. 수신자는 모두 입력 변수로 지정됩니다. `한달5천원` 예산은 관리하거나 삭제하지 않습니다.

**전체 계획의 CloudFront 차이:** 이번에 변경하지 않은 `aws_cloudfront_distribution.site`의 origin에서 코드의 `s3_origin_config` 블록과 실제 설정 차이, `response_completion_timeout`의 제공자 계산값 차이가 나타났습니다. 배포 자체의 교체 계획은 아니지만 이번 작업과 무관한 호스팅 변경이므로 전체 계획을 적용하지 않았습니다. 원본 정책이나 인증서를 바꾸거나 차이를 숨기는 ignore_changes도 추가하지 않았습니다.

예산 편입만 검토할 때는 운영 문서의 제한된 계획을 사용합니다. 전체 인프라 계획은 향후 별도 검토가 필요합니다. 임시 검증 계획 파일은 오적용·민감 정보 보관을 피하기 위해 확인 후 제거했습니다.

## 사용자 설정·확인이 필요한 사항

1. 수정한 웹사이트를 GitHub에 push하고 Actions 배포 확인.
2. 로컬 tfvars의 예산 관리 활성화와 실제 이메일 입력. 기존 5개 알림 수신자가 해당 주소로 통일되는 점 검토.
3. 실제 이메일로 예산 전용 계획을 다시 만들고 검토한 뒤 사용자 직접 apply.
4. Budgets 콘솔의 알림 조건·수신자 확인과 실제 임계값 초과 시 메일 수신 확인.
5. 필요할 때만 사용자가 CloudFront Disable/Enable을 실행하고 확인. 실제 서비스 중지 테스트는 하지 않았음.
6. 전화번호 `010-0000-0000`은 사용자가 교체하기로 한 임시 표시이므로 실제 공개 번호로 수정.

AWS 리소스 생성·수정·삭제, Terraform apply/import 적용, Git push, GitHub Actions 배포, DNS 수정은 실행하지 않았습니다. 테스트 서버는 검증 후 종료했습니다.

## 요청량·비용 기능만 유지한 최종 구성

외부 방문자 분석 컴포넌트·빌드 환경변수·토큰 예제·등록 안내를 제거했습니다. 루트 레이아웃·워크플로·README·아키텍처에도 해당 연동이 남지 않도록 정리했습니다. 비용 예산 코드는 변경하지 않았으므로 위 Terraform 계획은 이전 검증 결과이며 이번 제거 작업에서 AWS 명령을 재실행하지 않았습니다. 최종 코드의 lint·정적 빌드·TypeScript 검사와 분석 코드 잔존 여부를 다시 확인했습니다.
