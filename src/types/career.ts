export type ExperienceType = "work" | "training" | "education";
export interface Career {
  id: string;
  type: ExperienceType;
  organization: string;
  title: string;
  startDate: string; // YYYY-MM 또는 YYYY-MM-DD
  endDate?: string;
  description?: string;
  highlights?: string[];
  order?: number;
}
