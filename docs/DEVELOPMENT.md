# 개발 및 콘텐츠 관리 안내

다크 테마와 블루 포인트를 사용하는 클라우드 엔지니어 손종인의 Next.js 포트폴리오입니다. Hero, Education & Experience, Expertise, Projects, Certifications, Contact를 한 장면씩 보여주는 포트폴리오입니다. 각 장면은 최소 100svh이며 높이를 고정하지 않습니다. 긴 콘텐츠는 자동 확장하고, 프로젝트는 하나의 목록으로 확장되며, Education & Experience는 데스크톱에서 오른쪽 이력 목록만 내부 스크롤하며, 자격증은 페이지네이션으로 확장합니다.

## 빠르게 켜고 끄기

| 할 일       | 방법                                       |
| ----------- | ------------------------------------------ |
| 처음 준비   | 프로젝트 폴더에서 `npm install` 한 번 실행 |
| 사이트 켜기 | `npm run dev`                              |
| 사이트 열기 | 터미널에 표시된 Local 주소로 접속          |
| 사이트 끄기 | 서버가 실행 중인 터미널에서 `Control + C`  |
| 다시 켜기   | 같은 폴더에서 `npm run dev` 다시 실행      |
| 내용 수정   | 파일을 저장하면 개발 화면에 자동 반영      |

### 1. 처음 실행할 때

Node.js 20.9 이상과 npm이 필요합니다. 터미널에서 설치 여부를 확인합니다.

```sh
node -v
npm -v
```

터미널을 열고 프로젝트 폴더로 이동합니다. 프로젝트 폴더에서 다음을 실행하면 됩니다.

```sh
cd portfolio
npm install
npm run dev
```

터미널에 `Ready`가 표시되면 [http://127.0.0.1:3000](http://127.0.0.1:3000)을 엽니다. 실제 포트가 다르게 표시된다면 터미널의 **Local 주소**를 사용하세요.

`npm install`은 처음 설치하거나 의존성이 변경됐을 때 실행합니다. 평소에는 폴더 이동 후 `npm run dev`만 실행하면 됩니다.

### 2. 실행 중일 때

서버가 실행되는 터미널을 그대로 켜둡니다. 파일을 저장하면 화면이 자동 갱신됩니다. 환경 변수나 Next.js 설정을 변경했다면 서버를 껐다가 다시 켜세요.

개발 서버는 이 컴퓨터에서 미리 보는 용도입니다. 다른 사람에게 공유하려면 아래 배포 절차가 필요합니다.

### 3. 종료·재시작

**서버를 실행한 터미널 창을 선택하고 `Control + C`를 누릅니다.** Mac에서도 `Command + C`가 아니라 `Control + C`입니다. 터미널에 명령어를 입력할 수 있는 프롬프트가 다시 나타나면 종료된 것입니다.

브라우저 탭만 닫으면 서버는 계속 실행됩니다. 서버를 종료하면 로컬 주소에 접속되지 않는 것이 정상입니다.

다시 실행하려면 같은 터미널에서 다음을 입력합니다.

```sh
npm run dev
```

### 4. 접속이 안 될 때

1. 터미널에서 서버가 실행 중이고 `Ready`가 표시됐는지 확인합니다.
2. 터미널에 표시된 Local 주소와 브라우저 주소가 같은지 확인합니다.
3. 서버가 꺼져 있다면 프로젝트 폴더에서 `npm run dev`를 실행합니다.
4. 실행 중이라면 브라우저를 새로고침합니다. 오류가 남으면 터미널의 오류 메시지를 확인합니다.

`package.json`을 찾을 수 없다는 오류가 나오면 프로젝트 폴더로 이동했는지 확인하세요.

```sh
pwd
ls package.json
```

### 5. 3000 포트가 이미 사용 중일 때

이미 켜둔 서버가 있다면 그 서버를 사용하거나 해당 터미널에서 `Control + C`로 종료합니다. 별도의 서버를 켜려면 다른 포트를 지정할 수 있습니다.

```sh
npm run dev -- --port 3001
```

이 경우 접속 주소는 [http://127.0.0.1:3001](http://127.0.0.1:3001)입니다.

기존 서버의 터미널을 찾을 수 없다면 Mac에서 아래 명령으로 3000 포트를 사용하는 프로세스를 확인합니다.

```sh
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

출력의 `COMMAND`와 `PID`를 보고 **이 프로젝트 서버인지 확인한 뒤**, 해당 PID만 종료하세요. 예를 들어 PID가 `12345`라면 다음과 같습니다. 예시 숫자를 그대로 사용하지 마세요.

```sh
kill 12345
```

## 검증·빌드 결과 미리보기

프로젝트 폴더에서 실행합니다.

| 명령어              | 역할                                   |
| ------------------- | -------------------------------------- |
| `npm run typecheck` | TypeScript 타입 오류 확인              |
| `npm run lint`      | 코드 규칙과 오류 확인                  |
| `npm run build`     | 배포용 정적 사이트 생성, `out/`에 저장 |

빌드할 때는 개발 서버를 `Control + C`로 종료한 뒤 실행하세요. 개발 서버와 빌드가 같은 `.next/` 작업 폴더를 사용합니다.

```sh
npm run typecheck
npm run lint
npm run build
```

빌드 결과를 확인하려면 Python 3가 설치된 환경에서 다음을 실행합니다.

```sh
python3 -m http.server 3001 --bind 127.0.0.1 --directory out
```

[http://127.0.0.1:3001](http://127.0.0.1:3001)을 열고, 종료할 때는 해당 터미널에서 `Control + C`를 누릅니다. 파일을 수정한 뒤에는 다시 빌드해야 이 화면에 반영됩니다.

현재 프로젝트는 정적 내보내기 설정이므로 `npm start`나 `next start`를 사용하지 않습니다. 작업을 계속할 때는 `npm run dev`를 실행하세요.

## 기술 구성

Next.js App Router, React, TypeScript, Tailwind CSS, Motion, Lucide React, Simple Icons를 사용합니다. 기본 콘텐츠는 서버에서 렌더링하고, 스크롤과 등장 효과에 필요한 부분만 클라이언트 컴포넌트로 구성했습니다.

## 주요 파일

```text
src/app/                         페이지, 메타데이터, 공통 CSS
src/components/layout/           헤더·푸터·단일 점 내비게이션
src/components/sections/         여섯 콘텐츠 섹션
src/components/projects/         ProjectItem, ProjectTechnologies
src/components/ui/               SectionReveal, StaggerContainer, ScrollEffects 등
src/data/projects.ts             프로젝트 콘텐츠·주소·상태·순서
src/data/hero.ts                 Hero 프로필·소개·카드 좌표·부유 설정
src/data/technologies.ts         프로젝트 기술 로고 등록
src/data/portfolio.ts            개인 정보·소개·역량·목차
src/data/certifications.ts       자격증 분류·취득일·확인 링크
src/data/career.ts               실무·교육·학력 이력과 기간·기관·업무
src/types/project.ts             Project, ProjectStatus 타입
src/types/portfolio.ts           기존 공통 기술 데이터 타입
src/types/career.ts              경력 타입
src/types/certification.ts       자격증 타입
src/lib/animation.ts             애니메이션 공통 설정
src/hooks/                       Reveal과 현재 섹션 감지
public/images/profile-avatar.webp 교체 가능한 Hero 일러스트
public/projects/                 교체 가능한 미리보기 이미지
public/logos/                    로컬 기술 SVG
```

## 프로젝트 추가

1. 실제 프로젝트 이미지를 `public/projects/my-project.webp`에 넣습니다. 이미지는 생략할 수 있습니다. 현재 기본 이미지는 실제 화면을 흉내 내지 않은 임시 SVG입니다.
2. `src/data/projects.ts`의 `projects` 배열에 다음 객체를 추가합니다.

```ts
{
  id: "my-project",
  slug: "my-project",
  title: "새 프로젝트",
  period: "2026.10 — 진행 중",
  type: "개인 프로젝트", // 선택: 프로젝트 유형
  summary: "프로젝트 목적을 간결하게 적습니다.",
  description: "직접 구현한 내용과 확인한 결과를 적습니다.",
  technologies: ["AWS", "Terraform"],
  githubUrl: "https://github.com/실제계정/실제저장소",
  liveUrl: "", // 실제 서비스 주소가 있는 경우만 입력
  status: "developing", // 실제 확인한 상태만 입력하거나 생략
  order: 3,
  image: "/projects/my-project.webp", // 선택
  imageAlt: "프로젝트 아키텍처 다이어그램", // 선택
  featured: false, // 선택, 향후 선정 기능을 위한 데이터이며 현재 배치에는 영향 없음
},
```

3. 저장하면 프로젝트가 자동 표시됩니다. JSX 수정은 필요하지 않습니다.

`id`와 `slug`는 중복 없이 작성합니다. `order`가 작은 순서로 표시되며, 같은 값은 입력 순서를 유지합니다. 프로젝트는 후속 화면이나 페이지 분할 없이 하나의 목록으로 표시합니다. 넓은 데스크톱 화면에는 약 3개 행이 보이도록 구성했고, 3개 이후도 같은 섹션 안에서 아래로 확장됩니다. 모바일에서는 썸네일과 설명을 세로로 배치하며 내용을 자르지 않습니다.

`type`, `image`, `imageAlt`, `githubUrl`, `liveUrl`, `detailUrl`, `status`, `featured`는 생략할 수 있습니다. 이미지가 없으면 이름이 있는 임시 미리보기를 표시합니다. 빈 GitHub URL은 비활성 버튼으로 표시하고, 서비스·상세 URL이 비어 있으면 해당 링크를 숨깁니다. `detailUrl`은 실제 상세 페이지가 만들어진 뒤 입력하세요. 현재는 별도 상세 페이지 라우트를 만들지 않았습니다.

## GitHub·서비스 URL과 상태 수정

프로젝트별 `githubUrl`과 `liveUrl`은 `src/data/projects.ts`에서 수정합니다. 개인정보의 GitHub 프로필 주소는 `src/data/portfolio.ts`의 `portfolio.githubUrl`입니다. 주소가 없으면 빈 문자열로 두세요. 프로젝트 GitHub 버튼은 비활성 상태로 표시되며, 실제 주소를 입력하면 새 탭으로 연결됩니다. 서비스 링크와 개인 GitHub 프로필은 주소가 없으면 숨겨집니다.

| status 값    | 표시           |
| ------------ | -------------- |
| `completed`  | 구축·검증 완료 |
| `developing` | 개발 중        |
| `enhancing`  | 고도화 중      |
| `operating`  | 서비스 운영 중 |
| `stopped`    | 운영 종료      |
| 생략         | 상태 배지 숨김 |

`src/data/projects.ts`의 각 프로젝트 `status` 값을 변경하면 배지에 반영됩니다. `enhancing`은 개발 진행 상태이며 실제 서비스 운영 여부를 의미하지 않습니다. 실제 확인한 상태만 입력하세요. 현재 CloudWave는 `completed`, Daily Briefing은 `enhancing`입니다.

## 기술 로고 추가

`src/data/technologies.ts`의 `technologyLogos`가 프로젝트 로고 등록 위치입니다.

1. 실제 기술 SVG를 `public/logos/`에 넣습니다.
2. 등록 키는 기술 이름의 소문자로 지정합니다.

```ts
// technologyLogos 안에 추가
postgresql: { name: "PostgreSQL", logo: "postgresql" },
```

3. 프로젝트의 `technologies` 배열에 `"PostgreSQL"`을 추가합니다.

대소문자와 앞뒤 공백 차이를 정규화하고, 같은 로고/기술은 프로젝트마다 한 번만 표시합니다. 등록되지 않은 기술도 텍스트로 안전하게 표시합니다. AWS·Kubernetes·Terraform·Redis·ECS·RDS·CloudFront는 실제 로컬 SVG를 사용합니다. CloudFront 아이콘은 [AWS 공식 아키텍처 아이콘 패키지](https://aws.amazon.com/architecture/icons/)에서 가져왔으며, 나머지 로고는 기존 Simple Icons를 사용합니다.

Hero 카드는 아래의 별도 `src/data/hero.ts`에서 관리합니다. 프로젝트의 기존 기술 데이터와 링크에는 영향을 주지 않습니다. SVG 브랜드 사용 시 각 상표 가이드를 준수하세요.

## 애니메이션 속도 변경

공통 설정은 `src/lib/animation.ts`에서 관리합니다.

- `duration: 0.72`: Reveal 재생 시간(초).
- `ease: [0.22, 1, 0.36, 1]`: 공통 easing.
- `revealY: 24`, `staggerY: 12`: 섹션과 내부 항목 이동량(px).
- `stagger: 0.08`: 내부 항목 사이 지연(초).
- `viewportMargin`: 진입 감지 위치.
- `hero`: 약한 문구 페이드, 기술 영역 패럴랙스, 모바일 이동 배율.
- `backgroundY: 24`: 페이지 전체 배경의 느린 최대 이동 범위(px).

`SectionReveal`과 `StaggerContainer`는 기본 HTML을 숨기지 않고 IntersectionObserver 진입 후 최초 한 번만 재생합니다. 프로젝트마다 별도 `StaggerContainer`가 제목→요약→설명→기술 및 링크를 순차 표시합니다. 이탈하는 장면은 최대 40%만 약하게 페이드되며 역방향 이동 시 복원됩니다. 탭/페이지 전환 속도는 `panelDuration`(0.28초), 장면 이탈은 `sectionExit`에서 관리합니다.

`ScrollEffects`는 Motion 단일 스크롤 구독으로 Hero, 장면의 약한 이탈 효과, 하나의 고정 글로우 레이어를 갱신합니다. 스크롤 중 React 재렌더나 치수 재측정 없이 transform과 opacity만 변경합니다. 배경은 섹션별로 교체되지 않습니다. `prefers-reduced-motion`에서는 JS 모션과 CSS 부유 효과를 비활성화합니다. JavaScript나 애니메이션이 실패해도 본문을 읽을 수 있습니다.

데스크톱(1024px 이상, hover 지원)에서는 CSS `y proximity` 스냅을 사용합니다. 고정 높이가 아닌 최소 높이만 적용하며, 화면보다 긴 장면은 `ViewportScenes`가 스냅 대상에서 제외합니다. 모바일에서는 일반 스크롤을 사용합니다. 휠/터치 가로채기나 강제 섹션 이동은 없습니다. 현재 섹션은 IntersectionObserver와 캐시한 섹션 위치로 추적하며, 짧은 Contact와 역방향 스크롤도 보완합니다.

## 디자인·개인정보 수정

- 색상과 공통 섹션 여백: `src/app/globals.css` 상단 `:root`. `.section`의 공통 padding과 min-height에서 장면 높이·정렬을 관리합니다.
- 고정 헤더 안전 영역: `--header-height`와 공통 섹션 상단 padding. 장면 시작점 정렬을 위해 `scroll-padding-top`은 0입니다.
- 개인 정보·자기소개·기술 역량: `src/data/portfolio.ts`.
- 실무·교육·학력 이력: `src/data/career.ts`.
- 자격증: `src/data/certifications.ts`.
- 제목·소개 메타데이터: `src/app/layout.tsx`.
- 폰트: 외부 요청 없는 기존 시스템 폰트.

## 자기소개·학력·교육 수정

첫 화면은 `src/data/hero.ts`의 `heroProfile`에서 수정합니다. 이후 섹션은 `src/data/portfolio.ts`의 `portfolio`에서 `aboutTitle`, `aboutDescription`, `contactTitle`, `contactDescription`을 수정합니다. 문자열의 `\n`은 줄바꿈입니다.

자기소개 제목은 요청한 세 줄로 표시하며, 기존 `#career` 섹션 ID는 유지합니다. 화면 라벨과 오른쪽 목차 이름은 EDUCATION & EXPERIENCE입니다. 기술 역량은 `experiences` 데이터와 기존 `#experience` 앵커를 그대로 사용합니다.

## 실무 경력·교육·학력 추가

**`src/data/career.ts`의 `careers` 배열 하나**에서 모든 이력을 관리합니다. 과거 `portfolio.history`의 학력·교육 데이터는 이곳으로 이동했으며 중복 관리하지 않습니다. 기존 객체를 유지하고 새 객체를 추가하세요.

```ts
{
  id: "new-work",
  type: "work", // work: 실무 경력 / training: 교육·프로젝트 / education: 학력
  organization: "확인된 회사 또는 기관명",
  title: "실제 직무 또는 활동명",
  startDate: "2026-10",
  // endDate: "2027-03", // 재직 중인 work는 생략하면 현재로 표시
  description: "핵심 내용", // 선택
  highlights: ["주요 업무 1", "주요 업무 2"], // 선택: 2~3개의 간결한 내용 권장
  // order: 1, // 선택: 수동 정렬
},
```

- 근무 기간 변경: `startDate`, `endDate`를 `YYYY-MM` 또는 `YYYY-MM-DD`로 수정합니다. 화면에는 `YYYY.MM`을 표시합니다.
- 재직 중 표시: `type: "work"`에서 `endDate`를 생략합니다. `training`도 진행 중이면 현재로 표시합니다.
- 학력 추가: `type: "education"`, `organization`에 학교, `title`에 전공·학위 정보를 입력합니다. 종료일 없는 학력은 단일 취득/졸업 연월만 표시합니다.
- 교육 추가: `type: "training"`, `organization`에 기관, `title`에 활동명을 입력합니다. 근로 경력과 구분해 표시합니다.
- 기본 정렬: 시작일 최신순. 동일 시작일은 입력 순서를 유지합니다. 별도 순서를 지정하지 않았다면 새 최근 이력이 맨 위에 나타납니다.
- 수동 정렬: `order`가 있으면 작은 번호가 우선합니다. 기본 최신순으로 되돌리려면 `order`를 제거합니다.

확인되지 않은 회사명·직책은 만들지 않습니다. 현재 실무 항목은 제공된 스마트 교통 시스템 사업명과 실제 담당 업무를 사용합니다.

## 오른쪽 이력 목록 높이와 스크롤

`src/app/globals.css` 마지막의 **`#career` 전용 규칙**에서 조정합니다.

```css
#career {
  --experience-list-max-height: 560px;
  --experience-list-height: min(
    var(--experience-list-max-height),
    calc(100vh - var(--header-height) - 96px)
  );
}
```

`100svh` 지원 환경은 같은 계산의 svh 버전을 사용합니다. `--experience-list-max-height`가 목록 최대 높이이고 `96px`은 헤더 외 상하 여유 공간입니다. 화면이 작아지면 가용 높이에 맞춰 줄어듭니다. 이력이 적을 때는 실제 콘텐츠 높이를 사용하며 불필요한 스크롤바는 나타나지 않습니다.

데스크톱은 왼쪽 소개를 목록 밖에 두고 오른쪽만 `overflow-y: auto`로 스크롤합니다. 페이지네이션은 사용하지 않습니다. 위·아래 페이드는 더 읽을 내용이 있는 방향에만 표시합니다. 마우스 휠/터치 입력을 취소하지 않고 기본 스크롤 체이닝을 사용하므로 목록 경계에서 상위 페이지로 이동할 수 있습니다. 포커스 가능한 목록에서 방향키·Page Up/Down·Home/End를 사용할 수 있고, Tab으로 목록 밖으로 이동합니다.

모바일(767px 이하)은 세로 배치와 **일반 페이지 스크롤**로 전환합니다. 목록 높이 제한·내부 스크롤·마스크를 해제해 이력이 길어져도 모두 읽을 수 있습니다. 359px 이하에서는 날짜를 내용 위로 배치해 잘림을 방지합니다.

신규 항목만 기존 `PanelTransition`으로 짧게 등장합니다. 항목 ID가 유지되면 목록 스크롤마다 다시 등장하지 않습니다. 속도는 기존 `src/lib/animation.ts`의 `panelDuration`, easing은 `ease`를 공유합니다. 모션 감소 설정도 기존대로 적용됩니다.

## 자격증 추가·수정

`src/data/certifications.ts`의 `certifications` 배열에 객체를 추가합니다.

```ts
{
  id: "new-certificate",
  name: "실제로 취득한 자격증",
  issuer: "발급기관",
  acquiredAt: "2026-10-18", // YYYY-MM-DD, 화면에는 YYYY.MM 표시
  category: "private_international",
  credentialType: "international_vendor",
  icon: "cloud", // award | cloud | badge
  // verificationUrl: "https://실제-자격-확인-주소", // 선택
  // expiresAt: "2029-10-18", // 선택, 현재 화면에는 노출하지 않음
  // order: 1, // 선택: 수동 순서
},
```

`category`는 화면의 큰 그룹이며, `credentialType`은 실제 자격 유형입니다. 두 값을 구분해 입력하세요.

| category                | 표시 탭        | credentialType 예시                                                                    |
| ----------------------- | -------------- | -------------------------------------------------------------------------------------- |
| `national_public`       | 국가·공인 자격 | `national_technical`(국가기술자격), `nationally_accredited_private`(국가공인 민간자격) |
| `private_international` | 민간·국제 자격 | `international_vendor`(국제 벤더 자격), `private`(일반 민간자격)                       |

정보처리기사는 국가기술자격, SQLD는 국가공인 민간자격, AWS SAA는 국제 벤더 자격으로 등록되어 있습니다. 기본은 취득일 최신순이며 수동 `order`가 있으면 작은 번호부터 우선합니다.

확인 주소를 입력한 항목만 실제 링크로 표시합니다. 비어 있으면 클릭 가능한 요소를 만들지 않습니다. 탭은 방향키·Home·End로도 선택할 수 있습니다. 화면 크기별 페이지네이션을 제공하며, 같은 탭 내에서 페이지 전환 시 위치를 강제로 이동하지 않습니다. JavaScript가 비활성화되어도 이력 전체 목록은 기본 HTML로 표시되며, 자격증도 전체 목록 대체 화면을 사용합니다.

## 장면 확장과 검증

- `.section`: 공통 100vh fallback + 100svh 최소 높이, 수직 중앙 정렬, 고정 헤더 안전 여백.
- `ViewportScenes.tsx`: 콘텐츠가 화면보다 길면 스냅 제외. 모바일에서는 기본 스크롤.
- `Projects.tsx`: 배열을 정렬해 단일 목록으로 표시합니다. 데스크톱 3개 행 간격은 `globals.css`의 `.projects .project-list`, 썸네일 폭은 `.projects .project-item`에서 조정합니다.
- `CareerBrowser`: 왼쪽 소개와 오른쪽 독립 스크롤 이력 목록. `CertificationBrowser`는 기존 반응형 페이지네이션을 유지합니다. `PanelTransition`은 공통 짧은 전환을 담당합니다.
- `useActiveSection`: 경력·자격증의 페이지 수 또는 프로젝트 개수와 무관하게 영역별 점 하나만 유지합니다.

수정 후 `npm run typecheck`, `npm run lint`, `npm run build`를 실행하세요. 브라우저 검증은 `npm run dev`로 진행하고, 작업이 끝나면 **서버를 실행한 터미널에서 Control + C로 종료**합니다.

## 배포

`out/` 정적 산출물은 GitHub Actions를 통해 S3와 CloudFront에 배포하도록 구성했습니다. 초기 설정은 [배포 안내](DEPLOYMENT.md)를 참고하세요. 이미지 서버 없이 동작하도록 Next Image의 서버 최적화는 비활성화하고 반응형 크기 및 lazy loading을 사용합니다. 실제 이미지는 WebP/AVIF로 압축해 교체하세요.

실제 도메인이 확정되면 `.env.local`과 배포 환경에 `NEXT_PUBLIC_SITE_URL=https://실제도메인`을 설정해 Open Graph URL/이미지를 활성화합니다. SNS 호환성을 높이려면 `public/og-image.svg`를 PNG로 교체하고 메타데이터 경로도 변경하세요. 하위 경로 배포는 `basePath`와 이미지 경로 설정을 추가 확인해야 합니다.

## Hero 프로필과 기술 카드 수정

Hero의 소개와 이미지 경로는 **`src/data/hero.ts`의 `heroProfile`** 한곳에서 수정합니다. 기존 헤더·다른 섹션의 정보는 별도로 유지합니다.

```ts
export const heroProfile = {
  name: "손종인",
  role: "Developer",
  introduction: "서비스를 만들고, 기술로 문제를 해결합니다.",
  avatar: "/images/profile-avatar.webp",
  avatarAlt: "네이비 후드 차림의 캐릭터 프로필 일러스트",
};
```

- **프로필 이미지 교체:** `public/images/profile-avatar.webp`를 새 이미지로 교체하거나 `avatar`에 새 파일 경로를 입력합니다. `public`은 경로에 포함하지 않습니다. 정사각형 이미지와 768px 전후의 WebP를 권장하며, 대체 설명인 `avatarAlt`도 함께 바꿉니다. 현재 이미지는 참고 이미지의 스타일을 바탕으로 생성한 가상의 캐릭터 일러스트이며 실제 얼굴을 재현한 사진이 아닙니다.
- **이름·직무·소개 수정:** `name`, `role`, `introduction`만 변경합니다. 카드 하단의 이름과 직무도 같은 데이터에 연동됩니다.
- **기술 추가:** 로고를 `public/logos`에 넣고 같은 파일의 `heroTechnologies` 배열에 아래 객체를 추가합니다. `id`는 고유하게 지정합니다.

```ts
{
  id: "new-technology",
  name: "새 기술 이름",
  icon: "/logos/new-technology.svg",
  color: "#3286ff",
  // position: { x: 32, y: 13 }, // 생략하면 외곽 슬롯 자동 배치
  rotation: -14,
  animationDuration: 8, // 초: 클수록 천천히 움직임
  animationDelay: -2, // 음수로 시작 시점을 서로 다르게 설정 가능
  visible: true,
},
```

- **삭제·숨김:** 객체를 삭제하거나 `visible: false`로 지정합니다. 프로젝트의 기술 로고 목록에는 영향을 주지 않습니다.
- **카드 위치 변경:** `position.x/y`는 Hero 기술 영역 안에서 카드 **중심**의 백분율 좌표입니다. 기본 6개는 프로필 외곽에 배치합니다. 화면 바깥으로 나가지 않도록 x는 15~90%, y는 13~88%로 제한합니다. 중앙 프로필을 피하려면 기본 슬롯 주변을 사용하세요. 동시에 표시되는 기술이 6개를 넘으면 추가 카드는 아래의 반응형 목록으로 확장하여 겹침을 방지합니다.
- **각도·속도:** `rotation`은 기울기(도), `animationDuration`은 부유 주기(6~10초 권장), `animationDelay`는 시작 시점(초)입니다. `heroMotion`에서 프로필 주기·이동량과 기술 카드 이동량을 함께 조정합니다.
- **크기·반응형:** `src/app/globals.css` 끝의 `Hero 전용 스타일` 블록에서 관리합니다. 모든 선택자는 `#hero`에 한정되며, 모바일에서는 소개와 기술 장면을 세로로 배치합니다. 위치·부유·카드 회전을 별도 레이어로 분리해 기존 스크롤 패럴랙스를 유지합니다.
- **접근성:** 기본 HTML에 모든 소개·기술명을 표시합니다. JavaScript 없이도 읽을 수 있으며, `prefers-reduced-motion`에서는 반복 모션과 전환을 멈춥니다. 호버 강조는 마우스 환경에서만 적용합니다.

프로필 에셋은 내장 imagegen 도구로 생성했습니다. 사용한 프롬프트는 [프로필 생성 기록](hero-avatar-prompt.md)에 기록했습니다. AWS는 기존 로고의 스마일 부분만 주황색으로 분리한 `amazonaws-hero.svg`를 사용하며, 프로젝트용 원본 SVG는 그대로 유지합니다.

## GitHub Actions 자동 배포

워크플로·OIDC 역할·초기 설정·업데이트 및 복구 방법은 [배포 안내](DEPLOYMENT.md)를 참고하세요. AWS 인프라 정의는 [Terraform 안내](../infra/terraform/README.md)에 있습니다.

## 연락처 수정

`src/data/portfolio.ts`의 `email`과 `phone`을 바꾸면 Contact에 그대로 표시됩니다. 이메일은 메일 앱으로, 전화번호는 전화 앱으로 연결됩니다. `phone`의 `010-0000-0000`은 임시 값이므로 공개 배포 전에 실제 번호로 교체하세요. 전화번호를 공개하지 않으려면 빈 문자열로 지정하면 됩니다.

## 연락처 GitHub와 비용 운영

연락처 GitHub는 `src/data/portfolio.ts`의 `githubUrl`에서 수정하며, 기존 헤더 메뉴는 `showGithubInHeader: false`로 유지합니다. 비용 알림과 기본 지표 확인은 [운영 안내](OPERATIONS.md)를 참고하세요. 별도의 방문자 분석 스크립트는 사용하지 않습니다.
