import Image from "next/image";
import { getProjectTechnologies } from "@/data/technologies";

/** 프로젝트별 동일 기술 중복을 제거하고 공통 등록 로고를 작은 기존 태그에 표시합니다. */
export function ProjectTechnologies({ items }: { items: readonly string[] }) {
  return (
    <div className="tech-badges">
      {getProjectTechnologies(items).map((technology) => (
        <span key={technology.name} className="tech-badge project-tech-badge">
          {technology.logo && (
            <Image
              src={`/logos/${technology.logo}.svg`}
              width={13}
              height={13}
              alt=""
            />
          )}
          {technology.name}
        </span>
      ))}
    </div>
  );
}
