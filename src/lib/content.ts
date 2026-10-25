/** 수동 order가 있으면 우선하고, 기본은 최신 취득일/경력 시작일 순입니다. 원본 배열은 수정하지 않습니다. */
export function sortRecent<T extends { order?: number }>(
  items: readonly T[],
  date: (item: T) => string,
): T[] {
  return [...items].sort(
    (a, b) =>
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      date(b).localeCompare(date(a)),
  );
}
export function chunkItems<T>(items: readonly T[], size: number): T[][] {
  const safeSize = Math.max(1, Math.floor(size));
  return Array.from({ length: Math.ceil(items.length / safeSize) }, (_, i) =>
    items.slice(i * safeSize, (i + 1) * safeSize),
  );
}
export function displayMonth(date: string) {
  return date.slice(0, 7).replace("-", ".");
}
