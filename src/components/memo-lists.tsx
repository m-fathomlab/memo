"use client";

import { CardHeader } from "@/components/card-header";
import { MemoItem } from "@/components/memo-item";
import { useSavedMemos } from "@/lib/memo-store";
import { memos as sampleMemos } from "@/lib/memos";

// 홈의 두 카드. 이 브라우저에 저장한 메모는 "최근 메모" 맨 위에 보인다.
export function MemoLists() {
  const saved = useSavedMemos();
  const pinned = sampleMemos.filter((memo) => memo.pinned);
  const recent = [...saved, ...sampleMemos.filter((memo) => !memo.pinned)];

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
