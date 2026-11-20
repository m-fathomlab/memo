import { getSupabase } from "./supabase";
import type { Memo, MemoBlock, MemoColor } from "./memos";

/** memos 표의 한 줄 */
type MemoRow = {
  id: string;
  title: string;
  body: MemoBlock[];
  category: Memo["category"];
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
    color: row.color,
    pinned: row.pinned,
    body: row.body,
  };
}

/** 모든 메모, 최신순 */
export async function getMemos(now: Date): Promise<Memo[]> {
  const { data, error } = await getSupabase()
    .from("memos")
    .select("*")
    .order("created_at", { ascending: false })
    .overrideTypes<MemoRow[], { merge: false }>();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
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
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  return data ? toMemo(data, now) : null;
}

export async function insertMemo(input: {
  title: string;
  category: Memo["category"];
  color: MemoColor;
  body: MemoBlock[];
}): Promise<string> {
  const { data, error } = await getSupabase().from("memos").insert(input).select("id").single<{ id: string }>();
  if (error) throw new Error(`메모를 저장하지 못했어요: ${error.message}`);
  return data.id;
}
