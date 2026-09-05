import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Layers } from "lucide-react";
import { toast } from "sonner";
import { useStore, openSaved } from "@/lib/store";
import type { Project } from "@/lib/workflow";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Creative Director" },
      {
        name: "description",
        content: "Saved creative projects, each with its own shot plan, models and prompts.",
      },
      { property: "og:title", content: "Projects — Creative Director" },
      {
        property: "og:description",
        content: "Saved creative projects with their shot plans, models and prompts.",
      },
    ],
  }),
  component: ProjectsPage,
});

const DEMO = [
  { name: "Luxury Watch Campaign", type: "Instagram Ad", steps: 4, usage: "Balanced", edited: "2 days ago" },
  { name: "Streetwear Launch", type: "TikTok Campaign", steps: 5, usage: "Fast", edited: "5 days ago" },
  { name: "Automotive Film", type: "Brand Film", steps: 6, usage: "Best", edited: "2 weeks ago" },
];

function timeAgo(ts: number) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

function Thumb({ seed }: { seed: number }) {
  return (
    <div className="mb-4 flex h-28 items-end justify-start overflow-hidden rounded-xl border border-border bg-secondary/60 p-3">
      <div className="flex w-full gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="flex-1 rounded-md bg-foreground/10"
            style={{ height: 16 + ((seed * (i + 3)) % 5) * 12 }}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectsPage() {
  const { project, saved } = useStore();
  const navigate = useNavigate();

  const open = (p: Project) => {
    openSaved(p.id);
    toast.success("Project opened");
    navigate({ to: "/workflow" });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Projects</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Every saved brief, plan and prompt set in one place.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-92 active:scale-[0.98]"
        >
          <Plus className="size-4" strokeWidth={2.2} />
          Create new project
        </Link>
      </header>

      {saved.length > 0 && (
        <section className="mt-8">
          <p className="eyebrow">Your projects</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p, i) => (
              <button
                key={p.id}
                onClick={() => open(p)}
                className="card-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <Thumb seed={i + 2} />
                <h2 className="text-[15px] font-semibold">{p.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.type}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {p.steps.length} steps · {p.settings.quality}
                  </span>
                  <span>{timeAgo(p.updatedAt)}</span>
                </div>
                <span className="mt-4 block w-full rounded-lg border border-border py-2 text-center text-xs font-medium">
                  Open
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {saved.length === 0 && !project && (
        <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-border bg-surface">
            <Layers className="size-5 text-primary" strokeWidth={1.8} />
          </div>
          <p className="text-sm text-muted-foreground">Your creative projects will appear here.</p>
        </div>
      )}

      <section className="mt-10">
        <p className="eyebrow">Example projects</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO.map((p, i) => (
            <article
              key={p.name}
              className="card-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Thumb seed={i + 1} />
              <h2 className="text-[15px] font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.type}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {p.steps} steps · {p.usage}
                </span>
                <span>{p.edited}</span>
              </div>
              <button
                onClick={() => toast("Example project — start a brief to build your own.")}
                className="mt-4 w-full rounded-lg border border-border py-2 text-xs font-medium transition-all hover:bg-secondary active:scale-[0.98]"
              >
                Open
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
