import Link from "next/link";
import type { ReactNode } from "react";

const className =
  "flex h-14 w-full items-center justify-center gap-space-8 rounded-md bg-primary px-space-24 text-button-md text-text-on-primary";

// Figma `Button/Primary` — 화면마다 하나, 아래쪽에 가로로 꽉 차게 둔다.
// href 를 주면 링크로, 아니면 버튼으로 만든다.
export function PrimaryButton({
  label,
  icon,
  href,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      {label}
    </button>
  );
}
