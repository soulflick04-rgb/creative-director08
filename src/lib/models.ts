export type ModelKind = "image" | "video";
export type Level = "low" | "medium" | "high";

export interface CreativeModel {
  id: string;
  name: string;
  kind: ModelKind;
  description: string;
  bestFor: string[];
  tags: string[];
  speed: Level;
  quality: Level;
  usage: Level;
}

export const MODELS: CreativeModel[] = [
  {
    id: "gpt-image-2",
    name: "GPT Image 2",
    kind: "image",
    description: "Precise prompt-following image model with clean in-image typography.",
    bestFor: ["exact prompt control", "clean in-image text", "typography"],
    tags: ["Prompt control", "Text"],
    speed: "medium",
    quality: "high",
    usage: "medium",
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    kind: "image",
    description: "Studio-grade imagery with strong character consistency across shots.",
    bestFor: ["character consistency", "studio-grade imagery"],
    tags: ["Character", "Consistency"],
    speed: "medium",
    quality: "high",
    usage: "high",
  },
  {
    id: "seedream-5-pro",
    name: "Seedream 5.0 Pro",
    kind: "image",
    description: "Multi-reference composition engine with multilingual text handling.",
    bestFor: ["multi-reference composition", "multilingual text", "complex reference-based compositions"],
    tags: ["References", "Composition"],
    speed: "medium",
    quality: "high",
    usage: "medium",
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    kind: "image",
    description: "Fast high-fidelity image generation for quick quality passes.",
    bestFor: ["fast high-fidelity images"],
    tags: ["Fast", "Quality"],
    speed: "high",
    quality: "medium",
    usage: "low",
  },
  {
    id: "flux-2-max",
    name: "FLUX.2 Max",
    kind: "image",
    description: "Maximum detail rendering with tight reference matching.",
    bestFor: ["maximum detail", "reference matching"],
    tags: ["Detail", "Reference"],
    speed: "low",
    quality: "high",
    usage: "high",
  },
  {
    id: "flux-2-pro",
    name: "FLUX.2 Pro",
    kind: "image",
    description: "High-detail image rendering for finished frames.",
    bestFor: ["high-detail image rendering"],
    tags: ["Detail"],
    speed: "medium",
    quality: "high",
    usage: "medium",
  },
  {
    id: "gpt-image-1-mini",
    name: "GPT Image 1 Mini",
    kind: "image",
    description: "Rapid concept batches for early exploration.",
    bestFor: ["rapid concept batches"],
    tags: ["Fast", "Concepts"],
    speed: "high",
    quality: "low",
    usage: "low",
  },
  {
    id: "seedream-4-5",
    name: "Seedream 4.5",
    kind: "image",
    description: "High-volume generation up to 4K output.",
    bestFor: ["high-volume generation"],
    tags: ["Volume", "4K"],
    speed: "high",
    quality: "medium",
    usage: "medium",
  },
  {
    id: "flux-2-klein-4b",
    name: "FLUX.2 Klein 4B",
    kind: "image",
    description: "Lightweight model for rapid visual exploration.",
    bestFor: ["rapid exploration"],
    tags: ["Fast", "Exploration"],
    speed: "high",
    quality: "low",
    usage: "low",
  },
  {
    id: "recraft-4-1",
    name: "Recraft 4.1",
    kind: "image",
    description: "Expressive art direction with photoreal visual direction control.",
    bestFor: ["expressive art direction", "photoreal visual direction"],
    tags: ["Art direction", "Photoreal"],
    speed: "medium",
    quality: "high",
    usage: "medium",
  },
  {
    id: "seedance-2-5",
    name: "Seedance 2.5",
    kind: "video",
    description: "Cinematic shot generation for longer sequences.",
    bestFor: ["cinematic shots", "longer cinematic sequences"],
    tags: ["Cinematic"],
    speed: "low",
    quality: "high",
    usage: "high",
  },
  {
    id: "veo-3-1",
    name: "Gemini Veo 3.1",
    kind: "video",
    description: "Native audio generation synced to video.",
    bestFor: ["native audio", "synced video/audio"],
    tags: ["Audio", "Cinematic"],
    speed: "low",
    quality: "high",
    usage: "high",
  },
  {
    id: "minimax-hailuo",
    name: "MiniMax Hailuo",
    kind: "video",
    description: "Text, keyframe and reference-driven video generation.",
    bestFor: ["text", "keyframes", "reference-based video"],
    tags: ["References", "Motion"],
    speed: "medium",
    quality: "medium",
    usage: "medium",
  },
  {
    id: "seedance-2-0",
    name: "Seedance 2.0",
    kind: "video",
    description: "Reference-composed cinematic video with sound.",
    bestFor: ["reference-composed cinematic video", "sound"],
    tags: ["References", "Audio"],
    speed: "medium",
    quality: "high",
    usage: "high",
  },
  {
    id: "wan-2-7",
    name: "Wan 2.7",
    kind: "video",
    description: "Reference-composed video generation.",
    bestFor: ["reference-composed video"],
    tags: ["References"],
    speed: "medium",
    quality: "medium",
    usage: "medium",
  },
  {
    id: "hunyuan",
    name: "Hunyuan",
    kind: "video",
    description: "Native audio with lip sync for talking characters.",
    bestFor: ["native audio", "lip sync"],
    tags: ["Audio", "Lip sync"],
    speed: "medium",
    quality: "medium",
    usage: "medium",
  },
  {
    id: "kling-3-0",
    name: "Kling 3.0",
    kind: "video",
    description: "Strong reference control with frames and elements.",
    bestFor: ["strong reference control", "frames/elements"],
    tags: ["Control", "References"],
    speed: "medium",
    quality: "high",
    usage: "high",
  },
  {
    id: "grok-imagine-1-5",
    name: "Grok Imagine 1.5",
    kind: "video",
    description: "Cinematic clips with synchronized audio.",
    bestFor: ["cinematic clips", "synchronized audio"],
    tags: ["Audio", "Cinematic"],
    speed: "medium",
    quality: "medium",
    usage: "medium",
  },
  {
    id: "ltx-2-3-fast",
    name: "LTX-2.3 Fast",
    kind: "video",
    description: "Rapid drafts for motion exploration.",
    bestFor: ["rapid drafts"],
    tags: ["Fast", "Draft"],
    speed: "high",
    quality: "low",
    usage: "low",
  },
  {
    id: "hailuo-2-3",
    name: "Hailuo 2.3",
    kind: "video",
    description: "Fast high-dynamic motion from a single image.",
    bestFor: ["fast high-dynamic motion from one image"],
    tags: ["Image to video", "Motion"],
    speed: "high",
    quality: "medium",
    usage: "low",
  },
  {
    id: "veo-3-1-fast",
    name: "Veo 3.1 Fast",
    kind: "video",
    description: "Faster video generation with the Veo look.",
    bestFor: ["faster video generation"],
    tags: ["Fast"],
    speed: "high",
    quality: "medium",
    usage: "medium",
  },
  {
    id: "kling-3-0-turbo",
    name: "Kling 3.0 Turbo",
    kind: "video",
    description: "Fast cinematic clips with audio.",
    bestFor: ["fast cinematic clips", "audio"],
    tags: ["Fast", "Audio"],
    speed: "high",
    quality: "medium",
    usage: "medium",
  },
  {
    id: "seedance-2-mini",
    name: "Seedance 2 Mini",
    kind: "video",
    description: "Lightweight motion drafts for timing tests.",
    bestFor: ["lightweight motion drafts"],
    tags: ["Fast", "Draft"],
    speed: "high",
    quality: "low",
    usage: "low",
  },
  {
    id: "veo-3-1-lite",
    name: "Veo 3.1 Lite",
    kind: "video",
    description: "Lighter and quicker video generation.",
    bestFor: ["lighter and quicker video generation"],
    tags: ["Fast", "Light"],
    speed: "high",
    quality: "low",
    usage: "low",
  },
];

export const MODEL_BY_ID = Object.fromEntries(MODELS.map((m) => [m.id, m])) as Record<
  string,
  CreativeModel
>;

export const MODEL_FILTERS = [
  "All",
  "Image",
  "Video",
  "Fast",
  "Reference",
  "Character",
  "Audio",
  "High quality",
] as const;

export type ModelFilter = (typeof MODEL_FILTERS)[number];

export function matchesFilter(model: CreativeModel, filter: ModelFilter): boolean {
  switch (filter) {
    case "All":
      return true;
    case "Image":
      return model.kind === "image";
    case "Video":
      return model.kind === "video";
    case "Fast":
      return model.speed === "high";
    case "Reference":
      return model.tags.some((t) => /reference/i.test(t));
    case "Character":
      return model.tags.some((t) => /character|consistency|lip sync/i.test(t));
    case "Audio":
      return model.tags.some((t) => /audio|lip sync/i.test(t));
    case "High quality":
      return model.quality === "high";
  }
}

export const LEVEL_LABEL: Record<Level, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
