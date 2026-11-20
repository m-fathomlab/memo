"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconButton } from "@/components/icon-button";
import { IconPin } from "@/components/icons";
import { setMemoPinned } from "@/lib/memo-data";

// 상세 화면의 핀 — 누를 때마다 고정/해제한다.
export function PinButton({ id, pinned: initial }: { id: string; pinned: boolean }) {
  const router = useRouter();
  const [pinned, setPinned] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    const next = !pinned;
    setPinned(next);
    setBusy(true);
    try {
      await setMemoPinned(id, next);
      router.refresh();
    } catch {
      setPinned(!next); // 저장에 실패하면 되돌린다
    } finally {
      setBusy(false);
    }
  }

  return (
    <IconButton label={pinned ? "고정 해제" : "고정"} pressed={pinned} active={pinned} onClick={toggle}>
      <IconPin />
    </IconButton>
  );
}
