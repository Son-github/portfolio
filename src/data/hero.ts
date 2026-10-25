// Hero만의 수정 위치입니다. 이름·직무·소개·이미지 경로를 이곳에서 바꾸세요.
// avatar는 public 기준 경로입니다. 실제 사진/새 캐릭터로 교체해도 컴포넌트 수정은 필요 없습니다.
export const heroProfile = {
  name: "손종인",
  role: "Developer",
  introduction: "사용자 관점에서 항상 생각하는 사람입니다.",
  avatar: "/images/profile-avatar.webp",
  avatarAlt: "네이비 후드 차림의 캐릭터 프로필 일러스트",
};

export interface HeroTechnology {
  id: string;
  name: string;
  icon: string;
  color: string;
  // 기술 영역 안의 중심 좌표(%). 생략하면 아래 외곽 슬롯에 자동 배치합니다.
  position?: { x: number; y: number };
  rotation: number;
  animationDuration: number;
  animationDelay: number;
  visible: boolean;
}

// 새 기술은 객체 하나를 추가하세요. 삭제하거나 visible: false로 지정하면 숨겨집니다.
// 중앙 프로필을 비우도록 외곽 좌표를 사용하세요. 주기(초)는 6~10, 지연은 음수도 가능합니다.
export const heroTechnologies: HeroTechnology[] = [
  {
    id: "aws",
    name: "AWS",
    icon: "/logos/amazonaws-hero.svg",
    color: "#ffad32",
    position: { x: 32, y: 13 },
    rotation: 18,
    animationDuration: 8,
    animationDelay: -2,
    visible: true,
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    icon: "/logos/kubernetes.svg",
    color: "#3286ff",
    position: { x: 83, y: 14 },
    rotation: -21,
    animationDuration: 9,
    animationDelay: -4,
    visible: true,
  },
  {
    id: "terraform",
    name: "Terraform",
    icon: "/logos/terraform.svg",
    color: "#9263ff",
    position: { x: 15, y: 46 },
    rotation: 23,
    animationDuration: 7.5,
    animationDelay: -1,
    visible: true,
  },
  {
    id: "docker",
    name: "Docker",
    icon: "/logos/docker.svg",
    color: "#26b8ed",
    position: { x: 90, y: 53 },
    rotation: 19,
    animationDuration: 8.5,
    animationDelay: -5,
    visible: true,
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    icon: "/logos/githubactions.svg",
    color: "#28b5fa",
    position: { x: 16, y: 85 },
    rotation: -20,
    animationDuration: 10,
    animationDelay: -3,
    visible: true,
  },
  {
    id: "redis",
    name: "Redis",
    icon: "/logos/redis.svg",
    color: "#ed3345",
    position: { x: 78, y: 88 },
    rotation: 20,
    animationDuration: 7,
    animationDelay: -6,
    visible: true,
  },
];

// Hero의 반복 동작 설정만 관리합니다. 공통 섹션 전환 설정은 lib/animation.ts에 있습니다.
export const heroMotion = {
  profileDuration: 10,
  profileDrift: 4,
  techDrift: 11,
  techSway: 3,
};

// 추가 카드도 중앙과 겹치지 않도록 외곽 슬롯을 사용합니다.
// 6개 초과 시 장면을 아래로 확장하고 작은 카드 목록을 추가해 모든 기술을 표시합니다.
export const heroSlots = [
  { x: 32, y: 13 },
  { x: 83, y: 14 },
  { x: 15, y: 46 },
  { x: 90, y: 53 },
  { x: 16, y: 85 },
  { x: 78, y: 88 },
];
