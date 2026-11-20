import { Badge } from "@/components/badge";
import { IconButton, IconLink } from "@/components/icon-button";
import { IconChevronLeft, IconMore, IconPin, IconShare } from "@/components/icons";
import { PrimaryButton } from "@/components/primary-button";
import type { Memo, MemoBlock } from "@/lib/memos";

// **굵게** 표시를 굵은 글씨로 바꾼다.
function RichText({ text }: { text: string }) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-label-md text-text-primary">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function Block({ block }: { block: MemoBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="text-title-lg text-text-primary">{block.text}</h2>;
    case "subheading":
      return <h3 className="text-title-md text-text-primary">{block.text}</h3>;
    case "paragraph":
      return (
        <p className="text-body-md text-text-secondary">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-space-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-space-8 text-body-md text-text-secondary">
              <span aria-hidden="true">•</span>
              <span className="flex-1">
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}

export function MemoDetailView({ memo }: { memo: Memo }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-space-16 pt-space-48">
      <header className="flex items-center justify-between">
        <IconLink label="뒤로가기" href="/">
          <IconChevronLeft />
        </IconLink>
        <div className="flex">
          <IconButton label="고정">
            <IconPin />
          </IconButton>
          <IconButton label="공유">
            <IconShare />
          </IconButton>
          <IconButton label="더보기">
            <IconMore />
          </IconButton>
        </div>
      </header>

      <main className="mt-space-16 flex-1">
        <article className="flex flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-24">
          <div className="flex items-center gap-space-8">
            <Badge label={memo.category} color={memo.color} />
            <time className="text-caption-sm text-text-muted">{memo.dateTime}</time>
          </div>
          <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
          <hr className="h-px border-0 bg-border-default" />
          <div className="flex flex-col gap-space-12">
            {memo.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </article>
      </main>

      <div className="sticky bottom-0 bg-surface-page pt-space-16 pb-space-34">
        <PrimaryButton label="수정하기" />
      </div>
    </div>
  );
}
