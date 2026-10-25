import type { Career } from "@/types/career";
import { experienceTypeLabels } from "@/data/career";
import { displayMonth } from "@/lib/content";
import { PanelTransition } from "@/components/ui/PanelTransition";

/** 날짜와 내용만으로 구분하며 스크롤 중에는 재마운트하지 않습니다. 새 id의 항목만 가볍게 등장합니다. */
export function CareerItem({ item }: { item: Career }) {
  return (
    <article className="education-entry">
      <PanelTransition transitionKey={item.id}>
        <div className="education-entry-grid">
          <p className="education-period">
            <time dateTime={item.startDate}>
              {displayMonth(item.startDate)}
            </time>
            {item.endDate ? (
              <>
                {" "}
                –{" "}
                <time dateTime={item.endDate}>
                  {displayMonth(item.endDate)}
                </time>
              </>
            ) : item.type !== "education" ? (
              " – 현재"
            ) : null}
          </p>
          <div className="education-entry-content">
            <p className="education-type">{experienceTypeLabels[item.type]}</p>
            <p className="education-organization">{item.organization}</p>
            <h3>{item.title}</h3>
            {item.description && (
              <p className="education-description">{item.description}</p>
            )}
            {!!item.highlights?.length && (
              <ul className="education-highlights">
                {item.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PanelTransition>
    </article>
  );
}
