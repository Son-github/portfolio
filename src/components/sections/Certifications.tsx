import { CertificationItem } from "@/components/ui/CertificationItem";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications } from "@/data/certifications";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { CertificationBrowser } from "@/components/certifications/CertificationBrowser";
export function Certifications() {
  return (
    <section id="certifications" className="section certifications">
      <SectionReveal className="container">
        <div className="certification-interactive">
          <CertificationBrowser items={certifications} />
        </div>
        <noscript>
          <style>{".certification-interactive{display:none}"}</style>
          <SectionHeading label="CERTIFICATIONS">
            지속적으로 배우고, 역량을 확장합니다.
          </SectionHeading>
          <div className="experience-grid">
            {certifications.map((item) => (
              <CertificationItem key={item.id} item={item} />
            ))}
          </div>
        </noscript>
      </SectionReveal>
    </section>
  );
}
