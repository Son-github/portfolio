import { Mail, Phone, Github, ArrowUpRight } from "lucide-react";
import { TextLines } from "@/components/ui/TextLines";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { StaggerContainer } from "@/components/ui/StaggerContainer";

/** 연락처 값은 data/portfolio.ts에서 수정합니다. 빈 전화번호는 표시하지 않습니다. */
export function Contact() {
  const contacts = [
    {
      label: "EMAIL",
      value: portfolio.email,
      href: `mailto:${portfolio.email}`,
      Icon: Mail,
    },
    {
      label: "PHONE",
      value: portfolio.phone,
      href: `tel:${portfolio.phone.replace(/[^\d+]/g, "")}`,
      Icon: Phone,
    },
    {
      label: "GITHUB",
      value: portfolio.githubUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      href: portfolio.githubUrl,
      Icon: Github,
    },
  ].filter(({ value }) => value.trim());

  return (
    <section id="contact" className="section contact">
      <SectionReveal className="container contact-grid">
        <SectionHeading label="CONTACT">
          <TextLines text={portfolio.contactTitle} />
        </SectionHeading>
        <StaggerContainer
          className="contact-content"
          selector=":scope > p, .contact-detail"
        >
          <p className="body-copy">{portfolio.contactDescription}</p>
          <address className="contact-details">
            {contacts.map(({ label, value, href, Icon }) => (
              <a
                className="contact-detail"
                href={href}
                key={label}
                target={label === "GITHUB" ? "_blank" : undefined}
                rel={label === "GITHUB" ? "noopener noreferrer" : undefined}
              >
                <span className="contact-detail-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <span className="contact-detail-text">
                  <span className="contact-detail-label">{label}</span>
                  <span className="contact-detail-value">{value}</span>
                </span>
                <ArrowUpRight
                  className="contact-detail-arrow"
                  size={17}
                  aria-hidden="true"
                />
              </a>
            ))}
          </address>
        </StaggerContainer>
      </SectionReveal>
    </section>
  );
}
