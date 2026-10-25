"use client";
import { useEffect, useRef } from "react";
import type { Career } from "@/types/career";
import { sortRecent } from "@/lib/content";
import { CareerItem } from "@/components/ui/CareerItem";
import { TextLines } from "@/components/ui/TextLines";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** 왼쪽 소개와 오른쪽 목록을 분리합니다. 내부 스크롤은 브라우저 기본 체이닝을 사용합니다.
 * 휠/터치 이벤트를 취소하지 않아 목록 경계에서 상위 문서로 자연스럽게 이동합니다. */
export function CareerBrowser({
  items,
  title,
  description,
}: {
  items: Career[];
  title: string;
  description: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const scroll = scrollRef.current;
    const list = listRef.current;
    if (!scroll || !list) return;
    const update = () => {
      const enabled = scroll.scrollHeight > scroll.clientHeight + 1;
      scroll.style.setProperty(
        "--history-fade-top",
        enabled && scroll.scrollTop > 1 ? "14px" : "0px",
      );
      scroll.style.setProperty(
        "--history-fade-bottom",
        enabled &&
          scroll.scrollTop + scroll.clientHeight < scroll.scrollHeight - 1
          ? "14px"
          : "0px",
      );
      scroll.dataset.overflow = String(enabled);
    };
    scroll.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : undefined;
    observer?.observe(scroll);
    observer?.observe(list);
    update();
    return () => {
      scroll.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, []);
  const sorted = sortRecent(items, (item) => item.startDate);
  return (
    <div className="education-layout">
      <div className="education-introduction">
        <SectionHeading label="EDUCATION & EXPERIENCE">
          <TextLines text={title} />
        </SectionHeading>
        <p className="body-copy career-intro">{description}</p>
      </div>
      <div
        className="education-scroll"
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label="학력·교육·경력 이력 목록"
        aria-describedby="education-scroll-help"
      >
        <span id="education-scroll-help" className="sr-only">
          이력 목록입니다. 방향키와 Page Up, Page Down으로 스크롤할 수 있습니다.
          Tab 키로 목록 밖으로 이동할 수 있습니다.
        </span>
        <ol className="education-timeline" ref={listRef}>
          {sorted.map((item) => (
            <li key={item.id}>
              <CareerItem item={item} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
