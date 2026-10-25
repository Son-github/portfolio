"use client";
import { sections } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
/** 페이지 전체에서 한 번만 렌더링되는 고정 스크롤 내비게이션. */
export function SectionNavigation() {
  const active = useActiveSection();
  return (
    <nav className="section-navigation" aria-label="페이지 섹션">
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={`${label} 섹션으로 이동`}
          aria-current={active === id ? "location" : undefined}
          title={label}
        >
          <span />
        </a>
      ))}
    </nav>
  );
}
