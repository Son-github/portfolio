import type {
  Certification,
  CertificationCategory,
  CredentialType,
} from "@/types/certification";
// 새로운 자격증은 이 배열에 객체를 추가하면 자동으로 웹사이트에 표시됩니다. category와 credentialType을 구분해서 입력해야 합니다.
// acquiredAt은 YYYY-MM-DD(일자를 모르면 YYYY-MM), order는 선택적인 수동 순서입니다. 확인 URL은 실제 주소만 입력하세요.
export const certifications: Certification[] = [
  {
    id: "aws-saa",
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    acquiredAt: "2026-03-01",
    category: "private_international",
    credentialType: "international_vendor",
    icon: "cloud",
  },
  {
    id: "engineer-information-processing",
    name: "정보처리기사",
    issuer: "한국산업인력공단",
    acquiredAt: "2023-11-15",
    category: "national_public",
    credentialType: "national_technical",
    icon: "award",
  },
  {
    id: "pccp-java-level-1",
    name: "PCCP Lv.1 · Java",
    issuer: "(주)그렙",
    acquiredAt: "2024-11",
    category: "private_international",
    credentialType: "private",
    icon: "badge",
  },
  {
    id: "sqld",
    name: "SQLD",
    issuer: "한국데이터산업진흥원",
    acquiredAt: "2023-10-06",
    category: "national_public",
    credentialType: "nationally_accredited_private",
    icon: "badge",
  },
];
export const certificationGroups: {
  id: CertificationCategory;
  label: string;
}[] = [
  { id: "national_public", label: "국가·공인 자격" },
  { id: "private_international", label: "민간·국제 자격" },
];
export const credentialTypeLabels: Record<CredentialType, string> = {
  national_technical: "국가기술자격",
  nationally_accredited_private: "국가공인 민간자격",
  international_vendor: "국제 벤더 자격",
  private: "일반 민간자격",
};
