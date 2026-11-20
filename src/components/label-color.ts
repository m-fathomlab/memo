import type { MemoColor } from "@/lib/memos";

// Figma `label/*` 와 `label/*-soft` 변수. 클래스 이름은 통째로 적어야 Tailwind 가 찾는다.
export const labelDot: Record<MemoColor, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
  purple: "bg-label-purple",
  teal: "bg-label-teal",
  yellow: "bg-label-yellow",
};

export const colorName: Record<MemoColor, string> = {
  blue: "파랑",
  green: "초록",
  orange: "주황",
  pink: "분홍",
  purple: "보라",
  teal: "청록",
  yellow: "노랑",
};

export const labelColor: Record<MemoColor, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
  purple: "bg-label-purple-soft text-label-purple",
  teal: "bg-label-teal-soft text-label-teal",
  yellow: "bg-label-yellow-soft text-label-yellow",
};
