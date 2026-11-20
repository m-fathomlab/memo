import { CardHeader } from "@/components/card-header";
import { MemoItem } from "@/components/memo-item";
import type { Memo } from "@/lib/memos";

function Empty({ text }: { text: string }) {
  return <p className="px-space-20 py-space-12 text-body-sm text-text-muted">{text}</p>;
}

// 홈의 두 카드. 고정한 메모와 나머지(최신순)를 나눠 보여준다.
export function MemoLists({ memos }: { memos: Memo[] }) {
  const pinned = memos.filter((memo) => memo.pinned);
  const recent = memos.filter((memo) => !memo.pinned);

  return (
    <>
      <section className="overflow-hidden rounded-xl bg-surface-card py-space-8">
        <CardHeader title="고정한 글" pin />
        {pinned.length === 0 && <Empty text="고정한 글이 없어요." />}
        {pinned.map((memo) => (
          <MemoItem key={memo.id} memo={memo} />
        ))}
      </section>

      <section className="overflow-hidden rounded-xl bg-surface-card py-space-8">
        <CardHeader title="최근 글" action="전체 보기" actionHref="/memos" />
        {recent.length === 0 && <Empty text="글이 없어요." />}
        {recent.map((memo) => (
          <MemoItem key={memo.id} memo={memo} />
        ))}
      </section>
    </>
  );
}
