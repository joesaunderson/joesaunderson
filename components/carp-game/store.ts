export type AnglerStats = {
  xp: number;
  personalBest: number | null;
  totalCatches: number;
  carpdex: Record<string, number>;
  weirdest: string | null;
};

const STORAGE_KEY = "carp-angler-stats";

export const DEFAULT_STATS: AnglerStats = {
  xp: 0,
  personalBest: null,
  totalCatches: 0,
  carpdex: {},
  weirdest: null,
};

let cached: AnglerStats | null = null;
let listeners: (() => void)[] = [];

function load(): AnglerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATS, ...(JSON.parse(raw) as AnglerStats) };
    const legacyPb = localStorage.getItem("carp-personal-best");
    if (legacyPb) return { ...DEFAULT_STATS, personalBest: Number(legacyPb) };
  } catch {
    return DEFAULT_STATS;
  }
  return DEFAULT_STATS;
}

export function subscribeToStats(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function readStats(): AnglerStats {
  if (!cached) cached = load();
  return cached;
}

export function readServerStats(): AnglerStats {
  return DEFAULT_STATS;
}

export function updateStats(update: Partial<AnglerStats>): AnglerStats {
  cached = { ...readStats(), ...update };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // Private browsing or full storage: play on without persistence.
  }
  for (const listener of listeners) listener();
  return cached;
}
