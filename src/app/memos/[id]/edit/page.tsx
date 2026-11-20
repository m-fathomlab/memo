import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { WriteMemo } from "@/components/write-memo";
import { getCategories, getMembers, getMemo } from "@/lib/memo-data";

export const metadata: Metadata = { title: "글 수정" };

async function EditMemo({ params }: PageProps<"/memos/[id]/edit">) {
  await connection();
  const { id } = await params;
  const [memo, categories, members] = await Promise.all([
    getMemo(id, new Date()),
    getCategories(),
    getMembers(),
  ]);

  if (!memo) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col items-center justify-center gap-space-16 px-space-16">
        <p className="text-body-md text-text-secondary">글을 찾을 수 없어요.</p>
        <Link href="/" className="text-label-md text-primary">
          홈으로 가기
        </Link>
      </div>
    );
  }

  return <WriteMemo memo={memo} categories={categories} members={members} />;
}

export default function Page(props: PageProps<"/memos/[id]/edit">) {
  return (
    <Suspense fallback={null}>
      <EditMemo {...props} />
    </Suspense>
  );
}
