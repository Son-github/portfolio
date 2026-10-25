"use client";
import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { animation } from "@/lib/animation";
/** 탭/페이지 내용만 짧게 전환합니다. 기본 마크업을 숨기지 않고 애니메이션 실패 시 즉시 복원합니다. */
export function PanelTransition({
  children,
  transitionKey,
}: {
  children: React.ReactNode;
  transitionKey: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (
      !node ||
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const restore = () => {
      node.style.removeProperty("opacity");
      node.style.removeProperty("transform");
    };
    try {
      const control = animate(
        node,
        { opacity: [0.5, 1], y: [6, 0] },
        { duration: animation.panelDuration, ease: animation.ease },
      );
      Promise.resolve(control).then(restore).catch(restore);
      return () => {
        control.stop();
        restore();
      };
    } catch {
      restore();
    }
  }, [transitionKey, reduced]);
  return <div ref={ref}>{children}</div>;
}
