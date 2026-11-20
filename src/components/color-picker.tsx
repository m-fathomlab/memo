import type { MemoColor } from "@/lib/memos";
import { colorName, labelDot } from "./label-color";

const colors: MemoColor[] = ["blue", "green", "orange", "pink", "purple", "teal", "yellow"];

// Figma `Label/Dot` 4색 중 하나를 고른다.
export function ColorPicker({
  value,
  onChange,
}: {
  value: MemoColor;
  onChange: (color: MemoColor) => void;
}) {
  return (
    <div role="radiogroup" aria-label="색" className="flex items-center gap-space-8">
      <span className="text-caption-sm text-text-muted">색</span>
      {colors.map((item) => (
        <button
          key={item}
          type="button"
          role="radio"
          aria-checked={value === item}
          aria-label={colorName[item]}
          onClick={() => onChange(item)}
          className={`flex size-8 items-center justify-center rounded-full border-2 ${
            value === item ? "border-primary" : "border-transparent"
          }`}
        >
          <span className={`size-[22px] rounded-full ${labelDot[item]}`} />
        </button>
      ))}
    </div>
  );
}
