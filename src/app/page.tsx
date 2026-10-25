import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionNavigation } from "@/components/layout/SectionNavigation";
import { Hero } from "@/components/sections/Hero";
import { Career } from "@/components/sections/Career";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { ViewportScenes } from "@/components/ui/ViewportScenes";
import { ScrollEffects } from "@/components/ui/ScrollEffects";
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        본문 바로가기
      </a>
      <div className="page-glow" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        <Career />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <SectionNavigation />
      <ScrollEffects />
      <ViewportScenes />
    </>
  );
}
