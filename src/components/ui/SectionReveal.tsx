"use client";

import type { HTMLAttributes } from "react";
import { useViewportReveal } from "@/hooks/useViewportReveal";

/** 기존 컨테이너의 크기와 클래스를 유지하는 1회성 섹션 등장 효과. */
export function SectionReveal({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const ref = useViewportReveal();
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
