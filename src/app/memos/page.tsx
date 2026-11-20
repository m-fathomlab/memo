import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { IconLink } from "@/components/icon-button";
import { IconChevronLeft } from "@/components/icons";
import { MemoItem } from "@/components/memo-item";
import { getMemos } from "@/lib/memo-data";

export const metadata: Metadata = { title: "전체 글" };

async function AllMemos() {
  await connection();
  const memos = await getMemos(new Date());

  return (
    <section className="overflow-hidden rounded-xl bg-surface-card py-space-8">
      {memos.length === 0 && (
        <p className="px-space-20 py-space-12 text-body-sm text-text-muted">글이 없어요.</p>
      )}
      {memos.map((memo) => (
        <MemoItem key={memo.id} memo={memo} />
      ))}
    </section>
  );
}

export default function MemosPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-space-16 pt-space-48 pb-space-34">
      <header className="flex items-center gap-space-4">
        <IconLink label="뒤로가기" href="/">
          <IconChevronLeft />
        </IconLink>
        <h1 className="text-title-lg text-text-primary">전체 글</h1>
      </header>
      <main className="mt-space-16 flex-1">
        <Suspense fallback={null}>
          <AllMemos />
        </Suspense>
      </main>
    </div>
  );
}
