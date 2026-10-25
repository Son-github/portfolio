"use client";
import { useEffect } from "react";
/** 한 화면보다 긴 장면은 스냅 대상에서 제외합니다. 휠이나 키보드 입력은 그대로 둡니다. */
export function ViewportScenes() {
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const elements = new Set<HTMLElement>();
    const observer = new ResizeObserver((entries) =>
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        element.dataset.overflow = String(
          element.offsetHeight > window.innerHeight + 2,
        );
      }),
    );
    const scan = () => {
      document
        .querySelectorAll<HTMLElement>("main > .section")
        .forEach((element) => {
          if (!elements.has(element)) {
            elements.add(element);
            observer.observe(element);
          }
          element.dataset.overflow = String(
            element.offsetHeight > window.innerHeight + 2,
          );
        });
    };
    const mutation = new MutationObserver(scan);
    mutation.observe(document.querySelector("main")!, {
      childList: true,
      subtree: true,
    });
    window.addEventListener("resize", scan);
    scan();
    return () => {
      mutation.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", scan);
    };
  }, []);
  return null;
}
