import Link from "next/link";
import type { ReactNode } from "react";

const className =
  "flex size-10 items-center justify-center rounded-sm text-text-primary";

// Figma `Button/Icon` — 40×40 누르는 영역 가운데에 아이콘을 둔다.
export function IconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} className={className}>
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
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}
