import Image from "next/image";
import type { CSSProperties } from "react";
import {
  heroTechnologies,
  heroSlots,
  heroMotion,
  type HeroTechnology,
} from "@/data/hero";
import { ProfileCard } from "@/components/ui/ProfileCard";

function FloatingTechItem({
  tech,
  index,
  extra = false,
}: {
  tech: HeroTechnology;
  index: number;
  extra?: boolean;
}) {
  const slot = tech.position ?? heroSlots[index % heroSlots.length];
  return (
    <li
      className={`hero-tech-position${extra ? " hero-tech-extra" : ""}`}
      style={
        {
          // 외곽 안전 범위: 회전과 부유 이동이 있어도 장면 밖으로 크게 벗어나지 않습니다.
          "--tech-x": `${Math.min(90, Math.max(15, slot.x))}%`,
          "--tech-y": `${Math.min(88, Math.max(13, slot.y))}%`,
          "--rotation": `${tech.rotation}deg`,
          "--duration": `${tech.animationDuration}s`,
          "--delay": `${tech.animationDelay}s`,
          "--drift-x": `${index % 2 ? -heroMotion.techSway : heroMotion.techSway}px`,
          "--drift-y": `${index % 2 ? heroMotion.techDrift : -heroMotion.techDrift}px`,
          "--logo-color": tech.color,
        } as CSSProperties
      }
    >
      <div className="hero-tech-float">
        <div
          className={`hero-tech-card${tech.id === "aws" ? " hero-tech-aws" : ""}`}
        >
          <Image
            src={tech.icon}
            alt=""
            width={72}
            height={64}
            sizes="(max-width: 767px) 36px, 72px"
            priority={index < 6}
          />
          <span>{tech.name}</span>
        </div>
      </div>
    </li>
  );
}

/** 위치 레이어 / 부유 레이어 / 카드 회전을 분리해 기존 스크롤 패럴랙스와 충돌하지 않습니다. */
export function FloatingTechIcons() {
  const visible = heroTechnologies.filter((tech) => tech.visible);
  return (
    <div
      className="tech-scene"
      style={
        {
          "--profile-duration": `${heroMotion.profileDuration}s`,
          "--profile-drift": `${heroMotion.profileDrift}px`,
        } as CSSProperties
      }
    >
      <div className="hero-scene-stage">
        <div className="hero-scene-glow" aria-hidden="true" />
        <ProfileCard />
        <ul className="hero-tech-list" aria-label="주요 기술">
          {visible.slice(0, 6).map((tech, index) => (
            <FloatingTechItem key={tech.id} tech={tech} index={index} />
          ))}
        </ul>
      </div>
      {visible.length > 6 && (
        <ul className="hero-tech-overflow" aria-label="추가 기술">
          {visible.slice(6).map((tech, index) => (
            <FloatingTechItem
              key={tech.id}
              tech={tech}
              index={index + 6}
              extra
            />
          ))}
        </ul>
      )}
    </div>
  );
}
