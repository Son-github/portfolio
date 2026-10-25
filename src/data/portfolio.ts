// 개인 정보·자기소개 수정 위치입니다. 줄바꿈은 \n으로 지정합니다.
// 실제 GitHub 프로필 주소를 입력하면 헤더와 연락처에 링크가 표시됩니다.
export const portfolio = {
  name: "손종인",
  englishName: "SON JONGIN",
  email: "jongin718@gmail.com",
  // 공개할 번호로 교체하세요. 아래 번호는 실제 연락처가 아닌 임시 표시입니다.
  phone: "010-8227-8435",
  location: "Seoul, South Korea",
  githubUrl: "https://github.com/Son-github",
  // 연락처에서 GitHub를 공개하되 기존 헤더 구성은 유지합니다.
  showGithubInHeader: false,
  aboutTitle: "피하기보단 직접 부딪혀\n문제를 해결하며\n성장해왔습니다.",
  aboutDescription:
    "컴퓨터공학을 전공하고 클라우드 인프라 구축 프로젝트와\nIT 시스템 구축 지원 업무를 경험했습니다.\n\n지속적으로 인프라를 설계하고 서비스를 배포해 운영하며\n인프라 관련 역량을 쌓아가고 있습니다.",
  contactTitle: "더 안정적인 서비스를 위해\n함께 고민하고 싶습니다.",
  contactDescription: "새로운 도전과 기회를 기다리고 있습니다.",
};
// experience 앵커는 기존 링크 호환성을 위해 유지하고 표시명만 EXPERTISE로 변경합니다.
export const sections = [
  { id: "hero", label: "처음" },
  { id: "career", label: "EDUCATION & EXPERIENCE" },
  { id: "experience", label: "기술 역량" },
  { id: "projects", label: "프로젝트" },
  { id: "certifications", label: "자격증" },
  { id: "contact", label: "연락처" },
] as const;
export const expertiseHeading = {
  label: "EXPERTISE",
  title: "개발과 인프라에 대한 이해를 바탕으로\n더욱 나은 서비스 운영 환경을 고민하고 있습니다.",
};
// 기술 역량 수정: 영역별 짧은 설명과 기존 기술 태그를 관리합니다.
export const experiences = [
  {
    icon: "cloud",
    title: "Cloud Architecture",
    description: "요구사항에 따른\n클라우드 인프라 설계",
    technologies: ["AWS", "VPC", "EKS", "ECS"],
  },
  {
    icon: "automation",
    title: "DevOps & Automation",
    description: "반복 작업을 줄이는\n인프라 및 배포 자동화",
    technologies: ["Terraform", "GitHub Actions", "ArgoCD"],
  },
  {
    icon: "monitoring",
    title: "Operations & Monitoring",
    description: "안정적인 서비스 운영과\n로그 기반 장애 분석",
    technologies: ["CloudWatch", "Datadog", "Troubleshooting"],
  },
] as const;
