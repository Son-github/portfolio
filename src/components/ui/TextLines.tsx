import { Fragment } from "react";

/** 데이터의 줄바꿈을 기존 제목 스타일 안에서 그대로 표시합니다. */
export function TextLines({ text }: { text: string }) {
  return text.split("\n").map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}
