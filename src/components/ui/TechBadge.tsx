/** 기술 및 자격증에 공통으로 사용하는 작은 태그. */
export function TechBadge({ children }: { children: React.ReactNode }) {
  return <span className="tech-badge">{children}</span>;
}
export function TechBadges({ items }: { items: readonly string[] }) {
  return (
    <div className="tech-badges">
      {items.map((item) => (
        <TechBadge key={item}>{item}</TechBadge>
      ))}
    </div>
  );
}
