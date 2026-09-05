import { MODEL_BY_ID, type Level } from "./models";

export type Quality = "Fast" | "Balanced" | "Best";
export type Platform = "Instagram" | "YouTube" | "TikTok" | "Web";
export type Format = "9:16" | "16:9" | "1:1";
export type Duration = "15 sec" | "30 sec" | "60 sec";

export interface BriefSettings {
  platform: Platform;
  format: Format;
  duration: Duration;
  quality: Quality;
}

export interface ReferenceImage {
  id: string;
  name: string;
  dataUrl: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  kind: "image" | "video";
  objective: string;
  modelId: string;
  reason: string;
  alternatives: { modelId: string; reason: string }[];
  prompt: string;
  referencesNeeded: number;
  referenceIds: string[];
  usage: Level;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  type: string;
  goal: string;
  brief: string;
  settings: BriefSettings;
  steps: WorkflowStep[];
  references: ReferenceImage[];
  updatedAt: number;
}

export const DEFAULT_SETTINGS: BriefSettings = {
  platform: "Instagram",
  format: "9:16",
  duration: "30 sec",
  quality: "Balanced",
};

const uid = () => Math.random().toString(36).slice(2, 10);

type Archetype = "product" | "character" | "cinematic" | "generic";

const KEYWORDS: Record<Exclude<Archetype, "generic">, string[]> = {
  product: ["watch", "product", "shoe", "sneaker", "phone", "bottle", "car", "fashion", "packaging", "launch", "jewel"],
  character: ["person", "actor", "human", "talking", "presenter", "model", "character", "face", "portrait", "creator"],
  cinematic: ["cinematic", "film", "scene", "story", "trailer", "narrative", "moody", "documentary"],
};

const SOCIAL = ["social", "instagram", "tiktok", "reel", "shorts", "vertical"];

export function detectArchetype(brief: string): Archetype {
  const t = brief.toLowerCase();
  const score = (list: string[]) => list.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0);
  const scores: [Archetype, number][] = [
    ["product", score(KEYWORDS.product)],
    ["character", score(KEYWORDS.character)],
    ["cinematic", score(KEYWORDS.cinematic)],
  ];
  scores.sort((a, b) => b[1] - a[1]);
  const top = scores[0]!;
  return top[1] > 0 ? top[0] : "generic";
}

function subjectFrom(brief: string): string {
  const t = brief.toLowerCase();
  const nouns = [
    "electric motorcycle",
    "motorcycle",
    "watch",
    "sneaker",
    "shoe",
    "phone",
    "bottle",
    "car",
    "jacket",
    "perfume",
    "camera",
    "laptop",
    "headphones",
    "handbag",
    "skincare",
  ];
  const found = nouns.find((n) => t.includes(n));
  return found ?? "the hero subject";
}

function projectNameFrom(brief: string, archetype: Archetype): string {
  const subject = subjectFrom(brief);
  if (subject !== "the hero subject") {
    const cap = subject.charAt(0).toUpperCase() + subject.slice(1);
    return `${cap} Campaign`;
  }
  return archetype === "character"
    ? "Character Campaign"
    : archetype === "cinematic"
      ? "Cinematic Film"
      : archetype === "product"
        ? "Product Campaign"
        : "New Creative Project";
}

function pickImageModel(q: Quality, need: "reference" | "character" | "detail" | "concept"): string {
  if (q === "Fast") return need === "concept" ? "gpt-image-1-mini" : "nano-banana-2";
  if (q === "Best") {
    if (need === "character") return "nano-banana-pro";
    if (need === "detail") return "flux-2-max";
    return "seedream-5-pro";
  }
  if (need === "character") return "nano-banana-pro";
  if (need === "detail") return "flux-2-pro";
  if (need === "concept") return "seedream-4-5";
  return "seedream-5-pro";
}

function pickVideoModel(q: Quality, need: "cinematic" | "reference" | "audio" | "draft"): string {
  if (q === "Fast") return need === "audio" ? "kling-3-0-turbo" : "ltx-2-3-fast";
  if (q === "Best") {
    if (need === "audio") return "veo-3-1";
    if (need === "reference") return "kling-3-0";
    return "seedance-2-5";
  }
  if (need === "audio") return "grok-imagine-1-5";
  if (need === "reference") return "seedance-2-0";
  if (need === "draft") return "hailuo-2-3";
  return "seedance-2-5";
}

const REASONS: Record<string, string> = {
  "seedream-5-pro": "Best fit for multiple references and product consistency.",
  "nano-banana-pro": "Keeps the same character and studio quality across every frame.",
  "flux-2-max": "Maximum detail and the tightest match to your references.",
  "flux-2-pro": "High-detail rendering for a finished hero frame.",
  "nano-banana-2": "Fast high-fidelity frames while you are still exploring.",
  "gpt-image-1-mini": "Cheapest way to batch concept directions quickly.",
  "seedream-4-5": "High-volume 4K output when you need many variants.",
  "gpt-image-2": "Exact prompt control and clean in-image text.",
  "recraft-4-1": "Expressive art direction with a photoreal finish.",
  "flux-2-klein-4b": "Rapid exploration pass at minimal usage.",
  "seedance-2-5": "Strongest choice for longer cinematic motion.",
  "seedance-2-0": "Composes motion directly from your reference frames, with sound.",
  "veo-3-1": "Native synced audio for the finishing beat.",
  "veo-3-1-fast": "Faster Veo pass when timing matters more than polish.",
  "veo-3-1-lite": "Lightweight video pass for quick checks.",
  "kling-3-0": "Strongest frame and element control for reference-locked shots.",
  "kling-3-0-turbo": "Fast cinematic clips with audio attached.",
  "grok-imagine-1-5": "Cinematic clip with synchronized audio in one pass.",
  "minimax-hailuo": "Keyframe and reference driven motion.",
  "hailuo-2-3": "High-dynamic motion straight from a single image.",
  "hunyuan": "Native audio with lip sync for talking shots.",
  "wan-2-7": "Reference-composed video at a moderate cost.",
  "ltx-2-3-fast": "Rapid motion drafts before committing usage.",
  "seedance-2-mini": "Lightweight motion draft to test timing.",
};

export function reasonFor(modelId: string): string {
  return REASONS[modelId] ?? MODEL_BY_ID[modelId]?.description ?? "Good general fit for this step.";
}

function altsFor(kind: "image" | "video", exclude: string): { modelId: string; reason: string }[] {
  const pool =
    kind === "image"
      ? ["gpt-image-2", "flux-2-max", "seedream-5-pro", "nano-banana-pro", "recraft-4-1"]
      : ["kling-3-0", "veo-3-1", "seedance-2-5", "minimax-hailuo", "grok-imagine-1-5"];
  return pool
    .filter((id) => id !== exclude)
    .slice(0, 2)
    .map((id) => ({ modelId: id, reason: reasonFor(id) }));
}

interface StepSpec {
  name: string;
  kind: "image" | "video";
  objective: string;
  modelId: string;
  refs: number;
  tags: string[];
  subject: string;
  environment: string;
  camera: string;
  lighting: string;
  composition: string;
  motion?: string;
  direction: string;
}

export function buildPrompt(spec: {
  subject: string;
  environment: string;
  camera: string;
  lighting: string;
  composition: string;
  motion?: string;
  format: Format;
  direction: string;
}): string {
  const parts = [
    spec.subject,
    spec.environment,
    spec.camera,
    spec.lighting,
    spec.composition,
    spec.motion,
    `aspect ratio ${spec.format}`,
    spec.direction,
  ].filter(Boolean);
  return parts.join(", ");
}

function specToStep(spec: StepSpec, settings: BriefSettings): WorkflowStep {
  const model = MODEL_BY_ID[spec.modelId];
  return {
    id: uid(),
    name: spec.name,
    kind: spec.kind,
    objective: spec.objective,
    modelId: spec.modelId,
    reason: reasonFor(spec.modelId),
    alternatives: altsFor(spec.kind, spec.modelId),
    prompt: buildPrompt({ ...spec, format: settings.format }),
    referencesNeeded: spec.refs,
    referenceIds: [],
    usage: model?.usage ?? "medium",
    tags: spec.tags,
  };
}

export function generateWorkflow(
  brief: string,
  settings: BriefSettings,
): { name: string; type: string; goal: string; steps: WorkflowStep[] } {
  const archetype = detectArchetype(brief);
  const t = brief.toLowerCase();
  const isSocial = SOCIAL.some((k) => t.includes(k)) || settings.platform !== "Web";
  const subject = subjectFrom(brief);
  const q = settings.quality;
  const dir = isSocial
    ? "premium editorial art direction, scroll-stopping vertical framing"
    : "premium editorial art direction, restrained colour grade";

  let specs: StepSpec[] = [];

  if (archetype === "product") {
    specs = [
      {
        name: "Product Hero",
        kind: "image",
        objective: "Establish the product with a premium hero shot.",
        modelId: pickImageModel(q, "reference"),
        refs: 3,
        tags: ["Reference required", "High detail"],
        subject: `Hero shot of ${subject}, flawless surface detail`,
        environment: "dark polished marble surface, seamless studio backdrop",
        camera: "85mm macro, slight low angle",
        lighting: "dramatic studio key with controlled reflections and deep shadows",
        composition: "centred product, generous negative space",
        direction: dir,
      },
      {
        name: "Lifestyle Shot",
        kind: "image",
        objective: "Place the product in a believable premium context.",
        modelId: pickImageModel(q, "character"),
        refs: 2,
        tags: ["Reference required", "Consistency"],
        subject: `A person wearing or using ${subject}, natural skin texture`,
        environment: "modern interior at dusk, warm practical lights",
        camera: "50mm, shallow depth of field",
        lighting: "soft window light with warm rim",
        composition: "off-centre subject, product clearly legible",
        direction: dir,
      },
      {
        name: "Cinematic Motion",
        kind: "video",
        objective: "Add controlled camera movement around the product.",
        modelId: pickVideoModel(q, "reference"),
        refs: 2,
        tags: ["Video", "Reference required"],
        subject: `Slow orbit around ${subject}`,
        environment: "same studio set, subtle atmospheric haze",
        camera: "motion-control arc, macro passes",
        lighting: "moving specular highlights across the surface",
        composition: "product locked to centre third",
        motion: "smooth 4-second orbit, easing in and out",
        direction: dir,
      },
      {
        name: "Final Reveal",
        kind: "video",
        objective: "Close on a premium logo and product reveal.",
        modelId: pickVideoModel(q, "audio"),
        refs: 1,
        tags: ["Video", "Audio"],
        subject: `${subject} settling into frame with brand mark appearing`,
        environment: "near-black background",
        camera: "locked off, slow push in",
        lighting: "single dramatic key, falloff to black",
        composition: "space reserved for logo lockup",
        motion: "gentle push-in with a soft audio swell",
        direction: dir,
      },
    ];
  } else if (archetype === "character") {
    specs = [
      {
        name: "Character Sheet",
        kind: "image",
        objective: "Lock the character look so every later shot matches.",
        modelId: pickImageModel(q, "character"),
        refs: 2,
        tags: ["Reference required", "Character"],
        subject: "Consistent character portrait, three angles, neutral expression",
        environment: "clean neutral studio backdrop",
        camera: "85mm portrait lens",
        lighting: "soft beauty lighting, gentle contrast",
        composition: "head and shoulders, even spacing",
        direction: dir,
      },
      {
        name: "Scene Setup",
        kind: "image",
        objective: "Design the environment the character performs in.",
        modelId: pickImageModel(q, "reference"),
        refs: 2,
        tags: ["Reference required", "Composition"],
        subject: "Character placed in the story environment",
        environment: "location interior with depth and layered foreground",
        camera: "35mm, eye level",
        lighting: "motivated practical light, cinematic contrast",
        composition: "rule of thirds, clear depth planes",
        direction: dir,
      },
      {
        name: "Performance Shot",
        kind: "video",
        objective: "Generate the talking or acting beat.",
        modelId: q === "Best" ? "hunyuan" : pickVideoModel(q, "audio"),
        refs: 2,
        tags: ["Video", "Lip sync"],
        subject: "Character delivering the line to camera",
        environment: "same scene environment",
        camera: "slow dolly in, medium close-up",
        lighting: "consistent with the scene setup",
        composition: "eyeline slightly above centre",
        motion: "natural head movement, synced lip motion",
        direction: dir,
      },
      {
        name: "Cutaway",
        kind: "video",
        objective: "Add a supporting shot for the edit.",
        modelId: pickVideoModel(q, "draft"),
        refs: 1,
        tags: ["Video", "Motion"],
        subject: "Detail cutaway tied to the story beat",
        environment: "same location, tighter framing",
        camera: "handheld, 50mm",
        lighting: "matching contrast ratio",
        composition: "tight, textural",
        motion: "subtle handheld drift",
        direction: dir,
      },
    ];
  } else if (archetype === "cinematic") {
    specs = [
      {
        name: "Establishing Frame",
        kind: "image",
        objective: "Set the world and tone of the film.",
        modelId: pickImageModel(q, "detail"),
        refs: 1,
        tags: ["High detail"],
        subject: "Wide establishing frame of the story world",
        environment: "atmospheric location, layered depth",
        camera: "24mm anamorphic",
        lighting: "golden hour with heavy atmosphere",
        composition: "wide, horizon low in frame",
        direction: dir,
      },
      {
        name: "Key Frame",
        kind: "image",
        objective: "Design the signature image of the piece.",
        modelId: pickImageModel(q, "reference"),
        refs: 2,
        tags: ["Reference required", "Composition"],
        subject: "The defining story moment",
        environment: "same world, tighter set",
        camera: "40mm, chest height",
        lighting: "single strong source, deep shadow",
        composition: "central subject, symmetrical framing",
        direction: dir,
      },
      {
        name: "Cinematic Motion",
        kind: "video",
        objective: "Bring the key frame to life with camera movement.",
        modelId: pickVideoModel(q, "cinematic"),
        refs: 2,
        tags: ["Video", "Cinematic"],
        subject: "The key frame in motion",
        environment: "same set with drifting atmosphere",
        camera: "slow crane down into a push",
        lighting: "shifting light as the camera travels",
        composition: "reframes from wide to medium",
        motion: "continuous 6-second move, no cuts",
        direction: dir,
      },
      {
        name: "Closing Beat",
        kind: "video",
        objective: "Land the emotional ending with sound.",
        modelId: pickVideoModel(q, "audio"),
        refs: 1,
        tags: ["Video", "Audio"],
        subject: "Final image resolving the story",
        environment: "fading light",
        camera: "locked off",
        lighting: "falloff into darkness",
        composition: "space for the end title",
        motion: "held frame with ambient sound bed",
        direction: dir,
      },
    ];
  } else {
    specs = [
      {
        name: "Concept Exploration",
        kind: "image",
        objective: "Explore visual directions before committing usage.",
        modelId: pickImageModel(q, "concept"),
        refs: 0,
        tags: ["Exploration", "Fast"],
        subject: "Four visual directions for the idea",
        environment: "varied environments per direction",
        camera: "mixed focal lengths",
        lighting: "varied lighting studies",
        composition: "clean, single-idea frames",
        direction: dir,
      },
      {
        name: "Hero Image",
        kind: "image",
        objective: "Produce the finished hero frame.",
        modelId: pickImageModel(q, "reference"),
        refs: 2,
        tags: ["Reference required", "High detail"],
        subject: "Refined hero image from the chosen direction",
        environment: "designed set with depth",
        camera: "50mm",
        lighting: "controlled key and fill",
        composition: "balanced, deliberate negative space",
        direction: dir,
      },
      {
        name: "Motion Pass",
        kind: "video",
        objective: "Turn the hero frame into a moving shot.",
        modelId: pickVideoModel(q, "cinematic"),
        refs: 1,
        tags: ["Video", "Motion"],
        subject: "Hero frame animated",
        environment: "same set",
        camera: "slow push in",
        lighting: "consistent with the hero image",
        composition: "stable framing",
        motion: "gentle parallax over 5 seconds",
        direction: dir,
      },
      {
        name: "Final Cut Assets",
        kind: "video",
        objective: "Deliver the closing beat and title space.",
        modelId: pickVideoModel(q, "audio"),
        refs: 0,
        tags: ["Video", "Audio"],
        subject: "Closing frame with room for titles",
        environment: "minimal background",
        camera: "locked off",
        lighting: "soft, even",
        composition: "clear title safe area",
        motion: "subtle drift with an audio tail",
        direction: dir,
      },
    ];
  }

  const steps = specs.map((s) => specToStep(s, settings));
  const name = projectNameFrom(brief, archetype);
  const type =
    settings.platform === "Instagram"
      ? "Instagram Ad"
      : settings.platform === "TikTok"
        ? "TikTok Campaign"
        : settings.platform === "YouTube"
          ? "YouTube Film"
          : "Brand Film";
  const goal =
    archetype === "product"
      ? `Premium ${settings.duration} cinematic product advertisement`
      : archetype === "character"
        ? `Character-led ${settings.duration} campaign with consistent talent`
        : archetype === "cinematic"
          ? `Cinematic ${settings.duration} story piece`
          : `${settings.duration} creative piece from brief to final cut`;

  return { name, type, goal, steps };
}

export function createProject(brief: string, settings: BriefSettings, references: ReferenceImage[]): Project {
  const { name, type, goal, steps } = generateWorkflow(brief, settings);
  const withRefs = steps.map((s) => ({
    ...s,
    referenceIds: references.slice(0, s.referencesNeeded).map((r) => r.id),
  }));
  return {
    id: uid(),
    name,
    type,
    goal,
    brief,
    settings,
    steps: withRefs,
    references,
    updatedAt: Date.now(),
  };
}

export function newStep(settings: BriefSettings): WorkflowStep {
  return specToStep(
    {
      name: "New Step",
      kind: "image",
      objective: "Describe what this step should achieve.",
      modelId: pickImageModel(settings.quality, "reference"),
      refs: 0,
      tags: ["Draft"],
      subject: "Subject of this shot",
      environment: "environment",
      camera: "50mm",
      lighting: "soft key light",
      composition: "balanced framing",
      direction: "premium editorial art direction",
    },
    settings,
  );
}

/* ---------- prompt intelligence (local, deterministic) ---------- */

const CINEMATIC_ADD =
  "anamorphic lens flare, filmic contrast, shallow depth of field, colour-graded like a feature film";
const REALISTIC_ADD =
  "shot on 35mm film, natural skin texture, real optical imperfections, believable physical lighting";
const FLUFF =
  /\b(stunning|beautiful|amazing|epic|ultra|hyper|masterpiece|award[- ]winning|breathtaking|gorgeous|incredible|premium editorial art direction|scroll-stopping vertical framing)\b/gi;

export function transformPrompt(prompt: string, mode: "improve" | "cinematic" | "minimal" | "realistic"): string {
  const clean = (s: string) =>
    s
      .split(",")
      .map((p) => p.trim())
      .filter((p, i, a) => p.length > 0 && a.indexOf(p) === i)
      .join(", ");

  switch (mode) {
    case "cinematic":
      return clean(`${prompt}, ${CINEMATIC_ADD}`);
    case "realistic":
      return clean(`${prompt}, ${REALISTIC_ADD}`);
    case "minimal":
      return clean(prompt.replace(FLUFF, "").replace(/\s{2,}/g, " "))
        .split(", ")
        .slice(0, 5)
        .join(", ");
    case "improve":
      return clean(
        `${prompt}, clear focal subject, intentional negative space, consistent colour palette, high dynamic range`,
      );
  }
}

/* ---------- usage estimation ---------- */

const USAGE_SCORE: Record<Level, number> = { low: 1, medium: 2, high: 3 };

export function estimateUsage(steps: WorkflowStep[]): { level: Level; filled: number; note: string } {
  if (steps.length === 0) return { level: "low", filled: 0, note: "Add steps to estimate usage." };
  const avg = steps.reduce((n, s) => n + USAGE_SCORE[s.usage], 0) / steps.length;
  const level: Level = avg < 1.6 ? "low" : avg < 2.4 ? "medium" : "high";
  const filled = Math.max(1, Math.min(10, Math.round((avg / 3) * 10)));
  const note =
    level === "low"
      ? "This plan stays cheap — good for exploration before you commit."
      : level === "medium"
        ? "Your plan should prioritize 2–3 high-quality generations and use faster models for exploration."
        : "This plan is quality-first. Consider drafting motion with a fast model before final passes.";
  return { level, filled, note };
}

export const EXAMPLES = [
  {
    label: "LUXURY PRODUCT",
    text: "Create a cinematic 20-second watch ad with product references.",
  },
  {
    label: "FASHION CAMPAIGN",
    text: "Create a vertical fashion campaign with a consistent model across multiple scenes.",
  },
  {
    label: "PRODUCT LAUNCH",
    text: "Create a product launch video with hero shots, lifestyle scenes and cinematic motion.",
  },
];

export const DEMO_BRIEF =
  "Create a cinematic 30-second product launch video for a premium electric motorcycle. It should feel futuristic, powerful and premium, with dramatic close-ups, moving vehicle shots and a final hero shot.";

export function approachFor(brief: string): string {
  switch (detectArchetype(brief)) {
    case "product":
      return "Lock the product's look with reference-driven stills first, then animate only the approved frames — this keeps the hero object consistent across every shot.";
    case "character":
      return "Establish the character once with a consistency-focused image model, reuse that frame as the reference for every following scene, then move to video.";
    case "cinematic":
      return "Build the film in beats: art-direct key frames as images, then hand each frame to a cinematic video model so motion and grade stay coherent.";
    default:
      return "Explore cheaply with fast image models, pick the strongest frames, then spend quality on the two or three shots that carry the piece.";
  }
}
