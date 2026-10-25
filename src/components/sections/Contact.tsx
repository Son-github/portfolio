import { Mail, Github, ArrowUpRight } from "lucide-react";
import { TextLines } from "@/components/ui/TextLines";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
/** 이메일과 설정된 GitHub 주소로 직접 연결합니다. */
export function Contact() {
  return (
    <section id="contact" className="section contact">
      <SectionReveal className="container contact-grid">
        <SectionHeading label="CONTACT">
          <TextLines text={portfolio.contactTitle} />
        </SectionHeading>
        <StaggerContainer className="contact-content">
          <p className="body-copy">{portfolio.contactDescription}</p>
          <div className="contact-buttons">
            <a
              className="button button-primary"
              href={`mailto:${portfolio.email}`}
              aria-label={`이메일 보내기: ${portfolio.email}`}
            >
              <Mail size={20} />
              {portfolio.contactButton}
              <ArrowUpRight size={14} />
            </a>
            {portfolio.githubUrl && (
              <a
                className="button"
                href={portfolio.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={21} />
                GitHub
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </StaggerContainer>
      </SectionReveal>
    </section>
  );
}
