import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDown,
  Copy,
  Image as ImageIcon,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Video,
  Trash2,
  ArrowUp,
  Files,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MODEL_BY_ID, LEVEL_LABEL } from "@/lib/models";
import { LevelBar } from "@/components/ui/level-bar";
import {
  createProject,
  estimateUsage,
  newStep,
  transformPrompt,
  type Quality,
  type WorkflowStep,
} from "@/lib/workflow";
import { setProject, updateProject, saveProject, useStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Your creative workflow — Creative Director" },
      {
        name: "description",
        content:
          "A shot-by-shot AI workflow built from your brief, with recommended models, prompts and usage estimates.",
      },
      { property: "og:title", content: "Your creative workflow — Creative Director" },
      {
        property: "og:description",
        content: "Shot-by-shot plan with model recommendations, prompts and usage estimates.",
      },
    ],
  }),
  component: WorkflowPage,
});

const QUALITY_COPY: Record<Quality, { title: string; a: string; b: string }> = {
  Fast: { title: "Fast", a: "Lower usage", b: "Good for exploration" },
  Balanced: { title: "Balanced", a: "Recommended", b: "Quality + efficiency" },
  Best: { title: "Best", a: "Higher usage", b: "Maximum quality" },
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function WorkflowPage() {
  const { project } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-28 text-center">
        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-border bg-surface">
          <Sparkles className="size-5 text-primary" strokeWidth={1.8} />
        </div>
        <h1 className="text-lg font-semibold">Your workflow will appear here.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Write a brief on the home page and Creative Director will plan the shots for you.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-92 active:scale-[0.98]"
        >
          Write a brief
        </Link>
      </div>
    );
  }

  const usage = estimateUsage(project.steps);
  const active = project.steps.find((s) => s.id === openId) ?? null;

  const mutateStep = (id: string, fn: (s: WorkflowStep) => WorkflowStep) =>
    updateProject((p) => ({ ...p, steps: p.steps.map((s) => (s.id === id ? fn(s) : s)) }));

  const move = (id: string, dir: -1 | 1) =>
    updateProject((p) => {
      const i = p.steps.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.steps.length) return p;
      const steps = [...p.steps];
      const a = steps[i]!;
      const b = steps[j]!;
      steps[i] = b;
      steps[j] = a;
      return { ...p, steps };
    });

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Your creative workflow</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Built from your brief. You can edit every step.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setProject(createProject(project.brief, project.settings, project.references));
              toast.success("Workflow created");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium transition-all hover:bg-secondary active:scale-[0.98]"
          >
            <RefreshCw className="size-4" strokeWidth={1.8} />
            Regenerate plan
          </button>
          <button
            onClick={() => {
              saveProject();
              toast.success("Workflow saved");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-92 active:scale-[0.98]"
          >
            <Save className="size-4" strokeWidth={1.8} />
            Save workflow
          </button>
        </div>
      </header>

      <section className="card-surface mt-7 grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {[
          { k: "Project", v: `${project.name} — ${project.type}` },
          { k: "Goal", v: project.goal },
          { k: "Format", v: `${project.settings.format} · ${project.settings.duration}` },
          { k: "Estimated usage", v: project.settings.quality },
        ].map((item) => (
          <div key={item.k}>
            <p className="eyebrow">{item.k}</p>
            <p className="mt-2 text-sm font-medium leading-relaxed">{item.v}</p>
          </div>
        ))}
      </section>

      <section className="card-surface mt-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-[220px] flex-1">
            <p className="eyebrow">Estimated workflow usage</p>
            <div className="mt-3">
              <LevelBar level={usage.level} filled={usage.filled} label={LEVEL_LABEL[usage.level]} />
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{usage.note}</p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Usage estimates are illustrative for this prototype.
            </p>
          </div>
          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3">
            {(Object.keys(QUALITY_COPY) as Quality[]).map((q) => (
              <button
                key={q}
                onClick={() => {
                  updateProject((p) => ({ ...p, settings: { ...p.settings, quality: q } }));
                  setProject(
                    createProject(project.brief, { ...project.settings, quality: q }, project.references),
                  );
                  toast.success(`Plan tuned for ${q.toLowerCase()} output`);
                }}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all active:scale-[0.98] sm:w-40",
                  project.settings.quality === q
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:border-border-strong",
                )}
              >
                <p className="text-sm font-semibold">{QUALITY_COPY[q].title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{QUALITY_COPY[q].a}</p>
                <p className="text-[11px] text-muted-foreground">{QUALITY_COPY[q].b}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-10">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mx-auto w-fit rounded-full border border-border bg-surface px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Brief
          </div>
          <Connector />

          {project.steps.map((step, i) => {
            const model = MODEL_BY_ID[step.modelId];
            const refs = step.referenceIds.length;
            return (
              <div key={step.id}>
                <article
                  className="card-surface animate-node-in group p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-7 items-center justify-center rounded-lg bg-foreground text-[11px] font-bold text-background">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        {editingId === step.id ? (
                          <Input
                            autoFocus
                            defaultValue={step.name}
                            onBlur={(e) => {
                              mutateStep(step.id, (s) => ({ ...s, name: e.target.value || s.name }));
                              setEditingId(null);
                              toast.success("Step updated");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                            className="h-8 w-56"
                          />
                        ) : (
                          <h3 className="text-[15px] font-semibold">{step.name}</h3>
                        )}
                        <div className="mt-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                          {step.kind === "video" ? (
                            <Video className="size-3.5" strokeWidth={2} />
                          ) : (
                            <ImageIcon className="size-3.5" strokeWidth={2} />
                          )}
                          {step.kind}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label="Step options"
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            updateProject((p) => {
                              const idx = p.steps.findIndex((s) => s.id === step.id);
                              const copy = { ...step, id: Math.random().toString(36).slice(2, 10) };
                              const steps = [...p.steps];
                              steps.splice(idx + 1, 0, copy);
                              return { ...p, steps };
                            });
                            toast.success("Step duplicated");
                          }}
                        >
                          <Files className="size-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingId(step.id)}>
                          <Pencil className="size-4" /> Edit name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => move(step.id, -1)}>
                          <ArrowUp className="size-4" /> Move up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => move(step.id, 1)}>
                          <ArrowDown className="size-4" /> Move down
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            updateProject((p) => ({
                              ...p,
                              steps: p.steps.filter((s) => s.id !== step.id),
                            }));
                            toast.success("Step deleted");
                          }}
                        >
                          <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-3.5">
                    <p className="eyebrow">Recommended model</p>
                    <p className="mt-1.5 text-sm font-semibold">{model?.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.reason}</p>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {step.prompt}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {step.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                    {refs > 0 && (
                      <span className="rounded-full border border-primary/40 bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
                        {refs} reference{refs > 1 ? "s" : ""}
                      </span>
                    )}
                    <button
                      onClick={() => setOpenId(step.id)}
                      className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-all hover:bg-secondary active:scale-[0.98]"
                    >
                      View details
                    </button>
                  </div>
                </article>
                <Connector />
              </div>
            );
          })}

          <button
            onClick={() => {
              updateProject((p) => ({ ...p, steps: [...p.steps, newStep(p.settings)] }));
              toast.success("Step added");
            }}
            className="mx-auto flex items-center gap-2 rounded-xl border border-dashed border-primary/50 bg-primary-soft px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-primary-soft/70 active:scale-[0.98]"
          >
            <Plus className="size-4" strokeWidth={2.2} />
            Add step
          </button>
        </div>
      </div>

      <StepDrawer
        index={project.steps.findIndex((s) => s.id === openId)}
        step={active}
        onClose={() => setOpenId(null)}
        onChange={(fn) => active && mutateStep(active.id, fn)}
      />
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-3">
      <div className="flex flex-col items-center">
        <span className="h-6 w-px bg-border-strong" />
        <ArrowDown className="-mt-1 size-3.5 text-border-strong" strokeWidth={2.5} />
      </div>
    </div>
  );
}

function StepDrawer({
  step,
  index,
  onClose,
  onChange,
}: {
  step: WorkflowStep | null;
  index: number;
  onClose: () => void;
  onChange: (fn: (s: WorkflowStep) => WorkflowStep) => void;
}) {
  const model = step ? MODEL_BY_ID[step.modelId] : null;

  return (
    <Sheet open={!!step} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl">
        {step && model && (
          <div className="p-6">
            <SheetTitle className="text-lg font-semibold">
              {String(index + 1).padStart(2, "0")} — {step.name}
            </SheetTitle>

            <Section title="Objective">
              <p className="text-sm leading-relaxed text-muted-foreground">{step.objective}</p>
            </Section>

            <Section title="Recommended model">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{model.name}</p>
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                  Recommended
                </span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Why this model?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.reason}</p>
            </Section>

            <Section title="Alternatives">
              <div className="space-y-2">
                {step.alternatives.map((alt) => {
                  const m = MODEL_BY_ID[alt.modelId]!;
                  return (
                    <button
                      key={alt.modelId}
                      onClick={() => {
                        onChange((s) => ({
                          ...s,
                          modelId: alt.modelId,
                          reason: alt.reason,
                          usage: m.usage,
                          alternatives: [
                            { modelId: s.modelId, reason: s.reason },
                            ...s.alternatives.filter((a) => a.modelId !== alt.modelId),
                          ].slice(0, 2),
                        }));
                        toast.success("Model selected for this workflow step.");
                      }}
                      className="w-full rounded-xl border border-border p-3 text-left transition-all hover:border-border-strong hover:bg-secondary/50 active:scale-[0.99]"
                    >
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{alt.reason}</p>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Prompt">
              <Textarea
                value={step.prompt}
                onChange={(e) => onChange((s) => ({ ...s, prompt: e.target.value }))}
                rows={6}
                className="resize-none rounded-xl text-sm leading-relaxed"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    void navigator.clipboard?.writeText(step.prompt);
                    toast.success("Prompt copied");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  <Copy className="size-3.5" strokeWidth={2} />
                  Copy prompt
                </button>
                {(
                  [
                    ["Improve prompt", "improve"],
                    ["Make cinematic", "cinematic"],
                    ["Make minimal", "minimal"],
                    ["Make more realistic", "realistic"],
                  ] as const
                ).map(([label, mode]) => (
                  <button
                    key={mode}
                    onClick={() => {
                      onChange((s) => ({ ...s, prompt: transformPrompt(s.prompt, mode) }));
                      toast.success("Prompt updated");
                    }}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition-all hover:bg-secondary active:scale-[0.98]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="References">
              <p className="text-sm text-muted-foreground">
                {step.referencesNeeded > 0
                  ? `${step.referencesNeeded} references recommended`
                  : "No references required for this step."}
              </p>
              {step.referenceIds.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">No references added yet.</p>
              ) : (
                <p className="mt-2 text-xs text-accent-foreground">
                  {step.referenceIds.length} attached from your brief
                </p>
              )}
            </Section>

            <Section title="Usage">
              <div className="flex items-center gap-3">
                <LevelBar level={step.usage} label={`~ ${LEVEL_LABEL[step.usage].toLowerCase()}`} />
              </div>
            </Section>

            <button
              onClick={() => toast.success("Model selected for this workflow step.")}
              className="mt-8 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-92 active:scale-[0.99]"
            >
              Use this model
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 border-t border-border pt-5 first-of-type:border-t-0">
      <p className="eyebrow">{title}</p>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}
