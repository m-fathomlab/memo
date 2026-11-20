import type { MemoColor } from "@/lib/memos";
import { labelColor } from "./label-color";

// Figma `Badge` — 색은 메모의 색 라벨을 따른다.
export function Badge({ label, color }: { label: string; color: MemoColor }) {
  return (
    <span
      className={`flex h-[26px] items-center rounded-full px-space-8 text-caption-sm ${labelColor[color]}`}
    >
      {label}
    </span>
  );
}
