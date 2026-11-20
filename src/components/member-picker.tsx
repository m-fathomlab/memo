"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chip } from "@/components/chip";
import { addMember, CategoryError, deleteMember } from "@/lib/memo-data";
import type { Member } from "@/lib/memos";

// 글쓴이를 가족 이름 칩에서 고른다. "편집"에서 이름을 더하거나 지운다.
export function MemberPicker({
  members,
  value,
  onChange,
}: {
  members: Member[];
  value: string | null;
  onChange: (name: string | null) => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await addMember(name);
      onChange(name.trim()); // 방금 더한 이름을 바로 글쓴이로 고른다
      setName("");
      router.refresh();
    } catch (e) {
      setError(e instanceof CategoryError ? e.message : "저장하지 못했어요. 잠시 뒤 다시 눌러 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(member: Member) {
    if (busy) return;
    if (!window.confirm(`'${member.name}' 이름을 지울까요? 쓴 글은 지워지지 않고 글쓴이만 비워져요.`)) return;
    setBusy(true);
    setError("");
    try {
      await deleteMember(member.id, member.name);
      if (value === member.name) onChange(null);
      router.refresh();
    } catch {
      setError("지우지 못했어요. 잠시 뒤 다시 눌러 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-space-8">
      <div role="group" aria-label="글쓴이" className="flex flex-wrap items-center gap-space-8">
        <span className="text-caption-sm text-text-muted">글쓴이</span>
        {members.map((member) => (
          <Chip
            key={member.id}
            label={member.name}
            selected={value === member.name}
            removable={editing}
            onClick={() => (editing ? remove(member) : onChange(member.name))}
          />
        ))}
        {!editing && <Chip label="글쓴이 없음" selected={value === null} onClick={() => onChange(null)} />}
        <button
          type="button"
          aria-pressed={editing}
          onClick={() => {
            setEditing((current) => !current);
            setError("");
          }}
          className="flex h-9 items-center text-caption-md text-text-muted"
        >
          {editing ? "완료" : "이름 편집"}
        </button>
      </div>

      {editing && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void add();
          }}
          className="flex items-center gap-space-8"
        >
          <input
            value={name}
            maxLength={10}
            aria-label="새 이름"
            placeholder="예: 엄마"
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            className="h-9 min-w-0 flex-1 rounded-full bg-surface-card px-space-16 text-body-sm text-text-primary outline-none placeholder:text-text-muted"
          />
          <button
            type="submit"
            disabled={busy}
            className="flex h-9 shrink-0 items-center rounded-full bg-primary px-space-16 text-label-md text-text-on-primary"
          >
            추가
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="text-caption-sm text-label-pink">
          {error}
        </p>
      )}
    </div>
  );
}
