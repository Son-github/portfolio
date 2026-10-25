# SON JONGIN · Cloud Engineer & DevOps

서비스 요구사항에 맞는 인프라를 설계하고, 배포 자동화와 운영 과정의 문제를 해결하는 손종인의 포트폴리오입니다. 프로젝트 경험을 소개하는 웹사이트와 함께, 인프라 정의 및 애플리케이션 배포 흐름을 코드로 관리합니다.

[포트폴리오 보기](https://www.son-portfolio.site) · [GitHub](https://github.com/Son-github) · [이메일](mailto:jongin718@gmail.com)

## 주요 프로젝트

| 프로젝트                                                      | 구분                        | 구현·검증 내용                                                                              | 주요 기술                                                            |
| ------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [CloudWave](https://github.com/cw-5jang6bu)                   | 클라우드 인프라 팀 프로젝트 | Multi-AZ·EKS 인프라 설계, HPA·Karpenter 자동 확장, k6 부하 테스트를 통한 확장 동작 검증     | AWS, Kubernetes, Terraform, Redis, Datadog, Argo CD, Jenkins, Docker |
| [Daily Briefing](https://github.com/Son-github/dailybriefing) | 개인 서비스 개발·운영       | Spring Boot 서비스를 AWS에 배포, GitHub Actions 배포 자동화, CloudWatch 로그 기반 오류 분석 | AWS, Spring Boot, Terraform, Docker, CloudFront, GitHub Actions      |

이 저장소는 위 프로젝트를 소개하는 포트폴리오 웹사이트입니다. 프로젝트별 실제 구현 코드는 각 링크에서 확인할 수 있습니다.

## 이 저장소의 설계 포인트

- **서버 없이 제공하는 정적 웹사이트:** Next.js의 정적 내보내기로 S3와 CloudFront에서 제공할 수 있도록 구성했습니다.
- **인프라와 배포 권한 분리:** Terraform은 호스팅 리소스를 정의하고, GitHub Actions 역할은 해당 버킷의 파일 업로드와 해당 CDN의 조회·캐시 갱신만 허용합니다.
- **장기 인증 키 없는 배포:** GitHub OIDC의 저장소·브랜치 조건으로 `Son-github/portfolio`의 `main`만 AWS 임시 자격 증명을 발급받도록 정의했습니다.
- **검증한 산출물의 재사용:** PR에서는 검사와 빌드만 수행합니다. `main` 배포에서는 빌드 아티팩트를 그대로 사용하고, 배포 후 실제 HTML과 산출물의 SHA-256을 비교합니다.
- **가벼운 운영과 비용 인지:** CloudFront 기본 지표와 기존 계정 예산의 $1·$3 실제 비용 알림을 준비했습니다. 유료 수집 서버나 자동 중지 없이, 지표 확인 후 운영자가 중지를 판단합니다.
- **콘텐츠 확장과 접근성:** 프로젝트·경력·기술 데이터를 UI와 분리했습니다. 반응형 레이아웃, 키보드 탐색, 모션 감소 설정을 지원합니다.

## 서비스와 배포 구조

![정적 전송·OIDC 배포·운영 경계를 구분한 클라우드 아키텍처](docs/architecture.svg)

아키텍처는 **콘텐츠 전송 / 배포 제어 / 운영 관측**으로 구분했습니다. 실선은 방문자의 요청 경로, 점선은 인증서·배포 설정 흐름입니다.

| 경계        | 구성과 역할                                               |
| ----------- | --------------------------------------------------------- |
| 외부 DNS    | 가비아 CNAME으로 CloudFront 연결. 기존 네임서버 유지      |
| 글로벌 엣지 | CloudFront 캐시·HTTPS, ACM 인증서만 us-east-1             |
| 서울 리전   | 비공개 S3 정적 산출물. OAC 서명 원본 요청만 허용          |
| 배포 제어   | GitHub Actions → OIDC 임시 역할 → S3 업로드·CDN 캐시 갱신 |
| 운영 관측   | CloudFront 기본 지표, 계정 전체 예산 이메일               |

호스팅은 비공개 S3와 CloudFront 종량제로 정의하고, DNS는 가비아에서 관리합니다. S3·배포 리전은 서울, CloudFront용 ACM 인증서는 버지니아로 분리했습니다. 별도의 상시 실행 서버·WAF·Route 53 영역은 구성하지 않습니다. CloudFront 무료 사용량 초과, S3 저장·요청, 도메인 갱신은 과금 대상입니다. 세부 리소스와 비용 범위는 [Terraform 안내](infra/terraform/README.md)에 정리했습니다.

자동 배포는 인프라·OIDC 역할·GitHub 변수 설정 후 동작합니다. 예산 관리는 기본 비활성화이며 아래 운영 설정을 별도로 마쳐야 합니다.

## 요청량 확인과 비용 운영

| 확인할 내용                | 방법                                 | 추가 구성                   |
| -------------------------- | ------------------------------------ | --------------------------- |
| 요청량·전송량·4xx/5xx 비율 | CloudFront 콘솔의 무료 기본 지표     | 별도 AWS 리소스 없음        |
| 월간 발생 비용             | 기존 `My Monthly Cost Budget` 재사용 | ACTUAL $1·$3 초과 시 이메일 |
| 방문 급증 시 중지·재개     | 운영자가 CloudFront Disable / Enable | 자동 조치 없음              |

별도의 방문자 분석 도구는 설치하지 않습니다. CloudFront Requests는 방문자 수가 아닙니다. 예산은 **계정 전체**를 감시하며 기존 크레딧·환불 제외 기준을 유지합니다. 집계와 이메일에는 지연이 있고 지출 상한을 보장하지 않습니다. 기존 월 $5 한도와 3개 알림 조건도 보존합니다.

기본 지표 조회·Budget 모니터링/이메일은 무료 범위만 사용합니다. 기존 S3·CloudFront·도메인 비용은 계속 발생할 수 있습니다. 실제 수신 이메일 입력, 예산 계획 검토와 적용은 [운영 안내](docs/OPERATIONS.md)를 따릅니다. 실제 AWS 적용·배포는 자동으로 실행하지 않습니다.

## 기술 스택

| 영역        | 구성                                                   |
| ----------- | ------------------------------------------------------ |
| 웹사이트    | Next.js 15, React 19, TypeScript, Tailwind CSS 4       |
| 인터랙션    | Motion, IntersectionObserver, CSS transform·opacity    |
| 인프라 정의 | Terraform, S3, CloudFront, OAC, ACM, 가비아 DNS        |
| 운영        | CloudFront 기본 지표, AWS Budgets 이메일               |
| CI/CD       | GitHub Actions, OIDC, 빌드 아티팩트, 배포 후 HTML 검증 |

## 로컬 실행

Node.js 20.9 이상이 필요합니다. CI는 Node.js 22를 사용합니다.

```sh
npm ci
npm run dev
```

[http://127.0.0.1:3000](http://127.0.0.1:3000)에서 확인하고, 서버를 실행한 터미널에서 **Control + C**로 종료합니다.

```sh
npm run lint
npm run test:deploy
npm run build
npm run typecheck
```

정적 결과물은 `out/`에 생성됩니다. `test:deploy`는 AWS 호출 없이 배포의 계정·원본·접근 제어 검사 로직을 검증합니다.

## 코드 탐색

```text
src/data/              프로젝트·경력·기술·프로필 데이터
src/components/        섹션·프로젝트·재사용 UI
src/hooks/             섹션 감지와 Reveal 동작
src/lib/animation.ts   공통 애니메이션 설정
docs/                 아키텍처·개발·배포·비용 운영 안내
infra/terraform/       호스팅·OIDC·최소 배포 권한 정의
.github/workflows/     PR 검증과 main 자동 배포
scripts/               정적 배포 도구와 로컬 테스트
```

- [개발·콘텐츠 관리](docs/DEVELOPMENT.md): 실행·종료, 프로젝트·경력 추가, 프로필 이미지와 모션 설정
- [처음 GitHub에 올리고 배포하기](docs/GETTING_STARTED.md): Git 초기화부터 최초 배포·도메인 연결까지
- [배포·운영 안내](docs/DEPLOYMENT.md): 초기 설정, GitHub Variables, 자동 배포 흐름과 복구 방법
- [Terraform 구성](infra/terraform/README.md): 리소스별 역할, 도메인 연결과 비용 범위
- [요청량·비용·수동 중지](docs/OPERATIONS.md): 예산 이메일 설정, CloudFront 기본 지표, 중지·재개
- [운영 기능 검증 기록](docs/OPERATIONS-VALIDATION.md): Terraform 계획과 실제 설정이 필요한 항목
