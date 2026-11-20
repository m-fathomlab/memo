"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Chip } from "@/components/chip";
import { IconLink } from "@/components/icon-button";
import { IconChevronLeft } from "@/components/icons";
import { MemoEditor } from "@/components/memo-editor";
import { PrimaryButton } from "@/components/primary-button";
import { editorToBlocks } from "@/lib/editor-blocks";
import { clearDraft, readDraft, saveMemo, writeDraft } from "@/lib/memo-store";
import type { Memo, MemoColor } from "@/lib/memos";

const categories: Memo["category"][] = ["업무", "개인", "아이디어"];

// Figma `Label/Dot` — 클래스 이름은 통째로 적어야 Tailwind 가 찾는다.
const colors: { value: MemoColor; name: string; dot: string }[] = [
  { value: "blue", name: "파랑", dot: "bg-label-blue" },
  { value: "green", name: "초록", dot: "bg-label-green" },
  { value: "orange", name: "주황", dot: "bg-label-orange" },
  { value: "pink", name: "분홍", dot: "bg-label-pink" },
];

export function WriteMemo() {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const draftTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Memo["category"]>("개인");
  const [color, setColor] = useState<MemoColor>("green");
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState(false);

  // 쓰다 만 글이 있으면 되살린다.
  useEffect(() => {
    const draft = readDraft();
    if (!draft) return;
    /* eslint-disable react-hooks/set-state-in-effect -- 브라우저 저장소는 서버에서 읽을 수 없어 마운트 뒤에 채운다 */
    setTitle(draft.title);
    setCategory(draft.category);
    setColor(draft.color);
    setDraftSaved(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const editor = editorRef.current;
    if (editor) {
      editor.innerHTML = draft.html;
      editor.dispatchEvent(new Event("input", { bubbles: true })); // 안내 문구·서식 막대 갱신
    }
  }, []);

  useEffect(() => () => clearTimeout(draftTimer.current), []);

  function scheduleDraft(next: { title?: string; category?: Memo["category"]; color?: MemoColor } = {}) {
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
        category: next.category ?? category,
        color: next.color ?? color,
        html,
      });
      setDraftSaved(true);
    }, 400);
  }

  function save() {
    const trimmed = title.trim();
    if (!trimmed) {
      setError(true);
      titleRef.current?.focus();
      return;
    }
    const body = editorRef.current ? editorToBlocks(editorRef.current) : [];
    clearTimeout(draftTimer.current);
    saveMemo({ title: trimmed, category, color, body });
    clearDraft();
    router.push("/");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-space-16 pt-space-48">
      <header className="flex items-center justify-between">
        <IconLink label="뒤로가기" href="/">
          <IconChevronLeft />
        </IconLink>
        <p aria-live="polite" className="text-caption-sm text-text-muted">
          {draftSaved ? "자동 저장됨" : ""}
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
          <div role="group" aria-label="분류" className="flex items-center gap-space-8">
            <span className="text-caption-sm text-text-muted">분류</span>
            {categories.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={category === item}
                onClick={() => {
                  setCategory(item);
                  scheduleDraft({ category: item });
                }}
              />
            ))}
          </div>
          <div role="radiogroup" aria-label="색" className="flex items-center gap-space-8">
            <span className="text-caption-sm text-text-muted">색</span>
            {colors.map((item) => (
              <button
                key={item.value}
                type="button"
                role="radio"
                aria-checked={color === item.value}
                aria-label={item.name}
                onClick={() => {
                  setColor(item.value);
                  scheduleDraft({ color: item.value });
                }}
                className={`flex size-8 items-center justify-center rounded-full border-2 ${
                  color === item.value ? "border-primary" : "border-transparent"
                }`}
              >
                <span className={`size-[22px] rounded-full ${item.dot}`} />
              </button>
            ))}
          </div>
        </div>

        <MemoEditor editorRef={editorRef} onChange={() => scheduleDraft()} />
      </main>

      <div className="sticky bottom-0 bg-surface-page pt-space-16 pb-space-34">
        <PrimaryButton label="저장하기" onClick={save} />
      </div>
    </div>
  );
}
