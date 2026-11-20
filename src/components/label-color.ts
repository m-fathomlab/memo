import type { MemoColor } from "@/lib/memos";

// Figma `label/*` 와 `label/*-soft` 변수. 클래스 이름은 통째로 적어야 Tailwind 가 찾는다.
export const labelColor: Record<MemoColor, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};
