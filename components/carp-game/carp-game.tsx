"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CATCHES,
  CAST_LINES,
  MISS_LINES,
  NIBBLE_LINES,
  SNAP_LINES,
  SPOOL_LINES,
  WAITING_LINES,
  levelForXp,
  pick,
  rollCatch,
  rollWeight,
  titleForLevel,
  xpForCatch,
  xpForLevel,
  type CatchSpec,
} from "./data";
import { SoundKit } from "./audio";
import {
  readServerStats,
  readStats,
  subscribeToStats,
  updateStats,
} from "./store";

type Phase =
  | "idle"
  | "charging"
  | "casting"
  | "waiting"
  | "run"
  | "fighting"
  | "landed"
  | "lost";

type FishState = "cruise" | "approach" | "nibble" | "flee";

type Fish = {
  x: number;
  y: number;
  vx: number;
  size: number;
  hue: number;
  ghost: boolean;
  wobble: number;
  state: FishState;
  nibblesLeft: number;
  nibbleTimer: number;
};

type Fight = {
  spec: CatchSpec;
  weight: number | null;
  distance: number;
  startDistance: number;
  tension: number;
  stamina: number;
  surgeTimer: number;
  surging: boolean;
};

type Card = {
  title: string;
  weightLabel: string | null;
  flavor: string;
  xp: number;
  isPersonalBest: boolean;
  legendary: boolean;
};

type Duck = { x: number; dir: number };

type Game = {
  phase: Phase;
  t: number;
  power: number;
  powerDir: number;
  castX: number;
  castT: number;
  floatDip: number;
  fish: Fish[];
  hooked: Fish | null;
  fight: Fight | null;
  runTimer: number;
  alarmTimer: number;
  reelHold: boolean;
  message: string;
  messageT: number;
  ambientT: number;
  card: Card | null;
  ducks: Duck[];
  duckTimer: number;
  heron: boolean;
  heronTimer: number;
  leapX: number;
  leapT: number;
  leapTimer: number;
  raining: boolean;
  rainTimer: number;
  shake: number;
  W: number;
  H: number;
};

const CYCLE_SECONDS = 200;
const MAX_LINE_METRES = 120;
const RUN_WINDOW = 1.15;

function createGame(): Game {
  return {
    phase: "idle",
    card: null,
    t: 0,
    power: 0,
    powerDir: 1,
    castX: 0,
    castT: 0,
    floatDip: 0,
    fish: [],
    hooked: null,
    fight: null,
    runTimer: 0,
    alarmTimer: 0,
    reelHold: false,
    message: "Hold to charge a cast. The lake does the rest.",
    messageT: 0,
    ambientT: 8,
    ducks: [],
    duckTimer: 20,
    heron: false,
    heronTimer: 12,
    leapX: 0,
    leapT: 1,
    leapTimer: 14,
    raining: false,
    rainTimer: 30,
    shake: 0,
    W: 640,
    H: 420,
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return `rgb(${Math.round(lerp(r1, r2, t))}, ${Math.round(lerp(g1, g2, t))}, ${Math.round(lerp(b1, b2, t))})`;
}

function daylightAt(t: number): number {
  const phase = (t / CYCLE_SECONDS) % 1;
  return 0.5 + 0.5 * Math.cos(phase * Math.PI * 2);
}

export function CarpGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(createGame());
  const soundRef = useRef<SoundKit>(new SoundKit());
  const [muted, setMuted] = useState(false);
  const [session, setSession] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const stats = useSyncExternalStore(
    subscribeToStats,
    readStats,
    readServerStats,
  );

  const level = levelForXp(stats.xp);
  const title = titleForLevel(level);
  const xpIntoLevel = stats.xp - xpForLevel(level);
  const xpNeeded = xpForLevel(level + 1) - xpForLevel(level);

  useEffect(() => {
    soundRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const game = gameRef.current;
    const sound = soundRef.current;
    (window as unknown as { __lake: Game }).__lake = game;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const width = container.clientWidth;
      const height = Math.round(Math.min(520, Math.max(360, width * 0.62)));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      game.W = width;
      game.H = height;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const waterY = () => game.H * 0.36;
    const bankX = 150;
    const rodTip = () => ({ x: bankX - 10, y: waterY() - 78 });
    const baitY = () => game.H - 34;
    const minCast = () => bankX + 90;
    const maxCast = () => game.W - 50;
    const isNight = () => daylightAt(game.t) < 0.35;

    const say = (text: string) => {
      game.message = text;
      game.messageT = 7;
    };

    const announce = (text: string) => setAnnouncement(text);

    const spawnFish = (fromEdge: boolean) => {
      const dir = Math.random() < 0.5 ? 1 : -1;
      const span = game.W - bankX;
      const x = fromEdge
        ? dir === 1
          ? bankX - 30
          : game.W + 30
        : bankX + 40 + Math.random() * (span - 80);
      game.fish.push({
        x,
        y: waterY() + 36 + Math.random() * (game.H - waterY() - 80),
        vx: dir * (18 + Math.random() * 42),
        size: 0.7 + Math.random() * 0.8,
        hue: 30 + Math.random() * 26,
        ghost: Math.random() < 0.12,
        wobble: Math.random() * Math.PI * 2,
        state: "cruise",
        nibblesLeft: 0,
        nibbleTimer: 0,
      });
    };

    const resetToIdle = () => {
      game.phase = "idle";
      game.hooked = null;
      game.fight = null;
      game.card = null;
      game.floatDip = 0;
    };

    const land = (spec: CatchSpec, weight: number | null) => {
      const gained = xpForCatch(spec, weight);
      const before = readStats();
      const levelBefore = levelForXp(before.xp);
      const isFish = spec.kind !== "junk";
      const isPersonalBest =
        isFish &&
        weight !== null &&
        (before.personalBest === null || weight > before.personalBest);
      updateStats({
        xp: before.xp + gained,
        totalCatches: before.totalCatches + 1,
        personalBest: isPersonalBest ? weight : before.personalBest,
        carpdex: {
          ...before.carpdex,
          [spec.id]: (before.carpdex[spec.id] ?? 0) + 1,
        },
        weirdest: spec.kind === "junk" ? spec.name : before.weirdest,
      });
      setSession((count) => count + 1);
      const levelAfter = levelForXp(before.xp + gained);
      game.card = {
        title: spec.name,
        weightLabel: weight === null ? null : `${weight}lb`,
        flavor: pick(spec.flavor),
        xp: gained,
        isPersonalBest,
        legendary: spec.kind === "legendary",
      };
      game.phase = "landed";
      game.hooked = null;
      game.fight = null;
      if (spec.kind === "legendary") sound.legendary();
      else sound.fanfare();
      announce(
        `Caught: ${spec.name}${weight === null ? "" : `, ${weight} pounds`}. ${
          isPersonalBest ? "New personal best." : ""
        }`,
      );
      if (levelAfter > levelBefore) {
        say(
          `Level ${levelAfter}: ${titleForLevel(levelAfter)}. The carp have noticed.`,
        );
      }
    };

    const startFight = (spec: CatchSpec) => {
      const weight = rollWeight(spec);
      game.fish = game.fish.filter((fish) => fish !== game.hooked);
      game.hooked = null;
      if (!spec.fight) {
        land(spec, weight);
        return;
      }
      game.phase = "fighting";
      game.fight = {
        spec,
        weight,
        distance: 18 + (weight ?? 10) * 1.1,
        startDistance: 18 + (weight ?? 10) * 1.1,
        tension: 0.25,
        stamina: spec.fight.stamina,
        surgeTimer: 1 + Math.random() * 2,
        surging: false,
      };
      say(
        spec.fight.deadWeight
          ? "There's... weight. It isn't fighting. It simply objects."
          : "Fish on. Keep the tension out of the red.",
      );
      announce("Fish on. Hold to reel, release to give line.");
    };

    const strike = () => {
      if (game.phase === "run") {
        const spec = rollCatch(levelForXp(readStats().xp), isNight());
        sound.splash();
        startFight(spec);
      } else if (game.phase === "waiting") {
        const nibbler = game.fish.find((f) => f.state === "nibble");
        if (nibbler) {
          nibbler.state = "flee";
          say(pick(MISS_LINES));
        } else {
          say("You reeled in to check the bait. It's fine. It was always fine.");
        }
        resetToIdle();
      }
    };

    const pointerDown = () => {
      sound.unlock();
      switch (game.phase) {
        case "idle":
          game.phase = "charging";
          game.power = 0;
          game.powerDir = 1;
          break;
        case "waiting":
        case "run":
          strike();
          break;
        case "fighting":
          game.reelHold = true;
          break;
        case "landed":
        case "lost":
          resetToIdle();
          break;
        case "charging":
        case "casting":
          break;
      }
    };

    const pointerUp = () => {
      if (game.phase === "charging") {
        game.castX = lerp(minCast(), maxCast(), game.power);
        game.castT = 0;
        game.phase = "casting";
      }
      game.reelHold = false;
    };

    const keyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      if (document.activeElement && document.activeElement !== document.body) {
        if (document.activeElement !== canvas) return;
      }
      event.preventDefault();
      pointerDown();
    };
    const keyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      pointerUp();
    };

    canvas.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    const update = (dt: number) => {
      game.t += dt;
      game.messageT = Math.max(0, game.messageT - dt);
      game.shake = Math.max(0, game.shake - dt * 3);
      const night = isNight();

      const targetCount = 5 + Math.min(3, levelForXp(readStats().xp) - 1);
      while (game.fish.length < targetCount) {
        spawnFish(game.fish.length >= 4);
      }

      for (const fish of game.fish) {
        fish.wobble += dt * (3 + Math.abs(fish.vx) * 0.05);
        if (fish.state === "cruise" || fish.state === "flee") {
          const speed = fish.state === "flee" ? 3 : 1;
          fish.x += fish.vx * speed * dt;
          fish.y += Math.sin(fish.wobble * 0.5) * 6 * dt;
        } else if (fish.state === "approach") {
          const dx = game.castX - fish.x;
          const dy = baitY() - 8 - fish.y;
          fish.x += dx * dt * 0.9;
          fish.y += dy * dt * 0.9;
          fish.vx = Math.sign(dx || 1) * Math.abs(fish.vx);
          if (Math.hypot(dx, dy) < 14) {
            fish.state = "nibble";
            fish.nibblesLeft = 1 + Math.floor(Math.random() * 3);
            fish.nibbleTimer = 0.4;
          }
        } else if (fish.state === "nibble" && game.phase === "waiting") {
          fish.nibbleTimer -= dt;
          if (fish.nibbleTimer <= 0) {
            if (fish.nibblesLeft > 0) {
              fish.nibblesLeft -= 1;
              fish.nibbleTimer = 0.55 + Math.random() * 0.6;
              game.floatDip = 1;
              sound.bleep();
              if (Math.random() < 0.35) say(pick(NIBBLE_LINES));
            } else {
              const takeChance =
                0.55 * (night ? 1.5 : 1) * (game.raining ? 1.25 : 1);
              if (Math.random() < takeChance) {
                game.phase = "run";
                game.runTimer = RUN_WINDOW;
                game.hooked = fish;
                fish.state = "flee";
                fish.vx = (fish.x > game.W / 2 ? -1 : 1) * 160;
                announce("A take. Strike now.");
              } else {
                fish.state = "flee";
                if (Math.random() < 0.5) say("It looked. It left. Story of the lake.");
              }
            }
          }
        }
        if (fish.state === "nibble" && game.phase !== "waiting") {
          fish.state = "cruise";
        }
      }
      game.fish = game.fish.filter(
        (fish) => fish.x > bankX - 60 && fish.x < game.W + 60,
      );
      game.floatDip = Math.max(0, game.floatDip - dt * 3);

      if (game.phase === "charging") {
        game.power += game.powerDir * dt * 1.4;
        if (game.power >= 1) {
          game.power = 1;
          game.powerDir = -1;
        } else if (game.power <= 0) {
          game.power = 0;
          game.powerDir = 1;
        }
      }

      if (game.phase === "casting") {
        game.castT += dt * 2.2;
        if (game.castT >= 1) {
          game.phase = "waiting";
          sound.plop();
          if (Math.random() < 0.6) say(pick(CAST_LINES));
        }
      }

      if (game.phase === "waiting") {
        game.ambientT -= dt;
        if (game.ambientT <= 0) {
          game.ambientT = 14 + Math.random() * 14;
          if (game.messageT <= 0) say(pick(WAITING_LINES));
        }
        for (const fish of game.fish) {
          if (
            fish.state === "cruise" &&
            Math.abs(fish.x - game.castX) < 110 &&
            Math.random() < dt * (night ? 0.5 : 0.3)
          ) {
            fish.state = "approach";
          }
        }
      }

      if (game.phase === "run") {
        game.runTimer -= dt;
        game.alarmTimer -= dt;
        if (game.alarmTimer <= 0) {
          sound.alarm();
          game.alarmTimer = 0.13;
        }
        if (game.runTimer <= 0) {
          say(pick(MISS_LINES));
          announce("Missed it.");
          game.phase = "lost";
          game.hooked = null;
        }
      }

      if (game.phase === "fighting" && game.fight) {
        const fight = game.fight;
        const profile = fight.spec.fight;
        const aggression = profile?.aggression ?? 0.5;
        fight.surgeTimer -= dt;
        if (fight.surgeTimer <= 0) {
          fight.surging = !fight.surging;
          fight.surgeTimer = fight.surging
            ? 0.7 + Math.random() * 0.9
            : 1 + Math.random() * 2.2;
          if (fight.surging && !reducedMotion) game.shake = 0.5;
        }
        const staminaFactor = Math.max(0.25, fight.stamina / (profile?.stamina ?? 8));
        const pull = profile?.deadWeight
          ? 0.55
          : (0.3 + aggression * (fight.surging ? 1 : 0.35)) * staminaFactor;
        if (game.reelHold) {
          fight.tension += (pull * 0.85 + 0.3) * dt;
          fight.distance -= 8.5 * dt;
          fight.stamina -= dt * 1.2;
          if (Math.random() < dt * 14) sound.reelClick();
        } else {
          fight.tension -= dt * 1.15;
          fight.distance += pull * 9 * dt;
          fight.stamina -= dt * 0.5;
        }
        fight.tension = Math.max(0, Math.min(1.05, fight.tension));
        if (fight.tension >= 1) {
          sound.snap();
          say(pick(SNAP_LINES));
          announce("The line snapped.");
          game.phase = "lost";
          game.hooked = null;
          game.fight = null;
        } else if (fight.distance >= MAX_LINE_METRES) {
          say(pick(SPOOL_LINES));
          announce("Spooled. It's gone.");
          game.phase = "lost";
          game.hooked = null;
          game.fight = null;
        } else if (fight.distance <= 0) {
          sound.splash();
          land(fight.spec, fight.weight);
        }
      }

      game.duckTimer -= dt;
      if (game.duckTimer <= 0) {
        game.duckTimer = 30 + Math.random() * 40;
        const dir = Math.random() < 0.5 ? 1 : -1;
        game.ducks.push({ x: dir === 1 ? bankX : game.W + 20, dir });
      }
      for (const duck of game.ducks) duck.x += duck.dir * 22 * dt;
      game.ducks = game.ducks.filter(
        (duck) => duck.x > bankX - 40 && duck.x < game.W + 40,
      );

      game.heronTimer -= dt;
      if (game.heronTimer <= 0) {
        game.heron = !game.heron;
        game.heronTimer = game.heron
          ? 20 + Math.random() * 30
          : 15 + Math.random() * 40;
      }

      game.leapTimer -= dt;
      game.leapT = Math.min(1, game.leapT + dt * 1.6);
      if (game.leapTimer <= 0) {
        game.leapTimer = 18 + Math.random() * 25;
        game.leapX = bankX + 60 + Math.random() * (game.W - bankX - 120);
        game.leapT = 0;
        sound.splash();
      }

      game.rainTimer -= dt;
      if (game.rainTimer <= 0) {
        game.raining = !game.raining;
        game.rainTimer = game.raining
          ? 25 + Math.random() * 30
          : 40 + Math.random() * 60;
        if (game.raining) say("Rain. Perfect. Genuinely: the fish love it.");
      }
    };

    const drawFish = (fish: Fish, night: boolean) => {
      const liverpool = document.documentElement.classList.contains("liverpool");
      const bodyW = 26 * fish.size;
      const bodyH = 10 * fish.size;
      const dir = Math.sign(fish.vx) || 1;
      ctx.save();
      ctx.translate(fish.x, fish.y + Math.sin(fish.wobble) * 2);
      ctx.scale(dir, 1);
      ctx.globalAlpha = fish.ghost ? 0.45 : night ? 0.55 : 0.8;
      const color = liverpool
        ? "#c8102e"
        : fish.ghost
          ? "#c9d2cd"
          : `hsl(${fish.hue}, 32%, ${night ? 30 : 42}%)`;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyW / 2, bodyH / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      const tailSwing = Math.sin(fish.wobble * 2) * 4 * fish.size;
      ctx.beginPath();
      ctx.moveTo(-bodyW / 2, 0);
      ctx.lineTo(-bodyW / 2 - 8 * fish.size, -4 * fish.size + tailSwing);
      ctx.lineTo(-bodyW / 2 - 8 * fish.size, 4 * fish.size + tailSwing);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = night ? "#0c0c0c" : "#1a1a1a";
      ctx.beginPath();
      ctx.arc(bodyW / 4, -1, 1.3 * fish.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      const { W, H } = game;
      const daylight = daylightAt(game.t);
      const night = isNight();
      const wy = waterY();

      ctx.save();
      if (game.shake > 0) {
        ctx.translate(
          (Math.random() - 0.5) * game.shake * 6,
          (Math.random() - 0.5) * game.shake * 6,
        );
      }

      const skyTop = mix("#0b1026", "#7db3d8", daylight);
      const skyBottom = mix("#1b2a4a", "#d8ecf5", daylight);
      const sky = ctx.createLinearGradient(0, 0, 0, wy);
      sky.addColorStop(0, skyTop);
      sky.addColorStop(1, skyBottom);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, wy);

      const phase = (game.t / CYCLE_SECONDS) % 1;
      const orbX = lerp(60, W - 60, ((phase + 0.5) % 0.5) * 2);
      const orbY = wy - 30 - Math.sin(((phase + 0.5) % 0.5) * 2 * Math.PI) * (wy - 70);
      ctx.fillStyle = night ? "#e8e6d8" : "#ffd76e";
      ctx.beginPath();
      ctx.arc(orbX, Math.max(26, orbY), night ? 10 : 14, 0, Math.PI * 2);
      ctx.fill();
      if (night) {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        for (let i = 0; i < 40; i++) {
          const sx = ((i * 97) % W + game.t * 0.5) % W;
          const sy = ((i * 53) % (wy - 40)) + 8;
          ctx.fillRect(sx, sy, 1.2, 1.2);
        }
      }

      const dusk = 1 - Math.abs(daylight - 0.4) * 3;
      if (dusk > 0) {
        ctx.fillStyle = `rgba(235, 120, 60, ${Math.min(0.18, dusk * 0.18)})`;
        ctx.fillRect(0, 0, W, wy);
      }

      const waterTop = mix("#0d2230", "#4a7d99", daylight);
      const waterDeep = mix("#04101a", "#173445", daylight);
      const water = ctx.createLinearGradient(0, wy, 0, H);
      water.addColorStop(0, waterTop);
      water.addColorStop(1, waterDeep);
      ctx.fillStyle = water;
      ctx.fillRect(0, wy, W, H - wy);

      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const ry = wy + 8 + i * 14;
        ctx.beginPath();
        for (let x = bankX - 20; x < W; x += 8) {
          const y = ry + Math.sin(x * 0.05 + game.t * (1 + i * 0.1)) * 1.6;
          if (x === bankX - 20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (const fish of game.fish) drawFish(fish, night);

      ctx.fillStyle = mix("#101c10", "#3d5a2e", daylight);
      ctx.beginPath();
      ctx.moveTo(0, wy - 26);
      ctx.quadraticCurveTo(bankX * 0.7, wy - 44, bankX, wy - 6);
      ctx.lineTo(bankX, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = mix("#1a2b14", "#4c6b34", daylight);
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const rx = bankX - 4 + (i % 3) * 5;
        const ry = wy - 4 + (i % 2) * 6;
        const sway = Math.sin(game.t * 1.2 + i) * 3;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.quadraticCurveTo(rx + sway, ry - 26, rx + sway * 1.6, ry - 44 - i * 3);
        ctx.stroke();
      }

      if (game.heron) {
        const hx = W - 46;
        ctx.strokeStyle = night ? "#9aa3ab" : "#5f6b73";
        ctx.fillStyle = night ? "#9aa3ab" : "#5f6b73";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hx, wy);
        ctx.lineTo(hx, wy - 26);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(hx, wy - 32, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(hx + 4, wy - 38);
        ctx.lineTo(hx + 14, wy - 36);
        ctx.stroke();
      }

      for (const duck of game.ducks) {
        ctx.fillStyle = night ? "#7a7466" : "#8a6f4d";
        ctx.beginPath();
        ctx.ellipse(duck.x, wy + 2, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(duck.x + duck.dir * 7, wy - 4, 3.4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (game.leapT < 1) {
        const lt = game.leapT;
        const arcY = wy - Math.sin(lt * Math.PI) * 26;
        ctx.globalAlpha = 1 - lt * 0.4;
        ctx.fillStyle = "#4d4636";
        ctx.beginPath();
        ctx.ellipse(game.leapX, arcY, 10, 4, (lt - 0.5) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath();
        ctx.arc(game.leapX, wy + 2, 6 + lt * 22, 0, Math.PI);
        ctx.stroke();
      }

      const tip = rodTip();
      ctx.strokeStyle = night ? "#c9c9c9" : "#2c2c2c";
      ctx.lineWidth = 3;
      const bodyX = 66;
      const bodyY = wy - 24;
      ctx.beginPath();
      ctx.moveTo(bodyX - 8, bodyY);
      ctx.lineTo(bodyX - 8, bodyY - 22);
      ctx.moveTo(bodyX + 2, bodyY);
      ctx.lineTo(bodyX + 2, bodyY - 22);
      ctx.moveTo(bodyX - 10, bodyY - 22);
      ctx.lineTo(bodyX + 4, bodyY - 22);
      ctx.lineTo(bodyX, bodyY - 46);
      ctx.lineTo(bodyX - 6, bodyY - 46);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bodyX - 2, bodyY - 54, 7, 0, Math.PI * 2);
      ctx.stroke();
      const flex =
        game.phase === "fighting" ? Math.min(20, (game.fight?.tension ?? 0) * 30) : 0;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bodyX + 2, bodyY - 40);
      ctx.quadraticCurveTo(
        (bodyX + tip.x) / 2,
        (bodyY - 40 + tip.y) / 2 - 10 + flex,
        tip.x,
        tip.y + flex,
      );
      ctx.stroke();

      const active =
        game.phase === "waiting" ||
        game.phase === "run" ||
        game.phase === "fighting" ||
        game.phase === "casting";
      if (active) {
        let fx = game.castX;
        let fy = wy + game.floatDip * 5;
        if (game.phase === "casting") {
          const ct = game.castT;
          fx = lerp(tip.x, game.castX, ct);
          fy = lerp(tip.y, wy, ct) - Math.sin(ct * Math.PI) * 60;
        }
        if (game.phase === "run" && game.hooked) {
          fx = game.hooked.x;
          fy = wy + 8;
        }
        if (game.phase === "fighting" && game.fight) {
          const progress = 1 - game.fight.distance / game.fight.startDistance;
          fx = lerp(game.castX, bankX + 60, Math.max(0, progress));
          fy = wy + 6 + Math.sin(game.t * 9) * (game.fight.surging ? 6 : 2);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y + flex);
        if (game.phase === "fighting" || game.phase === "run") {
          ctx.lineTo(fx, fy);
        } else {
          ctx.quadraticCurveTo((tip.x + fx) / 2, wy - 14, fx, fy);
        }
        ctx.stroke();

        if (game.phase === "waiting" || game.phase === "casting") {
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx, baitY());
          ctx.stroke();
          ctx.fillStyle = "#d8b25a";
          ctx.beginPath();
          ctx.arc(fx, baitY(), 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "#e8543f";
        ctx.beginPath();
        ctx.arc(fx, fy - 4, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f5f0e6";
        ctx.fillRect(fx - 1, fy - 1, 2, 6);

        if (game.phase === "fighting" && game.fight) {
          const progress = 1 - game.fight.distance / game.fight.startDistance;
          const fishX = lerp(game.castX, bankX + 60, Math.max(0, progress));
          const thrash = game.fight.surging ? 8 : 3;
          drawFish(
            {
              x: fishX,
              y: wy + 22 + Math.sin(game.t * 8) * thrash,
              vx: -30,
              size: Math.min(1.8, 0.8 + (game.fight.weight ?? 10) / 30),
              hue: 38,
              ghost: game.fight.spec.id === "ghost" || game.fight.spec.id === "firmino",
              wobble: game.t * 10,
              state: "flee",
              nibblesLeft: 0,
              nibbleTimer: 0,
            },
            night,
          );
        }
      }

      if (game.raining) {
        ctx.strokeStyle = "rgba(200,220,240,0.35)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 60; i++) {
          const rx = ((i * 61 + game.t * 340) % (W + 40)) - 20;
          const ry = (i * 37 + game.t * 560) % H;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 2, ry + 9);
          ctx.stroke();
        }
      }

      if (game.phase === "charging") {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(bankX - 116, wy - 130, 110, 12);
        ctx.fillStyle = game.power > 0.85 ? "#e8543f" : "#6fbf73";
        ctx.fillRect(bankX - 114, wy - 128, 106 * game.power, 8);
      }

      if (game.phase === "fighting" && game.fight) {
        const fight = game.fight;
        const barW = Math.min(320, W - 160);
        const barX = (W - barW) / 2;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(barX - 8, 14, barW + 16, 44);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(barX, 22, barW, 8);
        const tensionColor =
          fight.tension > 0.75 ? "#e8543f" : fight.tension > 0.5 ? "#e8a53f" : "#6fbf73";
        ctx.fillStyle = tensionColor;
        ctx.fillRect(barX, 22, barW * Math.min(1, fight.tension), 8);
        ctx.fillStyle = "#f5f0e6";
        ctx.font = '11px "Geist Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText(
          `TENSION · ${Math.round(fight.distance)}m OUT`,
          W / 2,
          48,
        );
      }

      ctx.textAlign = "left";
      ctx.font = '11px "Geist Mono", monospace';
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      const currentLevel = levelForXp(readStats().xp);
      ctx.fillText(
        `LV ${currentLevel} · ${titleForLevel(currentLevel).toUpperCase()}`,
        14,
        22,
      );
      ctx.textAlign = "right";
      ctx.fillText(
        `${night ? "NIGHT" : "DAY"}${game.raining ? " · RAIN" : ""}`,
        W - 14,
        22,
      );

      if (game.messageT > 0) {
        ctx.textAlign = "left";
        ctx.globalAlpha = Math.min(1, game.messageT);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        const metrics = ctx.measureText(game.message);
        ctx.fillRect(10, H - 40, metrics.width + 16, 22);
        ctx.fillStyle = "#f5f0e6";
        ctx.fillText(game.message, 18, H - 25);
        ctx.globalAlpha = 1;
      }

      const prompt = {
        idle: "HOLD to charge · release to cast",
        charging: "release to cast",
        casting: "",
        waiting: "wait for the take · CLICK to reel in",
        run: "STRIKE NOW",
        fighting: "HOLD to reel · release to give line",
        landed: "CLICK to cast again",
        lost: "CLICK to cast again",
      }[game.phase];
      if (prompt) {
        ctx.textAlign = "center";
        ctx.font =
          game.phase === "run"
            ? 'bold 16px "Geist Mono", monospace'
            : '11px "Geist Mono", monospace';
        ctx.fillStyle = game.phase === "run" ? "#e8543f" : "rgba(255,255,255,0.7)";
        ctx.fillText(prompt, W / 2, H - 12);
      }

      if (game.phase === "landed" && game.card) {
        const card = game.card;
        const panelW = Math.min(420, W - 60);
        const panelH = 150;
        const px = (W - panelW) / 2;
        const py = (game.H - panelH) / 2 - 10;
        ctx.fillStyle = "rgba(8,10,12,0.88)";
        ctx.fillRect(px, py, panelW, panelH);
        ctx.strokeStyle = card.legendary ? "#e8a53f" : "rgba(255,255,255,0.25)";
        ctx.lineWidth = card.legendary ? 2 : 1;
        ctx.strokeRect(px, py, panelW, panelH);
        ctx.textAlign = "center";
        ctx.fillStyle = card.legendary ? "#e8a53f" : "#f5f0e6";
        ctx.font = 'bold 15px "Geist Mono", monospace';
        ctx.fillText(
          card.title.toUpperCase() + (card.weightLabel ? ` · ${card.weightLabel}` : ""),
          W / 2,
          py + 34,
        );
        if (card.isPersonalBest) {
          ctx.fillStyle = "#6fbf73";
          ctx.font = 'bold 11px "Geist Mono", monospace';
          ctx.fillText("NEW PERSONAL BEST", W / 2, py + 54);
        }
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font = '12px "InterVariable", sans-serif';
        const words = card.flavor.split(" ");
        let line = "";
        let lineY = py + (card.isPersonalBest ? 76 : 64);
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > panelW - 40) {
            ctx.fillText(line, W / 2, lineY);
            line = word;
            lineY += 17;
          } else {
            line = test;
          }
        }
        ctx.fillText(line, W / 2, lineY);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = '11px "Geist Mono", monospace';
        ctx.fillText(`+${card.xp} XP`, W / 2, py + panelH - 16);
      }

      ctx.restore();
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  const caughtSpecies = CATCHES.filter((spec) => stats.carpdex[spec.id]);

  return (
    <div className="mt-10">
      <div ref={containerRef} className="relative">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label="Carp fishing game: a side-on view of a lake. Hold to charge a cast, click to strike when a fish takes the bait, then hold to reel it in."
          className="w-full touch-none rounded-xl outline-offset-4 select-none"
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <dl className="flex flex-wrap gap-x-8 gap-y-3 font-mono">
          <div>
            <dt className="text-xs tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Level
            </dt>
            <dd className="mt-1 text-base font-medium tabular-nums">
              {level} · {title}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              XP
            </dt>
            <dd className="mt-1 text-base font-medium tabular-nums">
              {xpIntoLevel}/{xpNeeded}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Session
            </dt>
            <dd className="mt-1 text-base font-medium tabular-nums">
              {session}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Personal best
            </dt>
            <dd className="mt-1 text-base font-medium tabular-nums">
              {stats.personalBest === null ? "—" : `${stats.personalBest}lb`}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => setMuted((value) => !value)}
          aria-pressed={muted}
          className="rounded-full border border-neutral-950/15 px-4 py-1.5 font-mono text-base hover:border-neutral-950/40 sm:text-sm dark:border-white/15 dark:hover:border-white/40"
        >
          {muted ? "Unmute alarm" : "Mute alarm"}
        </button>
      </div>

      {stats.weirdest && (
        <p className="mt-4 max-w-[60ch] font-mono text-base text-neutral-500 sm:text-sm dark:text-neutral-400">
          Weirdest catch to date: {stats.weirdest.toLowerCase()}.
        </p>
      )}

      <details className="mt-6 border-t border-neutral-950/10 pt-5 dark:border-white/10">
        <summary className="cursor-pointer font-mono text-sm font-medium tracking-wide text-neutral-500 uppercase hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
          The Carpdex ({caughtSpecies.length}/{CATCHES.length})
        </summary>
        <ul role="list" className="mt-4 space-y-2">
          {CATCHES.map((spec) => {
            const count = stats.carpdex[spec.id];
            return (
              <li
                key={spec.id}
                className="flex items-baseline justify-between gap-x-6 font-mono text-base sm:text-sm"
              >
                <span
                  className={
                    count
                      ? spec.kind === "legendary"
                        ? "text-accent"
                        : ""
                      : "text-neutral-400 dark:text-neutral-600"
                  }
                >
                  {count ? spec.name : "???"}
                </span>
                <span className="text-neutral-500 tabular-nums dark:text-neutral-400">
                  {count ?? 0}
                </span>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}
