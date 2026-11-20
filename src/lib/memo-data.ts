import { getSupabase } from "./supabase";
import type { Category, Member, Memo, MemoBlock, MemoColor } from "./memos";

/** memos 표의 한 줄 */
type MemoRow = {
  id: string;
  title: string;
  body: MemoBlock[];
  category: string | null;
  author: string | null;
  color: MemoColor;
  pinned: boolean;
  created_at: string;
};

const TIME_ZONE = "Asia/Seoul";

function parts(date: Date) {
  const map: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    year: "numeric",
  }).formatToParts(date)) {
    map[part.type] = part.value;
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour) % 24,
    minute: Number(map.minute),
  };
}

function dayNumber(date: Date) {
  const { year, month, day } = parts(date);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

function formatListDate(createdAt: Date, now: Date) {
  const days = dayNumber(now) - dayNumber(createdAt);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  const { month, day } = parts(createdAt);
  return `${month}월 ${day}일`;
}

function formatDateTime(createdAt: Date) {
  const { month, day, hour, minute } = parts(createdAt);
  const period = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${month}월 ${day}일 ${period} ${hour12}:${String(minute).padStart(2, "0")}`;
}

/** 홈 제목 위의 오늘 날짜. 예: 10월 30일 금요일 */
export function formatToday(now: Date) {
  const { month, day } = parts(now);
  const weekday = new Intl.DateTimeFormat("ko-KR", { timeZone: TIME_ZONE, weekday: "long" }).format(now);
  return `${month}월 ${day}일 ${weekday}`;
}

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

function toMemo(row: MemoRow, now: Date): Memo {
  const createdAt = new Date(row.created_at);
  return {
    id: row.id,
    title: row.title,
    preview: makePreview(row.body),
    date: formatListDate(createdAt, now),
    dateTime: formatDateTime(createdAt),
    category: row.category,
    author: row.author,
    color: row.color,
    pinned: row.pinned,
    body: row.body,
  };
}

/** 모든 글, 최신순 */
export async function getMemos(now: Date): Promise<Memo[]> {
  const { data, error } = await getSupabase()
    .from("memos")
    .select("*")
    .order("created_at", { ascending: false })
    .overrideTypes<MemoRow[], { merge: false }>();
  if (error) throw new Error(`글을 불러오지 못했어요: ${error.message}`);
  return data.map((row) => toMemo(row, now));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getMemo(id: string, now: Date): Promise<Memo | null> {
  if (!UUID.test(id)) return null; // uuid 가 아닌 주소는 표에서 찾지 않는다
  const { data, error } = await getSupabase()
    .from("memos")
    .select("*")
    .eq("id", id)
    .maybeSingle<MemoRow>();
  if (error) throw new Error(`글을 불러오지 못했어요: ${error.message}`);
  return data ? toMemo(data, now) : null;
}

export async function updateMemo(
  id: string,
  input: { title: string; category: string | null; author: string | null; color: MemoColor; body: MemoBlock[] },
): Promise<void> {
  const { error } = await getSupabase().from("memos").update(input).eq("id", id);
  if (error) throw new Error(`글을 수정하지 못했어요: ${error.message}`);
}

export async function setMemoPinned(id: string, pinned: boolean): Promise<void> {
  const { error } = await getSupabase().from("memos").update({ pinned }).eq("id", id);
  if (error) throw new Error(`글을 고정하지 못했어요: ${error.message}`);
}

/** 필터 목록, 만든 순서대로 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await getSupabase()
    .from("categories")
    .select("id, name, color")
    .order("created_at", { ascending: true })
    .overrideTypes<Category[], { merge: false }>();
  if (error) throw new Error(`분류를 불러오지 못했어요: ${error.message}`);
  return data;
}

export class CategoryError extends Error {}

export async function addCategory(name: string, color: MemoColor): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) throw new CategoryError("이름을 입력해 주세요.");
  const { error } = await getSupabase().from("categories").insert({ name: trimmed, color });
  if (error) {
    if (error.code === "23505") throw new CategoryError("이미 있는 이름이에요.");
    throw new Error(`분류를 만들지 못했어요: ${error.message}`);
  }
}

/** 필터를 지운다. 그 분류의 메모는 지우지 않고 "분류 없음"으로 돌린다. */
export async function deleteCategory(id: string, name: string): Promise<void> {
  const supabase = getSupabase();
  const moved = await supabase.from("memos").update({ category: null }).eq("category", name);
  if (moved.error) throw new Error(`글을 옮기지 못했어요: ${moved.error.message}`);
  const removed = await supabase.from("categories").delete().eq("id", id);
  if (removed.error) throw new Error(`분류를 지우지 못했어요: ${removed.error.message}`);
}

/** 가족 이름 목록, 등록한 순서대로 */
export async function getMembers(): Promise<Member[]> {
  const { data, error } = await getSupabase()
    .from("members")
    .select("id, name")
    .order("created_at", { ascending: true })
    .overrideTypes<Member[], { merge: false }>();
  if (error) throw new Error(`가족 목록을 불러오지 못했어요: ${error.message}`);
  return data;
}

export async function addMember(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) throw new CategoryError("이름을 입력해 주세요.");
  const { error } = await getSupabase().from("members").insert({ name: trimmed });
  if (error) {
    if (error.code === "23505") throw new CategoryError("이미 있는 이름이에요.");
    throw new Error(`이름을 추가하지 못했어요: ${error.message}`);
  }
}

/** 가족 이름을 지운다. 그 사람이 쓴 글은 지우지 않고 작성자만 비운다. */
export async function deleteMember(id: string, name: string): Promise<void> {
  const supabase = getSupabase();
  const cleared = await supabase.from("memos").update({ author: null }).eq("author", name);
  if (cleared.error) throw new Error(`글의 작성자를 비우지 못했어요: ${cleared.error.message}`);
  const removed = await supabase.from("members").delete().eq("id", id);
  if (removed.error) throw new Error(`이름을 지우지 못했어요: ${removed.error.message}`);
}

export async function insertMemo(input: {
  title: string;
  category: string | null;
  author: string | null;
  color: MemoColor;
  body: MemoBlock[];
}): Promise<string> {
  const { data, error } = await getSupabase().from("memos").insert(input).select("id").single<{ id: string }>();
  if (error) throw new Error(`글을 저장하지 못했어요: ${error.message}`);
  return data.id;
}

/** 글을 지운다. 되돌릴 수 없다. 고정된 글은 지우지 않는다. */
export async function deleteMemo(id: string): Promise<void> {
  const { data, error } = await getSupabase()
    .from("memos")
    .delete()
    .eq("id", id)
    .eq("pinned", false)
    .select("id");
  if (error) throw new Error(`글을 지우지 못했어요: ${error.message}`);
  if (data.length === 0) throw new Error("고정된 글은 지울 수 없어요. 먼저 고정을 풀어 주세요.");
}
