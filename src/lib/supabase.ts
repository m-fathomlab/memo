import { createClient } from "@supabase/supabase-js";

// 로그인 없이 공개 키만 쓴다. 서버와 브라우저 어디서든 같은 클라이언트를 만든다.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(".env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 를 넣어 주세요.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
