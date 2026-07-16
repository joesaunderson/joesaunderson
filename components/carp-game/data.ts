export type CatchKind = "carp" | "junk" | "legendary";

export type FightProfile = {
  stamina: number;
  aggression: number;
  deadWeight?: boolean;
};

export type CatchSpec = {
  id: string;
  name: string;
  kind: CatchKind;
  minLevel: number;
  nightOnly?: boolean;
  weightRange?: [number, number];
  rarity: number;
  fight?: FightProfile;
  flavor: string[];
};

export const CATCHES: CatchSpec[] = [
  {
    id: "common",
    name: "Common carp",
    kind: "carp",
    minLevel: 1,
    weightRange: [8, 24],
    rarity: 20,
    fight: { stamina: 8, aggression: 0.5 },
    flavor: [
      "Solid. Honest. The line went tight and, briefly, life made sense.",
      "A proper common. It fought like it had somewhere to be.",
    ],
  },
  {
    id: "mirror",
    name: "Mirror carp",
    kind: "carp",
    minLevel: 1,
    weightRange: [10, 32],
    rarity: 16,
    fight: { stamina: 10, aggression: 0.6 },
    flavor: [
      "Scattered scales like a commit history. Beautiful.",
      "A mirror. You take seventeen photos. They are all the same photo.",
    ],
  },
  {
    id: "leather",
    name: "Leather carp",
    kind: "carp",
    minLevel: 1,
    weightRange: [9, 28],
    rarity: 10,
    fight: { stamina: 9, aggression: 0.55 },
    flavor: ["Not a scale on it. The lake's minimalist."],
  },
  {
    id: "ghost",
    name: "Ghost carp",
    kind: "carp",
    minLevel: 2,
    weightRange: [12, 30],
    rarity: 8,
    fight: { stamina: 10, aggression: 0.7 },
    flavor: ["It appeared. It vanished. The photo is blurry. They always are."],
  },
  {
    id: "grass",
    name: "Grass carp",
    kind: "carp",
    minLevel: 2,
    weightRange: [15, 35],
    rarity: 8,
    fight: { stamina: 12, aggression: 0.8 },
    flavor: ["Torpedo with opinions. Your arms will remember this one."],
  },
  {
    id: "koi",
    name: "An escaped koi",
    kind: "carp",
    minLevel: 3,
    weightRange: [6, 18],
    rarity: 4,
    fight: { stamina: 6, aggression: 0.5 },
    flavor: ["Somewhere, an ornamental pond is missing its star performer."],
  },
  {
    id: "crucian",
    name: "Crucian carp",
    kind: "carp",
    minLevel: 1,
    weightRange: [1, 3],
    rarity: 6,
    fight: { stamina: 2, aggression: 0.2 },
    flavor: ["Tiny. Perfect. You whisper \"unit test\" and slip it back."],
  },
  {
    id: "bream",
    name: "A bream",
    kind: "junk",
    minLevel: 1,
    weightRange: [2, 6],
    rarity: 5,
    fight: { stamina: 1, aggression: 0.1 },
    flavor: [
      "The lake's participation trophy. It didn't fight. It just gave up.",
    ],
  },
  {
    id: "eel",
    name: "An eel",
    kind: "junk",
    minLevel: 1,
    weightRange: [1, 4],
    rarity: 3,
    fight: { stamina: 4, aggression: 1 },
    flavor: [
      "Absolute chaos. Slime on everything. Ten minutes to unhook, three days to forget.",
    ],
  },
  {
    id: "boot",
    name: "An old boot",
    kind: "junk",
    minLevel: 1,
    rarity: 4,
    flavor: [
      "Size 9. Somewhere out there a man with one boot is having a worse day than you.",
    ],
  },
  {
    id: "cone",
    name: "A traffic cone",
    kind: "junk",
    minLevel: 2,
    rarity: 3,
    flavor: ["Standard issue. Every body of water in Britain has one. The law."],
  },
  {
    id: "trolley",
    name: "A shopping trolley",
    kind: "junk",
    minLevel: 2,
    rarity: 3,
    fight: { stamina: 14, aggression: 0, deadWeight: true },
    flavor: [
      "Forty minutes from the nearest supermarket. The lake keeps its secrets.",
    ],
  },
  {
    id: "duck-rubber",
    name: "A rubber duck",
    kind: "junk",
    minLevel: 2,
    rarity: 3,
    flavor: ["You now have a pair-programming partner. It already knows the bug."],
  },
  {
    id: "bottle",
    name: "A message in a bottle",
    kind: "junk",
    minLevel: 3,
    rarity: 2,
    flavor: ["The note inside reads, in full: \"ship it\"."],
  },
  {
    id: "sunglasses",
    name: "Your sunglasses from 2019",
    kind: "junk",
    minLevel: 3,
    rarity: 2,
    flavor: ["You lost these in 2019. The lake returns nothing. Except, apparently, this."],
  },
  {
    id: "charger",
    name: "A 2013 MacBook charger",
    kind: "junk",
    minLevel: 4,
    rarity: 2,
    flavor: ["MagSafe 1. Frayed at the neck, like they all were. Still worth more than your first car."],
  },
  {
    id: "jira",
    name: "An unresolved Jira ticket",
    kind: "junk",
    minLevel: 4,
    rarity: 2,
    flavor: [
      "REF-1042: \"investigate flaky test\". You throw it back. Not your backlog any more.",
    ],
  },
  {
    id: "monolith",
    name: "The PHP monolith",
    kind: "junk",
    minLevel: 5,
    rarity: 2,
    fight: { stamina: 16, aggression: 0.1, deadWeight: true },
    flavor: [
      "It took six weeks to escape this. You hold its gaze. You let it sink back into the dark.",
    ],
  },
  {
    id: "usb",
    name: "A USB stick",
    kind: "junk",
    minLevel: 5,
    rarity: 2,
    flavor: ["Labelled \"backup_final_FINAL_v2\". You dare not look."],
  },
  {
    id: "agent",
    name: "An AI agent",
    kind: "junk",
    minLevel: 6,
    rarity: 2,
    flavor: [
      "It offers to fish for you. You decline. Some things you still do by hand.",
    ],
  },
  {
    id: "trophy",
    name: "A replica Premier League trophy",
    kind: "junk",
    minLevel: 6,
    rarity: 1.5,
    flavor: ["\"This one's real,\" you whisper. Nobody is around to argue."],
  },
  {
    id: "firmino",
    name: "Firmino the Ghost Koi",
    kind: "legendary",
    minLevel: 4,
    weightRange: [18, 28],
    rarity: 1,
    fight: { stamina: 14, aggression: 0.9 },
    flavor: ["Si, señor. The most famous fish in Kent swims free again."],
  },
  {
    id: "istanbul",
    name: "\"Istanbul\", the mirror carp",
    kind: "legendary",
    minLevel: 7,
    weightRange: [25, 40],
    rarity: 0.8,
    fight: { stamina: 18, aggression: 1 },
    flavor: [
      "Three scales down at half time. It came back anyway. They always come back.",
    ],
  },
  {
    id: "leviathan",
    name: "The Kent Leviathan",
    kind: "legendary",
    minLevel: 5,
    nightOnly: true,
    weightRange: [45, 70],
    rarity: 0.7,
    fight: { stamina: 26, aggression: 1.2 },
    flavor: [
      "You will tell people about this. Nobody will believe you. The lake counts on that.",
    ],
  },
];

export const TITLES: [number, string][] = [
  [1, "Bank Tourist"],
  [2, "Peg Squatter"],
  [3, "Bivvy Dweller"],
  [5, "Boilie Economist"],
  [7, "Rig Scientist"],
  [9, "Bailiff's Nightmare"],
  [12, "Carp Whisperer"],
  [16, "Night Shift Legend"],
  [20, "Leviathan Hunter"],
  [25, "Lake Deity"],
];

export const WAITING_LINES = [
  "The lake is flat calm. Suspiciously calm.",
  "Your coffee went cold 40 minutes ago. You drink it anyway.",
  "Slack: 14 unread. The lake: infinite.",
  "A dog walker asks if you've caught anything. You lie.",
  "You consider checking CI. The bobbin says no.",
  "Somewhere in London, a meeting happens without you. Bliss.",
  "You re-tie the same rig for the third time. Ritual matters.",
  "The heron has been staring for ten minutes. Assert dominance.",
  "You think about the PHP monolith. The water darkens.",
  "A carp jumps exactly where you aren't fishing. Classic.",
  "Text from home: \"still at the lake?\" You are always at the lake.",
  "Online 8am to 8pm. This doesn't count. This is research.",
  "An agent could watch this rod. Some things you do by hand.",
  "You mentally rank your top five rigs. Nobody asked. Nobody ever asks.",
];

export const NIBBLE_LINES = [
  "Liner. The carp are laughing at you.",
  "A twitch. Your heart rate disagrees with your job title.",
  "Single bleep. Could be a fish. Could be the wind. Could be nothing.",
];

export const MISS_LINES = [
  "Gone. It felt the resistance and filed a complaint.",
  "Too slow. It's telling its mates about you right now.",
  "You struck at absolutely nothing. Textbook.",
];

export const SNAP_LINES = [
  "SNAP. That was your last good hooklink and you both know it.",
  "The line parts like a bad deploy. Then: silence.",
];

export const SPOOL_LINES = [
  "It's taken 120 metres of line and all of your dignity. Spooled.",
];

export const CAST_LINES = [
  "Good cast. The float settles. Now, the waiting.",
  "The float lands with a plop the whole lake heard.",
  "Out it goes. Somewhere down there, a decision is being made.",
];

export function titleForLevel(level: number): string {
  let title = TITLES[0][1];
  for (const [minLevel, name] of TITLES) {
    if (level >= minLevel) title = name;
  }
  return title;
}

export function levelForXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 40)) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 40;
}

export function rollCatch(level: number, isNight: boolean): CatchSpec {
  const pool = CATCHES.filter(
    (spec) => spec.minLevel <= level && (!spec.nightOnly || isNight),
  );
  const total = pool.reduce((sum, spec) => sum + spec.rarity, 0);
  let roll = Math.random() * total;
  for (const spec of pool) {
    roll -= spec.rarity;
    if (roll <= 0) return spec;
  }
  return pool[0];
}

export function rollWeight(spec: CatchSpec): number | null {
  if (!spec.weightRange) return null;
  const [min, max] = spec.weightRange;
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

export function xpForCatch(spec: CatchSpec, weight: number | null): number {
  if (spec.kind === "legendary") return Math.round((weight ?? 30) * 3);
  if (spec.kind === "carp") return Math.round(weight ?? 5);
  return 10;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
