import type { Project, ProjectStatus } from "@/types/project";
// 프로젝트 추가 및 수정: 객체를 추가하면 order 순서로 자동 표시됩니다.
// 실제 주소가 생겼을 때 githubUrl, liveUrl 또는 detailUrl을 입력하세요.
// 상태 변경: completed(구축·검증 완료), developing(개발 중), enhancing(고도화 중),
// operating(서비스 운영 중), stopped(운영 종료). 실제 확인한 상태만 입력합니다.
export const projects: Project[] = [
  {
    id: "cloudwave",
    slug: "cloudwave",
    order: 1,
    title: "CloudWave",
    period: "2025.01 – 2025.02",
    type: "클라우드 인프라 구축 팀 프로젝트",
    summary: "대규모 트래픽 대응을 위한 AWS 클라우드 인프라 구축",
    description:
      "Multi-AZ와 EKS 기반 인프라를 설계하고,\nHPA·Karpenter를 활용한 자동 확장 환경을 구축했습니다.\nk6 부하 테스트를 통해 시스템의 확장 동작을 검증했습니다.",
    technologies: ["AWS", "Kubernetes", "Terraform", "Redis", "Datadog"],
    image: "/projects/cloudwave.svg",
    imageAlt: "CloudWave 프로젝트 이미지 준비 중",
    githubUrl: "https://github.com/cw-5jang6bu",
    liveUrl: "",
    status: "completed",
  },
  {
    id: "daily-briefing",
    slug: "daily-briefing",
    order: 2,
    title: "Daily Briefing",
    period: "2025.09 – 2025.12, 2026.08 - 현재 고도화 중",
    type: "개인 서비스 개발 및 클라우드 운영",
    summary: "일상 정보 서비스의 AWS 인프라 구축 및 운영",
    description:
      "Spring Boot 기반 서비스를 ECS Fargate에 배포하고,\nGitHub Actions를 활용해 배포 과정을 자동화했습니다.\nCloudWatch 로그 분석으로 운영 중 발생한 오류를 해결했습니다.",
    technologies: [
      "AWS",
      "ECS Fargate",
      "Spring Boot",
      "RDS PostgreSQL",
      "CloudFront",
      "GitHub Actions",
    ],
    image: "/projects/daily-briefing.svg",
    imageAlt: "Daily Briefing 프로젝트 이미지 준비 중",
    githubUrl: "https://github.com/Son-github/dailybriefing",
    liveUrl: "",
    status: "enhancing",
  },
];
export const projectStatusLabels: Record<ProjectStatus, string> = {
  operating: "서비스 운영 중",
  developing: "개발 중",
  enhancing: "고도화 중",
  stopped: "운영 종료",
  completed: "구축·검증 완료",
};
