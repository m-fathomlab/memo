"use client";

import Link from "next/link";
import { MemoDetailView } from "@/components/memo-detail-view";
import { useSavedMemos } from "@/lib/memo-store";

// 이 브라우저에 저장한 메모의 상세 화면. 저장소는 브라우저에만 있어서 서버에서는 찾을 수 없다.
export function SavedMemoDetail({ id }: { id: string }) {
  const memo = useSavedMemos().find((saved) => saved.id === id);

  if (!memo) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col items-center justify-center gap-space-16 px-space-16">
        <p className="text-body-md text-text-secondary">이 브라우저에서 메모를 찾을 수 없어요.</p>
        <Link href="/" className="text-label-md text-primary">
          홈으로 가기
        </Link>
      </div>
    );
  }

  return <MemoDetailView memo={memo} />;
}
