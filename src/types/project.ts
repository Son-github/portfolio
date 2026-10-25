export type ProjectStatus =
  "operating" | "developing" | "enhancing" | "completed" | "stopped";
export interface Project {
  id: string;
  slug: string;
  title: string;
  period: string;
  type?: string;
  summary: string;
  description: string;
  technologies: string[];
  featured?: boolean;
  image?: string;
  imageAlt?: string;
  githubUrl?: string;
  liveUrl?: string;
  detailUrl?: string;
  status?: ProjectStatus;
  order: number;
}
