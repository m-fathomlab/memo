"use client";

import type { MemoColor } from "./memos";

// 글은 Supabase 에 저장된다. 이 브라우저에는 쓰다 만 글(임시 저장)만 남는다.
const DRAFT_KEY = "memo-app:draft";

export type Draft = {
  title: string;
  category: string | null;
  color: MemoColor;
  html: string;
};

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // 사생활 보호 모드 등에서는 저장소를 못 쓸 수 있다
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function readDraft(): Draft | null {
  const raw = readStorage(DRAFT_KEY);
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as Partial<Draft>;
    if (typeof draft.title !== "string" || typeof draft.html !== "string") return null;
    return {
      title: draft.title,
      html: draft.html,
      category: draft.category === undefined ? null : draft.category,
      color: draft.color ?? "green",
    };
  } catch {
    return null;
  }
}

export function writeDraft(draft: Draft) {
  writeStorage(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  writeStorage(DRAFT_KEY, null);
}

// 마지막에 고른 작성자를 이 브라우저에 기억해 둔다.
const AUTHOR_KEY = "memo-app:author";

export function readLastAuthor(): string | null {
  return readStorage(AUTHOR_KEY);
}

export function writeLastAuthor(name: string | null) {
  writeStorage(AUTHOR_KEY, name);
}
