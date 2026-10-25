import { portfolio } from "@/data/portfolio";
import { careers } from "@/data/career";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { CareerBrowser } from "@/components/career/CareerBrowser";
/** 기존 #career 앵커와 공통 섹션 등장 효과를 유지합니다. */
export function Career() {
  return (
    <section id="career" className="section career">
      <SectionReveal className="container">
        <CareerBrowser
          items={careers}
          title={portfolio.aboutTitle}
          description={portfolio.aboutDescription}
        />
      </SectionReveal>
    </section>
  );
}
