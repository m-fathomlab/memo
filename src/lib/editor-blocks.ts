import type { MemoBlock } from "./memos";

const BLOCK_TAGS = new Set(["P", "DIV", "UL", "OL", "H1", "H2", "H3"]);

function isBlock(node: Node): node is HTMLElement {
  return node instanceof HTMLElement && BLOCK_TAGS.has(node.tagName);
}

/** 안쪽 글자를 **굵게** 표시가 있는 글로 바꾼다. */
function inlineText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (!(node instanceof HTMLElement)) return "";
  if (node.tagName === "BR") return "";
  const inner = Array.from(node.childNodes).map(inlineText).join("");
  const isBold = node.tagName === "B" || node.tagName === "STRONG";
  return isBold && inner.trim() ? `**${inner}**` : inner;
}

function paragraph(nodes: Node[], blocks: MemoBlock[]) {
  const text = nodes.map(inlineText).join("").trim();
  if (text) blocks.push({ type: "paragraph", text });
}

function collect(parent: Node, blocks: MemoBlock[]) {
  let inline: Node[] = []; // 블록 사이에 낀 글자는 한 문단으로 묶는다

  for (const node of Array.from(parent.childNodes)) {
    if (!isBlock(node)) {
      inline.push(node);
      continue;
    }
    paragraph(inline, blocks);
    inline = [];

    const tag = node.tagName;
    if (tag === "UL" || tag === "OL") {
      const items = Array.from(node.children)
        .map((li) => inlineText(li).trim())
        .filter(Boolean);
      if (items.length) blocks.push({ type: "list", items });
    } else if (tag === "H1" || tag === "H2" || tag === "H3") {
      const text = inlineText(node).replaceAll("**", "").trim();
      if (text) blocks.push({ type: tag === "H3" ? "subheading" : "heading", text });
    } else if (Array.from(node.childNodes).some(isBlock)) {
      collect(node, blocks); // <p> 안에 <ul> 이 들어간 것처럼 겹친 경우
    } else {
      paragraph([node], blocks);
    }
  }
  paragraph(inline, blocks);
}

/** 편집기 안의 HTML 을 메모 본문 블록으로 바꾼다. 빈 줄은 건너뛴다. */
export function editorToBlocks(editor: HTMLElement): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  collect(editor, blocks);
  return blocks;
}
