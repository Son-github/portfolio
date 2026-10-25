import type { Project } from "@/types/project";
import { projects } from "@/data/projects";
import { ProjectItem } from "@/components/projects/ProjectItem";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
/** 프로젝트를 분할하지 않고 하나의 목록에 표시합니다. 3개 이후도 문서 안에서 자동 확장합니다. */
export function Projects({ items = projects }: { items?: Project[] } = {}) {
  return (
    <section id="projects" className="section projects">
      <SectionReveal className="container">
        <SectionHeading label="PROJECTS">
          실제 서비스의 문제를
          <br />
          클라우드로 해결한 프로젝트입니다.
        </SectionHeading>
        <div className="project-list">
          {[...items]
            .sort((a, b) => a.order - b.order)
            .map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
        </div>
      </SectionReveal>
    </section>
  );
}
