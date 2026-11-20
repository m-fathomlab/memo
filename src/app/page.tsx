import { connection } from "next/server";
import { Suspense } from "react";
import { HomeMemos } from "@/components/home-memos";
import { IconPlus } from "@/components/icons";
import { PrimaryButton } from "@/components/primary-button";
import { formatToday, getCategories, getMemos } from "@/lib/memo-data";

// 메모는 열 때마다 Supabase 에서 읽어 온다.
async function HomeContent() {
  await connection(); // 현재 시각을 쓰므로 빌드 때 미리 만들지 않고 요청 때 그린다
  const now = new Date();
  const [memos, categories] = await Promise.all([getMemos(now), getCategories()]);

  return (
    <>
      <header className="flex flex-col gap-space-8 px-space-8">
        <p className="text-caption-md text-text-muted">{formatToday(now)}</p>
        <h1 className="text-heading-xl text-text-primary">
          오늘까지 글이
          <br />
          <span className="text-primary">{memos.length}개</span> 올라왔어요
        </h1>
      </header>

      <HomeMemos memos={memos} categories={categories} />
    </>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-space-16 pt-space-64">
      <main className="flex flex-1 flex-col gap-space-16">
        <Suspense fallback={null}>
          <HomeContent />
        </Suspense>
      </main>

      <div className="sticky bottom-0 bg-surface-page pt-space-16 pb-space-34">
        <PrimaryButton label="새 글 쓰기" icon={<IconPlus size={20} />} href="/memos/new" />
      </div>
    </div>
  );
}
