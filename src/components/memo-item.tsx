import Link from "next/link";
import type { Memo } from "@/lib/memos";
import { IconNote } from "./icons";
import { labelColor } from "./label-color";

// Figma `Memo/Item` — 누르면 메모 상세로 이동한다.
export function MemoItem({ memo }: { memo: Memo }) {
  return (
    <Link
      href={`/memos/${memo.id}`}
      className="flex h-18 items-center gap-space-16 px-space-20 py-space-12"
    >
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-sm ${labelColor[memo.color]}`}
      >
        <IconNote size={22} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-space-4">
        <p className="truncate text-title-md text-text-primary">{memo.title}</p>
        <p className="truncate text-body-sm text-text-secondary">{memo.preview}</p>
      </div>
      <p className="shrink-0 text-caption-sm text-text-muted">{memo.date}</p>
    </Link>
  );
}
