import { cn } from "@/lib/utils";
import type { Level } from "@/lib/models";

const FILL: Record<Level, number> = { low: 3, medium: 6, high: 9 };

export function LevelBar({
  level,
  label,
  filled,
  className,
}: {
  level: Level;
  label?: string;
  filled?: number;
  className?: string;
}) {
  const n = filled ?? FILL[level];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-3 w-[5px] rounded-[2px] transition-colors",
              i < n ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>
      {label ? <span className="text-xs font-medium text-muted-foreground">{label}</span> : null}
    </div>
  );
}
