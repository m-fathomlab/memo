"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconButton } from "@/components/icon-button";
import { IconTrash } from "@/components/icons";
import { deleteMemo } from "@/lib/memo-data";

// 상세 화면 위쪽의 삭제 버튼 — 확인을 거쳐 글을 지우고 홈으로 돌아간다.
// 고정된 글은 지울 수 없다(눌러도 안내만 나온다). 고정은 PinButton 에서 풀 수 있다.
export function DeleteButton({ id, title, pinned }: { id: string; title: string; pinned: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (busy) return;
    if (pinned) {
      window.alert("고정된 글은 지울 수 없어요. 먼저 핀을 눌러 고정을 풀어 주세요.");
      return;
    }
    if (!window.confirm(`'${title}' 글을 지울까요? 지운 글은 되돌릴 수 없어요.`)) return;
    setBusy(true);
    try {
      await deleteMemo(id);
    } catch {
      setBusy(false);
      window.alert("지우지 못했어요. 고정된 글이면 먼저 고정을 풀어 주세요.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <IconButton label={pinned ? "삭제하기 (고정된 글은 지울 수 없어요)" : "삭제하기"} disabled={pinned} onClick={remove}>
      <IconTrash />
    </IconButton>
  );
}
