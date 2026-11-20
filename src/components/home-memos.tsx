"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chip } from "@/components/chip";
import { ColorPicker } from "@/components/color-picker";
import { MemoLists } from "@/components/memo-lists";
import { addCategory, CategoryError, deleteCategory } from "@/lib/memo-data";
import type { Category, Memo, MemoColor } from "@/lib/memos";

const ALL = "all";
const NONE = "none"; // "분류 없음" 필터

// 분류 칩을 누르면 두 카드가 그 분류의 메모만 보여준다. 편집을 누르면 분류를 지우거나 새로 만들 수 있다.
export function HomeMemos({ memos, categories }: { memos: Memo[]; categories: Category[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(ALL);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState<MemoColor>("blue");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const hasUncategorized = memos.some((memo) => memo.category === null);
  const current =
    selected === ALL || (selected === NONE && hasUncategorized) || categories.some((item) => item.name === selected)
      ? selected
      : ALL; // 고르고 있던 분류가 사라졌으면 전체로 돌아간다
  const shown =
    current === ALL
      ? memos
      : memos.filter((memo) => (current === NONE ? memo.category === null : memo.category === current));

  async function add() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await addCategory(name, color);
      setName("");
      router.refresh();
    } catch (e) {
      setError(e instanceof CategoryError ? e.message : "저장하지 못했어요. 잠시 뒤 다시 눌러 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(category: Category) {
    if (busy) return;
    const count = memos.filter((memo) => memo.category === category.name).length;
    const message =
      count > 0
        ? `'${category.name}' 분류를 지울까요? 글 ${count}개는 지워지지 않고 '분류 없음'으로 옮겨져요.`
        : `'${category.name}' 분류를 지울까요?`;
    if (!window.confirm(message)) return;
    setBusy(true);
    setError("");
    try {
      await deleteCategory(category.id, category.name);
      router.refresh();
    } catch {
      setError("지우지 못했어요. 잠시 뒤 다시 눌러 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex items-start gap-space-8 px-space-12">
        <nav aria-label="글 분류" className="flex flex-1 flex-wrap gap-space-8">
          {!editing && <Chip label="전체" selected={current === ALL} onClick={() => setSelected(ALL)} />}
          {categories.map((item) => (
            <Chip
              key={item.id}
              label={item.name}
              dot={item.color}
              selected={current === item.name}
              removable={editing}
              onClick={() => (editing ? remove(item) : setSelected(item.name))}
            />
          ))}
          {!editing && hasUncategorized && (
            <Chip label="분류 없음" selected={current === NONE} onClick={() => setSelected(NONE)} />
          )}
        </nav>
        <button
          type="button"
          aria-pressed={editing}
          onClick={() => {
            setEditing((value) => !value);
            setError("");
          }}
          className="flex h-9 shrink-0 items-center text-caption-md text-text-muted"
        >
          {editing ? "완료" : "편집"}
        </button>
      </div>

      {editing && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void add();
          }}
          className="flex flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-16"
        >
          <label className="flex flex-col gap-space-4">
            <span className="text-caption-sm text-text-muted">새 분류 이름</span>
            <input
              value={name}
              maxLength={10}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              placeholder="예: 공부"
              className="bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>
          <ColorPicker value={color} onChange={setColor} />
          <button
            type="submit"
            disabled={busy}
            className="flex h-9 items-center justify-center rounded-full bg-primary px-space-16 text-label-md text-text-on-primary"
          >
            분류 추가
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="px-space-12 text-caption-sm text-label-pink">
          {error}
        </p>
      )}

      <MemoLists memos={shown} />
    </>
  );
}
