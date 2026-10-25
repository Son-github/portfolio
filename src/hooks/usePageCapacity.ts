"use client";
import { useEffect, useRef, useState } from "react";

/** 화면 크기에 맞춰 페이지 크기를 조절합니다. 실제 컨테이너가 넘치면 한 항목씩 줄입니다.
 * 한 항목 자체가 길면 높이를 자동 확장하며 내용을 자르지 않습니다. */
export function usePageCapacity(kind: "career" | "certifications") {
  const ref = useRef<HTMLDivElement>(null);
  const [capacity, setCapacity] = useState(3);
  useEffect(() => {
    const measure = () => {
      const mobile = window.innerWidth < 768;
      const desired = mobile
        ? 1
        : kind === "career"
          ? 3
          : window.innerWidth >= 1050
            ? 3
            : 2;
      setCapacity(desired);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [kind]);
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      const available =
        window.innerHeight - (window.innerWidth < 768 ? 148 : 186);
      if (root.offsetHeight > available && capacity > 1)
        setCapacity((n) => Math.max(1, n - 1));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [capacity]);
  return { ref, capacity };
}
