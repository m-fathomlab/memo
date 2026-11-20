import { Suspense } from "react";
import { MemoDetailView } from "@/components/memo-detail-view";
import { SavedMemoDetail } from "@/components/saved-memo-detail";
import { getMemo, memos } from "@/lib/memos";

export function generateStaticParams() {
  return memos.map((memo) => ({ id: memo.id }));
}

async function MemoDetail({ params }: PageProps<"/memos/[id]">) {
  const { id } = await params;
  const memo = getMemo(id);

  // 예시 메모는 서버에서, 직접 쓴 메모는 브라우저 저장소에서 찾는다.
  return memo ? <MemoDetailView memo={memo} /> : <SavedMemoDetail id={id} />;
}

export default function Page(props: PageProps<"/memos/[id]">) {
  return (
    <Suspense fallback={null}>
      <MemoDetail {...props} />
    </Suspense>
  );
}
