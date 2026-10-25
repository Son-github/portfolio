import { heroProfile } from "@/data/hero";
import { FloatingTechIcons } from "@/components/ui/FloatingTechIcons";

/** Hero 전용 구성. 기존 스크롤 시스템이 사용하는 클래스와 섹션 ID를 유지합니다. */
export function Hero() {
  return (
    <section id="hero" className="hero section" aria-labelledby="hero-name">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="hero-mark" aria-hidden="true" />
          <h1 id="hero-name">{heroProfile.name}</h1>
          <p className="hero-role">{heroProfile.role}</p>
          <p className="hero-description">{heroProfile.introduction}</p>
        </div>
        <FloatingTechIcons />
      </div>
    </section>
  );
}
