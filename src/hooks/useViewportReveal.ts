"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { animation } from "@/lib/animation";

/** 기본 HTML은 숨기지 않습니다. 관찰이 성공한 뒤에만 1회 재생하므로
 * JS 미실행/Observer 미지원/애니메이션 실패 시에도 콘텐츠가 남습니다.
 * selector가 있으면 같은 DOM 안의 항목을 순서대로 재생합니다. */
export function useViewportReveal(selector?: string) {
  const ref = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (
      !root ||
      played.current ||
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;

    const elements = selector
      ? Array.from(root.querySelectorAll<HTMLElement>(selector))
      : [root];
    const controls: { stop: () => void }[] = [];
    const restore = () =>
      elements.forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        played.current = true;
        observer.disconnect();
        try {
          elements.forEach((element, index) => {
            const control = animate(
              element,
              {
                opacity: [0, 1],
                y: [selector ? animation.staggerY : animation.revealY, 0],
              },
              {
                duration: animation.duration,
                ease: animation.ease,
                delay: selector ? index * animation.stagger : 0,
              },
            );
            controls.push(control);
            // 완료 후 inline 스타일까지 제거하여 기존 hover 및 레이아웃을 보존합니다.
            Promise.resolve(control)
              .then(() => {
                element.style.removeProperty("opacity");
                element.style.removeProperty("transform");
              })
              .catch(restore);
          });
        } catch {
          controls.forEach((control) => control.stop());
          restore();
        }
      },
      { threshold: 0, rootMargin: animation.viewportMargin },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      controls.forEach((control) => control.stop());
      restore();
    };
  }, [reduced, selector]);

  return ref;
}
