"use client";

import type { HTMLAttributes } from "react";
import { useViewportReveal } from "@/hooks/useViewportReveal";

type Props = HTMLAttributes<HTMLDivElement> & {
  selector?: string;
};
/** 추가 래퍼 없이 기존 div를 교체합니다. selector로 재생할 하위 요소만 지정합니다.
 * 프로젝트처럼 긴 목록은 행마다 독립 인스턴스를 사용해야 진입 시에 재생됩니다. */
export function StaggerContainer({
  children,
  selector = ":scope > *",
  ...props
}: Props) {
  const ref = useViewportReveal(selector);
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
