import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowRight, ImagePlus, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_SETTINGS,
  DEMO_BRIEF,
  EXAMPLES,
  createProject,
  type BriefSettings,
  type Duration,
  type Format,
  type Platform,
  type Quality,
  type ReferenceImage,
} from "@/lib/workflow";
import { setProject } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Creative Director — turn a brief into the right AI workflow" },
      {
        name: "description",
        content:
          "Describe your creative project and get a shot-by-shot plan, recommended image and video models, and ready-to-use prompts.",
      },
      { property: "og:title", content: "Creative Director — brief to AI workflow" },
      {
        property: "og:description",
        content:
          "Describe your creative project and get a shot-by-shot plan, model recommendations and prompts.",
      },
    ],
  }),
  component: Home,
});

const STAGES = [
  "Reading your brief...",
  "Breaking the idea into shots...",
  "Matching creative tasks to models...",
  "Building your workflow...",
];

const PLATFORMS: Platform[] = ["Instagram", "YouTube", "TikTok", "Web"];
const FORMATS: Format[] = ["9:16", "16:9", "1:1"];
const DURATIONS: Duration[] = ["15 sec", "30 sec", "60 sec"];
const QUALITIES: Quality[] = ["Fast", "Balanced", "Best"];

function OptionRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-16 shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
              value === o
                ? "border-primary bg-primary-soft text-accent-foreground"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

const FLOW = ["Brief", "Creative plan", "Workflow", "Model picks", "Prompts"];

function Home() {
  const navigate = useNavigate();
  const [brief, setBrief] = useState(DEMO_BRIEF);
  const [settings, setSettings] = useState<BriefSettings>(DEFAULT_SETTINGS);
  const [refs, setRefs] = useState<ReferenceImage[]>([]);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState(-1);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof BriefSettings>(k: K, v: BriefSettings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  function addFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 8)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () =>
          setRefs((r) => [
            ...r,
            {
              id: Math.random().toString(36).slice(2, 10),
              name: file.name,
              dataUrl: String(reader.result),
            },
          ]);
        reader.readAsDataURL(file);
      });
  }

  function build() {
    const text = brief.trim();
    if (!text) {
      toast.error("Describe what you're making first.");
      return;
    }
    setStage(0);
    STAGES.forEach((_, i) => {
      if (i === 0) return;
      setTimeout(() => setStage(i), i * 700);
    });
    setTimeout(() => {
      setProject(createProject(text, settings, refs));
      toast.success("Workflow created");
      navigate({ to: "/workflow" });
    }, STAGES.length * 700 + 350);
  }

  return (
    <div className="mx-auto max-w-4xl">
      {stage >= 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/92 backdrop-blur-sm">
          <div className="w-full max-w-sm px-6">
            <div className="mb-8 flex items-center gap-3">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span className="eyebrow">Creative Director</span>
            </div>
            <ul className="space-y-4">
              {STAGES.map((s, i) => (
                <li
                  key={s}
                  className={cn(
                    "flex items-center gap-3 text-sm transition-all duration-500",
                    i <= stage ? "text-foreground opacity-100" : "text-muted-foreground opacity-40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border transition-colors",
                      i < stage
                        ? "border-primary bg-primary text-primary-foreground"
                        : i === stage
                          ? "border-primary"
                          : "border-border",
                    )}
                  >
                    {i < stage ? <Check className="size-3" strokeWidth={3} /> : null}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <section className="animate-fade-up pt-6 text-center sm:pt-14">
        <p className="eyebrow">Creative Director</p>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] sm:text-[3.4rem]">
          Turn a creative brief
          <br />
          into the right AI workflow.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Describe what you're trying to make. Creative Director breaks it into shots, recommends the
          right models, and gives you the prompts to build it.
        </p>
        <ol className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
          {FLOW.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {s}
              </span>
              {i < FLOW.length - 1 && <ArrowRight className="size-3 text-border-strong" strokeWidth={2.5} />}
            </li>
          ))}
        </ol>
      </section>

      <section className="card-surface mt-12 p-5 sm:p-7">
        <label htmlFor="brief" className="eyebrow">
          What are you making?
        </label>
        <Textarea
          id="brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={6}
          placeholder={
            "Describe your creative project...\n\ne.g. A 20-second cinematic Instagram ad for a luxury watch. I have three product photos and want a person wearing it, dramatic lighting, smooth camera movement and a premium ending."
          }
          className="mt-3 resize-none rounded-xl border-border bg-background/60 p-4 text-[15px] leading-relaxed shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary/40"
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "mt-5 rounded-xl border border-dashed p-4 transition-colors",
            dragging ? "border-primary bg-primary-soft" : "border-border",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Add references</p>
              <p className="text-xs text-muted-foreground">Drop images here or browse</p>
            </div>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-all hover:bg-secondary active:scale-[0.98]"
            >
              <ImagePlus className="size-4" strokeWidth={1.8} />
              Browse
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {refs.length === 0 ? (
            <p className="mt-4 text-xs text-muted-foreground">No references added yet.</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {refs.map((r) => (
                <div key={r.id} className="group relative size-16 overflow-hidden rounded-lg border border-border">
                  <img src={r.dataUrl} alt={r.name} className="size-full object-cover" />
                  <button
                    type="button"
                    aria-label={`Remove ${r.name}`}
                    onClick={() => setRefs((list) => list.filter((x) => x.id !== r.id))}
                    className="absolute right-1 top-1 hidden rounded-md bg-foreground/80 p-0.5 text-background group-hover:block"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3 border-t border-border pt-6">
          <OptionRow label="Platform" options={PLATFORMS} value={settings.platform} onChange={(v) => set("platform", v)} />
          <OptionRow label="Format" options={FORMATS} value={settings.format} onChange={(v) => set("format", v)} />
          <OptionRow label="Duration" options={DURATIONS} value={settings.duration} onChange={(v) => set("duration", v)} />
          <OptionRow label="Quality" options={QUALITIES} value={settings.quality} onChange={(v) => set("quality", v)} />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={build}
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:opacity-92 active:scale-[0.98]"
          >
            Build my workflow
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </button>
          <span className="text-xs text-muted-foreground">No generation yet. Just planning.</span>
        </div>
      </section>

      <section className="mt-10">
        <p className="eyebrow">Start with an example</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setBrief(ex.text);
                toast("Example loaded into your brief.");
              }}
              className="card-surface group p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <p className="eyebrow group-hover:text-accent-foreground">{ex.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ex.text}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
