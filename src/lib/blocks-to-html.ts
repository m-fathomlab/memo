import type { MemoBlock } from "./memos";

function escape(text: string) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/** **굵게** 표시를 <b> 로 바꾼다. */
function inline(text: string) {
  return escape(text)
    .split("**")
    .map((part, i) => (i % 2 === 1 ? `<b>${part}</b>` : part))
    .join("");
}

/** 저장된 메모 본문 블록을 편집기에 넣을 HTML 로 바꾼다. */
export function blocksToHtml(blocks: MemoBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2>${escape(block.text)}</h2>`;
        case "subheading":
          return `<h3>${escape(block.text)}</h3>`;
        case "paragraph":
          return `<p>${inline(block.text)}</p>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`;
      }
    })
    .join("");
}
