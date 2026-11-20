import type { MemoColor } from "@/lib/memos";
import { labelColor } from "./label-color";

// Figma `Badge` — 색은 메모의 색 라벨을 따른다. 분류가 없으면 중립 색.
export function Badge({ label, color }: { label: string; color: MemoColor | null }) {
  return (
    <span
      className={`flex h-[26px] items-center rounded-full px-space-8 text-caption-sm ${
        color ? labelColor[color] : "bg-surface-page text-text-muted"
      }`}
    >
      {label}
    </span>
  );
}
