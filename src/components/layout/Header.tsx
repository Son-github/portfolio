import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
/** 로고와 두 개의 간결한 상단 메뉴. GitHub는 실제 주소 설정 시 표시합니다. */
export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#hero" className="wordmark">
          {portfolio.englishName}
        </a>
        <nav aria-label="상단 메뉴">
          {portfolio.showGithubInHeader && portfolio.githubUrl && (
            <a
              href={portfolio.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={13} />
            </a>
          )}
          <a href="#contact">
            Contact <ArrowUpRight size={13} />
          </a>
        </nav>
      </div>
    </header>
  );
}
