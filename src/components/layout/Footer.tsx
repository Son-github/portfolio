import { portfolio } from "@/data/portfolio";
/** 사이트 하단 서명과 저작권. */
export function Footer() {
  return (
    <footer className="footer container">
      <a href="#hero">{portfolio.englishName}</a>
      <span>Son Jongin</span>
    </footer>
  );
}
