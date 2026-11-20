import type { MemoColor } from "@/lib/memos";
import { IconClose } from "./icons";
import { labelDot } from "./label-color";

// Figma `Chip` (State=Default / Selected)
// dot 을 주면 분류 색 점이 앞에 붙고, removable 이면 뒤에 × 가 붙는다.
export function Chip({
  label,
  selected = false,
  dot,
  removable = false,
  onClick,
}: {
  label: string;
  selected?: boolean;
  dot?: MemoColor;
  removable?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={removable ? undefined : selected}
      aria-label={removable ? `${label} 삭제` : undefined}
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center gap-space-8 rounded-full px-space-16 text-label-md ${
        selected ? "bg-primary text-text-on-primary" : "bg-surface-card text-text-secondary"
      }`}
    >
      {dot && <span aria-hidden="true" className={`size-2 rounded-full ${labelDot[dot]}`} />}
      {label}
      {removable && <IconClose size={16} />}
    </button>
  );
}
