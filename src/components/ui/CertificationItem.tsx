import { Award, Cloud, BadgeCheck, ArrowUpRight } from "lucide-react";
import type { Certification } from "@/types/certification";
import { credentialTypeLabels } from "@/data/certifications";
import { displayMonth } from "@/lib/content";
const icons = { award: Award, cloud: Cloud, badge: BadgeCheck };
/** 확인 주소가 있는 경우에만 실제 링크를 렌더링합니다. */
export function CertificationItem({ item }: { item: Certification }) {
  const Icon = icons[item.icon];
  const content = (
    <>
      <Icon className="experience-icon" size={37} strokeWidth={2} />
      <h3>{item.name}</h3>
      <p className="body-copy">
        {item.issuer}
        <br />
        <time dateTime={item.acquiredAt}>{displayMonth(item.acquiredAt)}</time>
      </p>
      <span className="tech-badge">
        {credentialTypeLabels[item.credentialType]}
      </span>
    </>
  );
  return (
    <article className="certification-item">
      {item.verificationUrl ? (
        <a
          className="credential-link"
          href={item.verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.name} 자격 확인`}
        >
          {content}
          <ArrowUpRight size={14} />
        </a>
      ) : (
        content
      )}
    </article>
  );
}
