import { CardHeader } from "@/components/card-header";
import { MemoItem } from "@/components/memo-item";
import type { Memo } from "@/lib/memos";

// 홈의 두 카드. 고정한 메모와 나머지(최신순)를 나눠 보여준다.
export function MemoLists({ memos }: { memos: Memo[] }) {
  const pinned = memos.filter((memo) => memo.pinned);
  const recent = memos.filter((memo) => !memo.pinned);

  return (
    <>
      <section className="overflow-hidden rounded-xl bg-surface-card py-space-8">
        <CardHeader title="고정한 메모" pin />
        {pinned.map((memo) => (
          <MemoItem key={memo.id} memo={memo} />
        ))}
      </section>

      <section className="overflow-hidden rounded-xl bg-surface-card py-space-8">
        <CardHeader title="최근 메모" action="전체 보기" />
        {recent.map((memo) => (
          <MemoItem key={memo.id} memo={memo} />
        ))}
      </section>
    </>
  );
}
