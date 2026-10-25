"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { animation } from "@/lib/animation";

/** 단일 Motion 구독으로 Hero와 한 장의 배경만 갱신합니다.
 * 일반 섹션은 재차 숨기지 않아 역방향 스크롤에서도 안정적으로 읽을 수 있습니다.
 * 휠/터치 이벤트를 가로채거나 스크롤 중 React를 다시 렌더링하지 않습니다. */
export function ScrollEffects() {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const update = useRef<(y: number) => void>(() => {});
  useMotionValueEvent(scrollY, "change", (y) => update.current(y));

  useEffect(() => {
    if (
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const hero = document.getElementById("hero");
    const copy = hero?.querySelector<HTMLElement>(".hero-copy");
    const icons = hero?.querySelector<HTMLElement>(".tech-scene");
    const glow = document.querySelector<HTMLElement>(".page-glow");
    if (!hero || !copy || !icons || !glow) return;
    let heroHeight = 1;
    let maxScroll = 1;
    let scenes: { element: HTMLElement; top: number; height: number }[] = [];
    let mobile = false;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const render = (y: number) => {
      const progress = clamp(
        (y / heroHeight - animation.hero.start) /
          (animation.hero.end - animation.hero.start),
      );
      const scale = mobile ? animation.hero.mobileScale : 1;
      copy.style.transform = `translate3d(0,${progress * animation.hero.textY * scale}px,0)`;
      icons.style.transform = `translate3d(0,${progress * animation.hero.iconsY * scale}px,0)`;
      copy.style.opacity = `${1 - progress * progress * animation.hero.textFade}`;
      icons.style.opacity = `${1 - progress * progress * animation.hero.iconsFade}`;
      scenes.forEach(({ element, top, height }) => {
        if (y + window.innerHeight < top || y > top + height) return;
        const exit = clamp(
          1 -
            (top + height - y) /
              (window.innerHeight * animation.sectionExit.range),
        );
        element.style.setProperty(
          "--scene-opacity",
          `${1 - exit * animation.sectionExit.fade}`,
        );
        element.style.setProperty(
          "--scene-y",
          `${exit * animation.sectionExit.y * scale}px`,
        );
      });
      // 페이지 전체에서 같은 레이어를 조금씩 움직여 섹션 경계의 색상 전환을 방지합니다.
      glow.style.transform = `translate3d(0,${(clamp(y / maxScroll) - 0.5) * animation.backgroundY * scale}px,0)`;
    };
    const measure = () => {
      heroHeight = hero.offsetHeight;
      maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      mobile = window.innerWidth <= animation.mobileBreakpoint;
      scenes = Array.from(
        document.querySelectorAll<HTMLElement>("main > .section:not(.hero)"),
      ).flatMap((scene) => {
        const element = scene.querySelector<HTMLElement>(":scope > .container");
        return element
          ? [
              {
                element,
                top: scene.getBoundingClientRect().top + window.scrollY,
                height: scene.offsetHeight,
              },
            ]
          : [];
      });
      render(window.scrollY);
    };
    update.current = render;
    measure();
    window.addEventListener("resize", measure);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : undefined;
    observer?.observe(document.querySelector("main")!);
    return () => {
      update.current = () => {};
      window.removeEventListener("resize", measure);
      observer?.disconnect();
      scenes.forEach(({ element }) => {
        element.style.removeProperty("--scene-opacity");
        element.style.removeProperty("--scene-y");
      });
      [copy, icons, glow].forEach((element) => {
        element.style.removeProperty("transform");
        element.style.removeProperty("opacity");
      });
    };
  }, [reduced]);
  return null;
}
