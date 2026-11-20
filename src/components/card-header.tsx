import { IconChevronRight, IconPin } from "./icons";

// Figma `Card/Header` (pin, action)
export function CardHeader({
  title,
  pin = false,
  action,
}: {
  title: string;
  pin?: boolean;
  action?: string;
}) {
  return (
    <div className="flex h-10 items-center gap-space-4 pt-space-12 pr-space-16 pb-space-4 pl-space-20">
      {pin && <IconPin size={16} className="shrink-0 text-primary" />}
      <h2 className="flex-1 text-label-md text-text-primary">{title}</h2>
      {action && (
        <button type="button" className="flex items-center gap-space-4 text-caption-md text-text-muted">
          {action}
          <IconChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
