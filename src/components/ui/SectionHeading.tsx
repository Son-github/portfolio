/** 섹션의 영문 레이블과 일관된 제목 계층. */
export function SectionHeading({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{children}</h2>
    </div>
  );
}
