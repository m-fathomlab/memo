import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { WriteMemo } from "@/components/write-memo";
import { getCategories, getMembers } from "@/lib/memo-data";

export const metadata: Metadata = { title: "새 글" };

async function NewMemo() {
  await connection(); // 분류 목록은 열 때마다 읽어 온다
  const [categories, members] = await Promise.all([getCategories(), getMembers()]);
  return <WriteMemo categories={categories} members={members} />;
}

export default function NewMemoPage() {
  return (
    <Suspense fallback={null}>
      <NewMemo />
    </Suspense>
  );
}
