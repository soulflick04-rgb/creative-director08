import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Image as ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MODELS,
  MODEL_FILTERS,
  LEVEL_LABEL,
  matchesFilter,
  type CreativeModel,
  type ModelFilter,
} from "@/lib/models";
import { LevelBar } from "@/components/ui/level-bar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "Models — Creative Director" },
      {
        name: "description",
        content:
          "Browse image and video models by creative outcome: references, character consistency, audio, speed and detail.",
      },
      { property: "og:title", content: "Models — Creative Director" },
      {
        property: "og:description",
        content: "Choose image and video models by creative outcome, not just model name.",
      },
    ],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  const { project } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ModelFilter>("All");
  const [active, setActive] = useState<CreativeModel | null>(null);

  const inWorkflow = useMemo(
    () => new Set(project?.steps.map((s) => s.modelId) ?? []),
    [project],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODELS.filter((m) => matchesFilter(m, filter)).filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.bestFor.join(" ").toLowerCase().includes(q) ||
        m.tags.join(" ").toLowerCase().includes(q),
    );
  }, [query, filter]);

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">Models</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose by creative outcome, not just model name.
        </p>
      </header>

      <div className="mt-7 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models..."
            className="h-11 rounded-xl border-border bg-surface pl-10 shadow-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MODEL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                filter === f
                  ? "border-primary bg-primary-soft text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-24 text-center text-sm text-muted-foreground">
          No models match that search.
        </p>
      ) : (
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m)}
              className="card-surface flex flex-col p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[15px] font-semibold">{m.name}</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {m.kind === "video" ? (
                    <Video className="size-3" strokeWidth={2} />
                  ) : (
                    <ImageIcon className="size-3" strokeWidth={2} />
                  )}
                  {m.kind}
                </span>
              </div>

              {inWorkflow.has(m.id) && (
                <span className="mt-2 w-fit rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                  Recommended for your workflow
                </span>
              )}

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.description}</p>

              <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Best for
              </p>
              <p className="mt-1 text-sm">{m.bestFor.join(" · ")}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {m.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Speed</span>
                  <LevelBar level={m.speed} label={LEVEL_LABEL[m.speed]} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Quality</span>
                  <LevelBar level={m.quality} label={LEVEL_LABEL[m.quality]} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="mt-10 text-[11px] leading-relaxed text-muted-foreground">
        Prototype data: model descriptions are illustrative summaries for this demo, not official
        model documentation.
      </p>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto p-6 sm:max-w-md">
          {active && (
            <>
              <SheetTitle className="text-lg font-semibold">{active.name}</SheetTitle>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {active.kind} model
              </p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {active.description}
              </p>

              <p className="eyebrow mt-7">Best for</p>
              <ul className="mt-2 space-y-1.5">
                {active.bestFor.map((b) => (
                  <li key={b} className="flex gap-2 text-sm">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>

              <p className="eyebrow mt-7">Tags</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {active.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-7 space-y-3 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Speed</span>
                  <LevelBar level={active.speed} label={LEVEL_LABEL[active.speed]} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Quality</span>
                  <LevelBar level={active.quality} label={LEVEL_LABEL[active.quality]} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Relative usage</span>
                  <LevelBar level={active.usage} label={LEVEL_LABEL[active.usage]} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
