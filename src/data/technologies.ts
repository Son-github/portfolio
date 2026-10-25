import type { Technology } from "@/types/portfolio";
// 기술 추가 및 카드 배치 수정 위치. SVG는 public/logos에 저장합니다.
// x/y는 기술 영역 내 백분율, duration은 부유 애니메이션 주기(초)입니다.
export const technologies: Technology[] = [
  {
    name: "AWS",
    logo: "amazonaws",
    color: "#ffffff",
    x: 17,
    y: 6,
    rotation: 13,
    duration: 7.8,
  },
  {
    name: "Kubernetes",
    logo: "kubernetes",
    color: "#3286ff",
    x: 66,
    y: 22,
    rotation: -18,
    duration: 6.5,
  },
  {
    name: "Terraform",
    logo: "terraform",
    color: "#9263ff",
    x: 31,
    y: 37,
    rotation: 21,
    duration: 8.5,
  },
  {
    name: "Docker",
    logo: "docker",
    color: "#26b8ed",
    x: 3,
    y: 59,
    rotation: -14,
    duration: 6,
  },
  {
    name: "GitHub Actions",
    logo: "githubactions",
    color: "#28b5fa",
    x: 68,
    y: 60,
    rotation: 14,
    duration: 9,
  },
  {
    name: "Redis",
    logo: "redis",
    color: "#ed3345",
    x: 41,
    y: 86,
    rotation: 20,
    duration: 7,
  },
  {
    name: "CloudWatch",
    logo: "amazoncloudwatch",
    color: "#6b9dfa",
    x: 88,
    y: 48,
    rotation: 18,
    duration: 8,
    subdued: true,
  },
];

// 프로젝트 기술 로고 등록 위치. public/logos의 로컬 SVG 파일명을 사용하세요.
// Hero와 같은 기술은 기존 카드 데이터에서 로고 정보를 공유합니다.
export interface TechnologyLogo {
  name: string;
  logo?: string;
}
export const technologyLogos: Record<string, TechnologyLogo> = {
  ...Object.fromEntries(
    technologies.map(({ name, logo }) => [name.toLowerCase(), { name, logo }]),
  ),
  "argo cd": { name: "Argo CD", logo: "argo" },
  argocd: { name: "Argo CD", logo: "argo" },
  jenkins: { name: "Jenkins", logo: "jenkins" },
  ecs: { name: "ECS", logo: "amazonecs" },
  "ecs fargate": { name: "ECS Fargate", logo: "amazonecs" },
  "spring boot": { name: "Spring Boot", logo: "springboot" },
  "rds postgresql": { name: "RDS PostgreSQL", logo: "postgresql" },
  datadog: { name: "Datadog", logo: "datadog" },
  rds: { name: "RDS", logo: "amazonrds" },
  cloudfront: { name: "CloudFront", logo: "amazoncloudfront" },
};

/** 대소문자/공백이 다른 같은 기술도 한 번만 표시합니다.
 * 등록되지 않은 기술은 이름을 유지해 프로젝트 추가를 막지 않습니다. */
export function getProjectTechnologies(
  names: readonly string[],
): TechnologyLogo[] {
  const seen = new Set<string>();
  return names.flatMap((name) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return [];
    const technology = technologyLogos[normalized] ?? { name: name.trim() };
    const key = technology.logo ?? technology.name.toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    return [technology];
  });
}
