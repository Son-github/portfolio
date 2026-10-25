import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/types/project";
import { projectStatusLabels } from "@/data/projects";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { ProjectTechnologies } from "./ProjectTechnologies";
/** 선택적 이미지·주소·상태가 없어도 렌더링되는 프로젝트 한 행. */
export function ProjectItem({ project }: { project: Project }) {
  return (
    <article className="project-item" id={`project-${project.slug}`}>
      <div className="project-image">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt || `${project.title} 프로젝트 미리보기`}
            fill
            sizes="(max-width: 767px) 90vw, 360px"
          />
        ) : (
          <span className="image-fallback">
            {project.title}
            <small>PROJECT PREVIEW · 이미지 준비 중</small>
          </span>
        )}
      </div>
      <StaggerContainer className="project-content">
        <div className="project-title">
          <h3>{project.title}</h3>
          <span className="project-period">{project.period}</span>
          {project.status && (
            <span className={`status status-${project.status}`}>
              {projectStatusLabels[project.status]}
            </span>
          )}
        </div>
        {project.type && <p className="project-period">{project.type}</p>}
        <h4>{project.summary}</h4>
        <p className="body-copy">{project.description}</p>
        <div className="project-bottom">
          <ProjectTechnologies items={project.technologies} />
          <div className="project-links">
            {project.githubUrl ? (
              <a
                className="project-github"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub 저장소 열기`}
              >
                <Github size={14} />
                GitHub
                <ArrowUpRight size={12} />
              </a>
            ) : (
              <button
                type="button"
                className="project-github"
                disabled
                title="저장소 주소 등록 예정"
                aria-label={`${project.title} GitHub 저장소 주소 등록 예정`}
              >
                <Github size={14} />
                GitHub
              </button>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                서비스 <ArrowUpRight size={13} />
              </a>
            )}
            {project.detailUrl && (
              <a href={project.detailUrl}>
                상세 보기 <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
      </StaggerContainer>
    </article>
  );
}
