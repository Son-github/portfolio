# 손종인 포트폴리오

클라우드 인프라 구축과 서비스 배포 경험을 정리한 포트폴리오입니다.
Next.js로 만든 정적 사이트를 S3와 CloudFront로 제공하며, 인프라는 Terraform으로 관리합니다.

[포트폴리오](https://www.son-portfolio.site) · [GitHub](https://github.com/Son-github) · [이메일](mailto:jongin718@gmail.com)

## 주요 프로젝트

| 프로젝트                                                      | 작업 내용                                                                  | 주요 기술                                                       |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [CloudWave](https://github.com/cw-5jang6bu)                   | Multi-AZ·EKS 인프라 설계, HPA·Karpenter 자동 확장 구성, k6 부하 테스트     | AWS, Kubernetes, Terraform, Datadog, Argo CD, Jenkins, Docker   |
| [Daily Briefing](https://github.com/Son-github/dailybriefing) | Spring Boot 서비스 배포, 오류 로그 기반 원인 분석 및 대응 방안 이메일 알림 | AWS, Spring Boot, Terraform, Docker, CloudFront, GitHub Actions |

프로젝트별 구현 코드는 각 저장소에서 확인할 수 있습니다.

## 클라우드 아키텍처

![포트폴리오 클라우드 아키텍처](docs/architecture.svg)

- **호스팅:** 가비아 CNAME으로 CloudFront에 연결합니다. 정적 파일은 서울 리전의 비공개 S3에 저장하고, HTTPS 인증서는 버지니아 북부(`us-east-1`)에서 관리합니다.
- **원본 보호:** S3 퍼블릭 접근을 차단하고, OAC와 버킷 정책으로 지정한 CloudFront 배포의 읽기 요청만 허용합니다.
- **배포 권한:** GitHub OIDC로 `main` 브랜치에 임시 자격 증명을 발급합니다. 배포 역할은 대상 버킷의 파일 업로드와 CloudFront 조회·캐시 무효화에 필요한 권한만 가집니다.

[Terraform 설정](infra/terraform/README.md) · [AWS 공식 아이콘](https://aws.amazon.com/architecture/icons/)

## 배포 흐름

PR에서는 린트·타입 검사·배포 검증 테스트·정적 빌드를 수행합니다.
`main` 배포에서는 검사한 빌드 결과물을 S3에 업로드하고 CloudFront 캐시를 무효화합니다.
배포 후에는 사이트의 HTML과 빌드 결과물의 SHA-256을 비교합니다.

Terraform은 로컬에서 별도로 적용하며, GitHub Actions에서는 실행하지 않습니다.

## 운영과 비용

CloudFront의 기본 지표로 요청 수, 전송량, 4xx·5xx 오류율을 확인합니다. 요청 수는 방문자 수와 다르며 별도 방문자 분석 도구는 사용하지 않습니다.

비용 알림은 기존 `My Monthly Cost Budget`을 재사용하도록 구성했습니다. 활성화하면 실제 비용 $1·$3 초과 시 이메일을 보냅니다. 계정 전체의 크레딧·환불 차감 전 비용을 기준으로 하며, 기존 월 $5 예산과 알림 조건도 유지합니다.

예산 알림에는 집계 지연이 있고 자동 차단 기능은 없습니다. 필요하면 운영자가 CloudFront를 직접 비활성화합니다. S3 저장·요청, CloudFront 무료 범위 초과 사용량, 도메인 갱신 비용은 별도로 발생할 수 있습니다.

이메일 설정과 적용 순서는 [운영 안내](docs/OPERATIONS.md)에 정리했습니다.

## 사용 기술

| 구분      | 구성                                             |
| --------- | ------------------------------------------------ |
| 웹사이트  | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| 화면 동작 | Motion, IntersectionObserver                     |
| 인프라    | Terraform, S3, CloudFront, OAC, ACM, 가비아 DNS  |
| 배포      | GitHub Actions, OIDC                             |
| 운영      | CloudFront 기본 지표, AWS Budgets 이메일 알림    |

## 로컬 실행

Node.js 20.9 이상이 필요합니다. GitHub Actions에서는 Node.js 22를 사용합니다.

```sh
npm ci
npm run dev
```

[http://127.0.0.1:3000](http://127.0.0.1:3000)에서 확인합니다. 서버 종료는 실행한 터미널에서 **Control + C**를 누릅니다.

```sh
npm run lint
npm run test:deploy
npm run build
npm run typecheck
```

정적 빌드 결과는 `out/`에 생성됩니다. `test:deploy`는 AWS에 접속하지 않고 계정·원본·접근 제어 검증 로직을 테스트합니다.

## 디렉터리

```text
src/data/              프로젝트·경력·기술·연락처 데이터
src/components/        섹션 및 공통 UI
src/hooks/             섹션 감지와 등장 효과
src/lib/animation.ts   애니메이션 설정
infra/terraform/       호스팅·배포 권한·비용 알림 구성
.github/workflows/     검사 및 자동 배포
scripts/               배포 스크립트와 테스트
docs/                  개발·배포·운영 문서
```

## 관련 문서

- [개발·콘텐츠 관리](docs/DEVELOPMENT.md)
- [최초 배포](docs/GETTING_STARTED.md)
- [배포·복구](docs/DEPLOYMENT.md)
- [Terraform 구성](infra/terraform/README.md)
- [지표 확인·비용 알림·수동 중지](docs/OPERATIONS.md)
- [운영 기능 검증 기록](docs/OPERATIONS-VALIDATION.md)
