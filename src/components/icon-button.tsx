import Link from "next/link";
import type { ReactNode } from "react";

const className = "flex size-10 items-center justify-center rounded-sm";

// Figma `Button/Icon` — 40×40 누르는 영역 가운데에 아이콘을 둔다.
// active 이면 아이콘이 primary 색이 된다(예: 고정된 핀).
export function IconButton({
  label,
  children,
  onClick,
  pressed,
  active = false,
  disabled = false,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  pressed?: boolean;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      onClick={onClick}
      className={`${className} ${disabled ? "text-text-muted" : active ? "text-primary" : "text-text-primary"}`}
    >
      {children}
    </button>
  );
}

export function IconLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} className={`${className} text-text-primary`}>
      {children}
    </Link>
  );
}
