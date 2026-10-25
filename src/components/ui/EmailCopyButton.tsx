"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

/** 연락처 행의 기존 스타일을 유지하고 이메일만 클립보드로 복사합니다. */
export function EmailCopyButton({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyEmail() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 2500);
    } catch {
      // 브라우저가 복사를 차단해도 주소는 계속 표시하고 수동 복사를 안내합니다.
      setStatus("error");
    }
  }

  const StatusIcon = status === "copied" ? Check : Copy;
  return (
    <button
      type="button"
      className="contact-detail contact-email-copy"
      onClick={copyEmail}
      aria-label={`이메일 주소 복사: ${email}`}
      title="이메일 주소 복사"
    >
      <span className="contact-detail-icon" aria-hidden="true">
        <Mail size={20} strokeWidth={1.5} />
      </span>
      <span className="contact-detail-text">
        <span className="contact-detail-label" role="status" aria-live="polite">
          {status === "copied"
            ? "EMAIL · 복사됨"
            : status === "error"
              ? "EMAIL · 주소를 선택해 직접 복사해주세요"
              : "EMAIL"}
        </span>
        <span className="contact-detail-value">{email}</span>
      </span>
      <StatusIcon
        className="contact-detail-arrow"
        size={17}
        aria-hidden="true"
      />
    </button>
  );
}
