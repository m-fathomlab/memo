import { Chip } from "@/components/chip";
import { IconPlus } from "@/components/icons";
import { MemoLists } from "@/components/memo-lists";
import { PrimaryButton } from "@/components/primary-button";

const categories = ["전체", "업무", "개인", "아이디어"];
// 아직 전체 개수를 셀 곳이 없어서 시안의 숫자를 그대로 쓴다.
const totalMemoCount = 128;

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-space-16 pt-space-64">
      <main className="flex flex-1 flex-col gap-space-16">
        <header className="flex flex-col gap-space-8 px-space-8">
          <p className="text-caption-md text-text-muted">10월 30일 금요일</p>
          <h1 className="text-heading-xl text-text-primary">
            오늘까지 메모를
            <br />
            <span className="text-primary">{totalMemoCount}개</span> 남겼어요
          </h1>
        </header>

        <nav aria-label="메모 분류" className="flex gap-space-8 px-space-12">
          {categories.map((category) => (
            <Chip key={category} label={category} selected={category === "전체"} />
          ))}
        </nav>

        <MemoLists />
      </main>

      <div className="sticky bottom-0 bg-surface-page pt-space-16 pb-space-34">
        <PrimaryButton label="새 메모 쓰기" icon={<IconPlus size={20} />} href="/memos/new" />
      </div>
    </div>
  );
}
