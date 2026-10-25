import { CloudCog, Zap, ChartNoAxesColumnIncreasing } from "lucide-react";
import { TextLines } from "@/components/ui/TextLines";
import { experiences, expertiseHeading } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadges } from "@/components/ui/TechBadge";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
const icons = {
  cloud: CloudCog,
  automation: Zap,
  monitoring: ChartNoAxesColumnIncreasing,
};
/** 세 가지 역량을 카드 없이 얇은 세로선으로 구분합니다. */
export function Experience() {
  return (
    <section id="experience" className="section experience">
      <SectionReveal className="container">
        <StaggerContainer className="section-top">
          <SectionHeading label={expertiseHeading.label}>
            <TextLines text={expertiseHeading.title} />
          </SectionHeading>
        </StaggerContainer>
        <StaggerContainer className="experience-grid">
          {experiences.map((item) => {
            const Icon = icons[item.icon];
            return (
              <article key={item.title}>
                <Icon className="experience-icon" size={37} strokeWidth={2} />
                <h3>{item.title}</h3>
                <p className="body-copy">{item.description}</p>
                <TechBadges items={item.technologies} />
              </article>
            );
          })}
        </StaggerContainer>
      </SectionReveal>
    </section>
  );
}
