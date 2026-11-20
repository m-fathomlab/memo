"use client";

import { useSyncExternalStore } from "react";
import type { Memo, MemoBlock, MemoColor } from "./memos";

const MEMOS_KEY = "memo-app:memos";
const DRAFT_KEY = "memo-app:draft";
const CHANGE_EVENT = "memo-app:change";

/** 로컬 스토리지에 들어가는 모양 */
type StoredMemo = {
  id: string;
  title: string;
  category: Memo["category"];
  color: MemoColor;
  body: MemoBlock[];
  createdAt: string;
};

export type Draft = {
  title: string;
  category: Memo["category"];
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

function emitChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// ---------- 날짜 ----------

function dayStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function formatListDate(createdAt: Date, now = new Date()) {
  const days = Math.round((dayStart(now) - dayStart(createdAt)) / 86_400_000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  return `${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일`;
}

function formatDateTime(createdAt: Date) {
  const hours = createdAt.getHours();
  const period = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(createdAt.getMinutes()).padStart(2, "0");
  return `${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일 ${period} ${hour12}:${minutes}`;
}

// ---------- 메모 ----------

function blockText(block: MemoBlock) {
  const plain = (text: string) => text.replaceAll("**", "");
  if (block.type === "list") return plain(block.items.join(", "));
  return plain(block.text);
}

/** 목록에 보이는 미리보기: 제목 줄이 아닌 첫 본문, 없으면 첫 줄 */
function makePreview(body: MemoBlock[]) {
  const first = body.find((block) => block.type === "paragraph" || block.type === "list") ?? body[0];
  return first ? blockText(first) : "";
}

function toMemo(stored: StoredMemo): Memo {
  const createdAt = new Date(stored.createdAt);
  return {
    id: stored.id,
    title: stored.title,
    preview: makePreview(stored.body),
    date: formatListDate(createdAt),
    dateTime: formatDateTime(createdAt),
    category: stored.category,
    color: stored.color,
    pinned: false,
    body: stored.body,
  };
}

function isStoredMemo(value: unknown): value is StoredMemo {
  if (typeof value !== "object" || value === null) return false;
  const memo = value as Record<string, unknown>;
  return (
    typeof memo.id === "string" &&
    typeof memo.title === "string" &&
    typeof memo.category === "string" &&
    typeof memo.color === "string" &&
    Array.isArray(memo.body) &&
    typeof memo.createdAt === "string"
  );
}

function readStored(): StoredMemo[] {
  const raw = readStorage(MEMOS_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isStoredMemo) : [];
  } catch {
    return [];
  }
}

export function saveMemo(input: Omit<StoredMemo, "id" | "createdAt">): string {
  const id = `local-${Date.now().toString(36)}`;
  const stored: StoredMemo = { ...input, id, createdAt: new Date().toISOString() };
  writeStorage(MEMOS_KEY, JSON.stringify([stored, ...readStored()]));
  emitChange();
  return id;
}

// useSyncExternalStore 는 같은 값이면 같은 참조를 돌려줘야 해서, 저장된 글자가 같으면 결과를 재사용한다.
let cachedRaw: string | null | undefined;
let cachedMemos: Memo[] = [];
const NO_MEMOS: Memo[] = [];

function getMemosSnapshot() {
  const raw = readStorage(MEMOS_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedMemos = readStored().map(toMemo);
  }
  return cachedMemos;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** 이 브라우저에 저장한 메모 (서버 렌더링 때는 빈 목록) */
export function useSavedMemos(): Memo[] {
  return useSyncExternalStore(subscribe, getMemosSnapshot, () => NO_MEMOS);
}

// ---------- 임시 저장 ----------

export function readDraft(): Draft | null {
  const raw = readStorage(DRAFT_KEY);
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as Partial<Draft>;
    if (typeof draft.title !== "string" || typeof draft.html !== "string") return null;
    return {
      title: draft.title,
      html: draft.html,
      category: draft.category ?? "개인",
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
