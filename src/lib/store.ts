import { useSyncExternalStore } from "react";
import type { Project } from "./workflow";

const KEY = "creative-director:v1";

interface StoreState {
  project: Project | null;
  saved: Project[];
}

let state: StoreState = { project: null, saved: [] };
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { saved: [], ...(JSON.parse(raw) as StoreState) };
  } catch {
    /* ignore corrupt state */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota — ignore in prototype */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  hydrate();
  listeners.add(l);
  return () => listeners.delete(l);
}

const getSnapshot = () => {
  hydrate();
  return state;
};
const getServerSnapshot = () => ({ project: null, saved: [] }) as StoreState;

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setProject(project: Project | null) {
  state = { ...state, project };
  emit();
}

export function updateProject(fn: (p: Project) => Project) {
  if (!state.project) return;
  state = { ...state, project: { ...fn(state.project), updatedAt: Date.now() } };
  emit();
}

export function saveProject() {
  if (!state.project) return;
  const p = { ...state.project, updatedAt: Date.now() };
  const saved = [p, ...state.saved.filter((s) => s.id !== p.id)];
  state = { project: p, saved };
  emit();
}

export function openSaved(id: string) {
  const found = state.saved.find((s) => s.id === id);
  if (found) setProject(found);
}
