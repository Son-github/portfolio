export type CertificationCategory = "national_public" | "private_international";
export type CredentialType =
  | "national_technical"
  | "nationally_accredited_private"
  | "international_vendor"
  | "private";
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  acquiredAt: string;
  category: CertificationCategory;
  credentialType: CredentialType;
  icon: "award" | "cloud" | "badge";
  verificationUrl?: string;
  expiresAt?: string;
  order?: number;
}
