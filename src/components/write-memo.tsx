"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Chip } from "@/components/chip";
import { ColorPicker } from "@/components/color-picker";
import { IconLink } from "@/components/icon-button";
import { IconChevronLeft } from "@/components/icons";
import { MemberPicker } from "@/components/member-picker";
import { MemoEditor } from "@/components/memo-editor";
import { PrimaryButton } from "@/components/primary-button";
import { editorToBlocks } from "@/lib/editor-blocks";
import { blocksToHtml } from "@/lib/blocks-to-html";
import { insertMemo, updateMemo } from "@/lib/memo-data";
import { clearDraft, readDraft, readLastAuthor, writeDraft, writeLastAuthor } from "@/lib/memo-store";
import type { Category, Member, Memo, MemoColor } from "@/lib/memos";

// memo 를 주면 그 글을 수정하는 화면, 없으면 새 글 화면. categories 는 홈의 필터 목록, members 는 가족 이름 목록.
export function WriteMemo({
  memo,
  categories,
  members,
}: {
  memo?: Memo;
  categories: Category[];
  members: Member[];
}) {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const draftTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [title, setTitle] = useState(memo?.title ?? "");
  const [category, setCategory] = useState<string | null>(
    memo ? memo.category : (categories[0]?.name ?? null),
  );
  const [color, setColor] = useState<MemoColor>(memo?.color ?? categories[0]?.color ?? "green");
  const [author, setAuthor] = useState<string | null>(memo?.author ?? null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // 쓰다 만 글이 있으면 되살린다.
  useEffect(() => {
    if (memo) {
      // 수정할 때는 저장된 본문을 편집기에 채운다 (임시 저장은 쓰지 않는다)
      const editor = editorRef.current;
      if (editor) {
        editor.innerHTML = blocksToHtml(memo.body);
        editor.dispatchEvent(new Event("input", { bubbles: true }));
      }
      return;
    }
    /* eslint-disable react-hooks/set-state-in-effect -- 브라우저 저장소는 서버에서 읽을 수 없어 마운트 뒤에 채운다 */
    const last = readLastAuthor(); // 마지막에 고른 글쓴이를 이어서 쓴다
    if (last && members.some((item) => item.name === last)) setAuthor(last);
    const draft = readDraft();
    if (!draft) return;
    setTitle(draft.title);
    // 그 사이 지워진 분류면 "분류 없음"으로 되살린다
    setCategory(categories.some((item) => item.name === draft.category) ? draft.category : null);
    setColor(draft.color);
    setDraftSaved(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const editor = editorRef.current;
    if (editor) {
      editor.innerHTML = draft.html;
      editor.dispatchEvent(new Event("input", { bubbles: true })); // 안내 문구·서식 막대 갱신
    }
  }, [memo, categories, members]);

  useEffect(() => () => clearTimeout(draftTimer.current), []);

  function scheduleDraft(next: { title?: string; category?: string | null; color?: MemoColor } = {}) {
    if (memo) return; // 수정 중에는 임시 저장을 하지 않는다
    clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      const html = editorRef.current?.innerHTML ?? "";
      const text = editorRef.current?.textContent?.trim() ?? "";
      const nextTitle = next.title ?? titleRef.current?.value ?? "";
      if (!nextTitle.trim() && !text) {
        clearDraft();
        setDraftSaved(false);
        return;
      }
      writeDraft({
        title: nextTitle,
        category: next.category === undefined ? category : next.category, // null 은 "분류 없음"
        color: next.color ?? color,
        html,
      });
      setDraftSaved(true);
    }, 400);
  }

  async function save() {
    if (saving) return;
    const trimmed = title.trim();
    if (!trimmed) {
      setError(true);
      titleRef.current?.focus();
      return;
    }
    const body = editorRef.current ? editorToBlocks(editorRef.current) : [];
    clearTimeout(draftTimer.current);
    setSaving(true);
    setSaveError(false);
    try {
      if (memo) await updateMemo(memo.id, { title: trimmed, category, author, color, body });
      else await insertMemo({ title: trimmed, category, author, color, body });
      writeLastAuthor(author);
    } catch {
      setSaving(false);
      setSaveError(true); // 임시 저장은 그대로 남겨 두어 글이 사라지지 않는다
      return;
    }
    if (memo) {
      router.push(`/memos/${memo.id}`);
      router.refresh();
      return;
    }
    clearDraft();
    router.push("/");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-space-16 pt-space-48">
      <header className="flex items-center justify-between">
        <IconLink label="뒤로가기" href={memo ? `/memos/${memo.id}` : "/"}>
          <IconChevronLeft />
        </IconLink>
        <p aria-live="polite" className="text-caption-sm text-text-muted">
          {!memo && draftSaved ? "자동 저장됨" : ""}
        </p>
      </header>

      <main className="mt-space-16 flex flex-1 flex-col gap-space-12">
        {/* Figma `Input/Field` */}
        <label className="flex flex-col gap-space-4 rounded-lg border-2 border-transparent bg-surface-card px-space-20 py-space-16 focus-within:border-primary">
          <span className="text-caption-sm text-text-muted">제목</span>
          <input
            ref={titleRef}
            value={title}
            aria-invalid={error}
            aria-describedby={error ? "title-error" : undefined}
            placeholder="제목을 입력하세요"
            onChange={(event) => {
              setTitle(event.target.value);
              setError(false);
              scheduleDraft({ title: event.target.value });
            }}
            className="bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>
        {error && (
          <p id="title-error" role="alert" className="px-space-8 text-caption-sm text-label-pink">
            제목을 입력해 주세요.
          </p>
        )}

        <div className="flex flex-col gap-space-12 px-space-8 py-space-4">
          <div role="group" aria-label="분류" className="flex flex-wrap items-center gap-space-8">
            <span className="text-caption-sm text-text-muted">분류</span>
            {categories.map((item) => (
              <Chip
                key={item.id}
                label={item.name}
                dot={item.color}
                selected={category === item.name}
                onClick={() => {
                  setCategory(item.name);
                  setColor(item.color); // 분류의 대표 색을 따라가되, 아래에서 바꿀 수 있다
                  scheduleDraft({ category: item.name, color: item.color });
                }}
              />
            ))}
            <Chip
              label="분류 없음"
              selected={category === null}
              onClick={() => {
                setCategory(null);
                scheduleDraft({ category: null });
              }}
            />
          </div>
          <MemberPicker members={members} value={author} onChange={setAuthor} />
          <ColorPicker
            value={color}
            onChange={(next) => {
              setColor(next);
              scheduleDraft({ color: next });
            }}
          />
        </div>

        <MemoEditor editorRef={editorRef} onChange={() => scheduleDraft()} />
      </main>

      <div className="sticky bottom-0 bg-surface-page pt-space-16 pb-space-34">
        {saveError && (
          <p role="alert" className="pb-space-12 text-center text-caption-sm text-label-pink">
            저장하지 못했어요. 잠시 뒤 다시 눌러 주세요.
          </p>
        )}
        <PrimaryButton label={saving ? "저장하는 중" : "저장하기"} onClick={save} />
      </div>
    </div>
  );
}
