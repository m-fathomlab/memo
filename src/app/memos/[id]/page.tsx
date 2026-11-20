import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { MemoDetailView } from "@/components/memo-detail-view";
import { getMemo } from "@/lib/memo-data";

async function MemoDetail({ params }: PageProps<"/memos/[id]">) {
  await connection(); // 현재 시각을 쓰므로 요청 때 그린다
  const { id } = await params;
  const memo = await getMemo(id, new Date());

  if (!memo) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col items-center justify-center gap-space-16 px-space-16">
        <p className="text-body-md text-text-secondary">메모를 찾을 수 없어요.</p>
        <Link href="/" className="text-label-md text-primary">
          홈으로 가기
        </Link>
      </div>
    );
  }

  return <MemoDetailView memo={memo} />;
}

export default function Page(props: PageProps<"/memos/[id]">) {
  return (
    <Suspense fallback={null}>
      <MemoDetail {...props} />
    </Suspense>
  );
}
