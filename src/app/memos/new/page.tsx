import type { Metadata } from "next";
import { WriteMemo } from "@/components/write-memo";

export const metadata: Metadata = { title: "새 메모" };

export default function NewMemoPage() {
  return <WriteMemo />;
}
