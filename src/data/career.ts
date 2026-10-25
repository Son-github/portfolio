import type { Career, ExperienceType } from "@/types/career";
// 새로운 경력을 추가하려면 아래 배열에 객체를 추가하세요.
// 가장 최근 경력이 자동으로 위에 표시됩니다.
// type은 work, training, education 중 하나를 사용합니다.
// 날짜는 YYYY-MM(또는 YYYY-MM-DD), 재직 중인 work는 endDate를 생략합니다.
// order가 있으면 작은 번호부터 우선 표시하며, 같은 시작일은 입력 순서를 유지합니다.
export const careers: Career[] = [
  {
    id: "smart-transport-infrastructure",
    type: "work",
    organization: "스마트 교통 시스템 구축 사업",
    title: "IT 인프라 점검 및 구축 지원",
    startDate: "2025-04",
    endDate: "2026-02",
    highlights: [
      "네트워크 장비 및 시스템 연동 상태 확인",
      "현장 점검 및 검수 관련 자료 관리",
      "협력업체와의 일정 및 구축 자료 협의",
    ],
  },
  {
    id: "cloudwave-training",
    type: "training",
    organization: "CloudWave",
    title: "클라우드 교육 및 인프라 구축 프로젝트",
    startDate: "2024-12",
    endDate: "2025-02",
    description: "AWS 기반 인프라 설계 및 구축",
  },
  {
    id: "computer-science-degree",
    type: "education",
    organization: "한국외국어대학교",
    title: "컴퓨터공학 졸업",
    startDate: "2023-02",
  },
];
export const experienceTypeLabels: Record<ExperienceType, string> = {
  work: "실무 경력",
  training: "교육·프로젝트",
  education: "학력",
};
