"use client";

import { useEffect, useState, type RefObject } from "react";

type Format = { bold: boolean; heading: boolean; subheading: boolean; list: boolean };
const NO_FORMAT: Format = { bold: false, heading: false, subheading: false, list: false };

// Figma `Button/Format` (State=Default / Active)
function FormatButton({
  label,
  active,
  ariaLabel,
  onClick,
}: {
  label: string;
  active: boolean;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      // 눌러도 글 쓰던 자리(선택)가 풀리지 않게 한다
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`flex h-9 items-center justify-center rounded-sm px-space-12 text-label-md ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}

function currentFormat(editor: HTMLElement): Format {
  const selection = window.getSelection();
  const anchor = selection?.anchorNode;
  if (!selection || !anchor || !editor.contains(anchor)) return NO_FORMAT;
  const element = anchor instanceof Element ? anchor : anchor.parentElement;
  return {
    bold: document.queryCommandState("bold"),
    heading: !!element?.closest("h1, h2"),
    subheading: !!element?.closest("h3"),
    list: !!element?.closest("li"),
  };
}

// Figma `Editor` — 서식 막대(Editor/Toolbar) + 본문. 서식은 굵게·제목·소제목·목록.
export function MemoEditor({
  editorRef,
  onChange,
}: {
  editorRef: RefObject<HTMLDivElement | null>;
  onChange: () => void;
}) {
  const [format, setFormat] = useState<Format>(NO_FORMAT);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    // 엔터를 치면 <div> 대신 <p> 가 생기게 한다
    document.execCommand("defaultParagraphSeparator", false, "p");

    const onSelectionChange = () => setFormat(currentFormat(editor));
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [editorRef]);

  function refresh() {
    const editor = editorRef.current;
    if (!editor) return;
    setEmpty(!editor.textContent?.trim() && !editor.querySelector("li"));
    setFormat(currentFormat(editor));
    onChange();
  }

  function run(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    refresh();
  }

  function toggleBlock(tag: "h2" | "h3", active: boolean) {
    run("formatBlock", active ? "p" : tag);
  }

  return (
    <div className="overflow-hidden rounded-lg border-2 border-transparent bg-surface-card focus-within:border-primary">
      <div role="toolbar" aria-label="서식" className="flex h-13 items-center gap-space-4 px-space-12">
        <FormatButton label="B" ariaLabel="굵게" active={format.bold} onClick={() => run("bold")} />
        <FormatButton
          label="제목"
          ariaLabel="제목"
          active={format.heading}
          onClick={() => toggleBlock("h2", format.heading)}
        />
        <FormatButton
          label="소제목"
          ariaLabel="소제목"
          active={format.subheading}
          onClick={() => toggleBlock("h3", format.subheading)}
        />
        <FormatButton
          label="목록"
          ariaLabel="목록"
          active={format.list}
          onClick={() => run("insertUnorderedList")}
        />
      </div>
      <hr className="h-px border-0 bg-border-default" />
      <div className="relative px-space-20 py-space-16">
        {empty && (
          <p
            aria-hidden="true"
            className="pointer-events-none absolute text-body-md text-text-muted"
          >
            내용을 입력하세요
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="글 내용"
          onInput={refresh}
          onKeyUp={refresh}
          onMouseUp={refresh}
          className="min-h-48 text-body-md text-text-secondary outline-none [&_b]:text-label-md [&_b]:text-text-primary [&_h2]:text-title-lg [&_h2]:text-text-primary [&_h3]:text-title-md [&_h3]:text-text-primary [&_li]:pl-space-4 [&_p]:min-h-7 [&_strong]:text-label-md [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-space-20 [&_ul]:py-space-4"
        />
      </div>
    </div>
  );
}
