import { connection } from "next/server";
import { Suspense } from "react";
import { Chip } from "@/components/chip";
import { IconPlus } from "@/components/icons";
import { MemoLists } from "@/components/memo-lists";
import { PrimaryButton } from "@/components/primary-button";
import { formatToday, getMemos } from "@/lib/memo-data";

const categories = ["전체", "업무", "개인", "아이디어"];

// 메모는 열 때마다 Supabase 에서 읽어 온다.
async function HomeContent() {
  await connection(); // 현재 시각을 쓰므로 빌드 때 미리 만들지 않고 요청 때 그린다
  const now = new Date();
  const memos = await getMemos(now);

  return (
    <>
      <header className="flex flex-col gap-space-8 px-space-8">
        <p className="text-caption-md text-text-muted">{formatToday(now)}</p>
        <h1 className="text-heading-xl text-text-primary">
          오늘까지 메모를
          <br />
          <span className="text-primary">{memos.length}개</span> 남겼어요
        </h1>
      </header>

      <nav aria-label="메모 분류" className="flex gap-space-8 px-space-12">
        {categories.map((category) => (
          <Chip key={category} label={category} selected={category === "전체"} />
        ))}
      </nav>

      <MemoLists memos={memos} />
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
        <PrimaryButton label="새 메모 쓰기" icon={<IconPlus size={20} />} href="/memos/new" />
      </div>
    </div>
  );
}
