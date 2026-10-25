"use client";
import { useRef, useState } from "react";
import type {
  Certification,
  CertificationCategory,
} from "@/types/certification";
import { certificationGroups } from "@/data/certifications";
import { usePageCapacity } from "@/hooks/usePageCapacity";
import { sortRecent } from "@/lib/content";
import { CertificationItem } from "@/components/ui/CertificationItem";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Pagination } from "@/components/ui/Pagination";
import { PanelTransition } from "@/components/ui/PanelTransition";

export function CertificationBrowser({ items }: { items: Certification[] }) {
  const [category, setCategory] =
    useState<CertificationCategory>("national_public");
  const [page, setPage] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const { ref, capacity } = usePageCapacity("certifications");
  const filtered = sortRecent(
    items.filter((item) => item.category === category),
    (item) => item.acquiredAt,
  );
  const count = Math.max(1, Math.ceil(filtered.length / capacity));
  const current = Math.min(page, count - 1);
  const select = (index: number) => {
    setCategory(certificationGroups[index].id);
    setPage(0);
  };
  return (
    <div ref={ref}>
      <SectionHeading label="CERTIFICATIONS">
        지속적으로 배우고, 역량을 확장합니다.
      </SectionHeading>
      <div className="category-tabs" role="tablist" aria-label="자격증 분류">
        {certificationGroups.map((group, index) => (
          <button
            key={group.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            id={`tab-${group.id}`}
            type="button"
            role="tab"
            aria-selected={category === group.id}
            aria-controls="certification-panel"
            tabIndex={category === group.id ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={(event) => {
              const target =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? certificationGroups.length - 1
                    : event.key === "ArrowRight"
                      ? (index + 1) % certificationGroups.length
                      : event.key === "ArrowLeft"
                        ? (index - 1 + certificationGroups.length) %
                          certificationGroups.length
                        : -1;
              if (target >= 0) {
                event.preventDefault();
                select(target);
                buttons.current[target]?.focus({ preventScroll: true });
              }
            }}
          >
            {group.label}
          </button>
        ))}
      </div>
      <div
        id="certification-panel"
        role="tabpanel"
        aria-labelledby={`tab-${category}`}
        tabIndex={0}
      >
        <PanelTransition transitionKey={`${category}-${current}-${capacity}`}>
          <div className="experience-grid certification-grid">
            {filtered
              .slice(current * capacity, (current + 1) * capacity)
              .map((item) => (
                <CertificationItem key={item.id} item={item} />
              ))}
          </div>
          {!filtered.length && (
            <p className="body-copy empty-state">등록된 자격증이 없습니다.</p>
          )}
        </PanelTransition>
      </div>
      <Pagination
        page={current}
        count={count}
        onChange={setPage}
        label="자격증 페이지"
      />
    </div>
  );
}
