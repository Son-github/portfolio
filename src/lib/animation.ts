// 스크롤 인터랙션 조정은 이 파일에서 관리합니다. 시간 단위는 초, 거리는 px입니다.
export const animation = {
  duration: 0.72,
  panelDuration: 0.28,
  sectionExit: { range: 0.2, fade: 0.4, y: -12 },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  revealY: 24,
  staggerY: 12,
  stagger: 0.08,
  viewportMargin: "0px 0px -6% 0px",
  hero: {
    start: 0.08,
    end: 0.92,
    textY: -64,
    iconsY: -24,
    textFade: 0.55,
    iconsFade: 0.2,
    mobileScale: 0.55,
  },
  backgroundY: 24,

  mobileBreakpoint: 767,
} as const;
