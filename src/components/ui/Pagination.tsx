"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
/** 탭과 경력에서 공통 사용. 포커스나 문서 스크롤 위치를 강제로 옮기지 않습니다. */
export function Pagination({
  page,
  count,
  onChange,
  label,
}: {
  page: number;
  count: number;
  onChange: (page: number) => void;
  label: string;
}) {
  if (count <= 1) return null;
  return (
    <nav className="pagination" aria-label={label}>
      <button
        type="button"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        aria-label={`${label} 이전`}
      >
        <ChevronLeft size={17} />
      </button>
      <span aria-live="polite">
        {page + 1} / {count}
      </span>
      <button
        type="button"
        disabled={page === count - 1}
        onClick={() => onChange(page + 1)}
        aria-label={`${label} 다음`}
      >
        <ChevronRight size={17} />
      </button>
    </nav>
  );
}
