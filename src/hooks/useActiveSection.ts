"use client";

import { useEffect, useState } from "react";
import { sections } from "@/data/portfolio";

/** 높이가 서로 다른 섹션을 뷰포트 38% 지점에서 추적합니다.
 * Observer로 경계를 감지하고, 페이지 끝/역방향 이동은 프레임당 1회 보완합니다.
 * 섹션 치수는 ResizeObserver에서만 측정해 스크롤 중 강제 레이아웃을 피합니다. */
export function useActiveSection() {
  const [active, setActive] = useState<string>("hero");
  useEffect(() => {
    const elements = sections.flatMap(({ id }) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });
    let positions: { id: string; top: number }[] = [];
    let viewportHeight = window.innerHeight;
    let documentHeight = document.documentElement.scrollHeight;
    let frame = 0;
    const update = () => {
      const y = window.scrollY;
      const next =
        y + viewportHeight >= documentHeight - 3
          ? "contact"
          : ([...positions]
              .reverse()
              .find((item) => item.top <= y + viewportHeight * 0.38)?.id ??
            "hero");
      setActive((previous) => (previous === next ? previous : next));
    };
    const measure = () => {
      positions = elements.map((element) => ({
        id: element.id,
        top: element.offsetTop,
      }));
      viewportHeight = window.innerHeight;
      documentHeight = document.documentElement.scrollHeight;
      update();
    };
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
    };
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(update, {
            rootMargin: "-37% 0px -62% 0px",
            threshold: 0,
          })
        : undefined;
    elements.forEach((element) => observer?.observe(element));
    const resize =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : undefined;
    elements.forEach((element) => resize?.observe(element));
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      resize?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);
  return active;
}
