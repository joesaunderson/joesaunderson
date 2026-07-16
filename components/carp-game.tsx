"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Phase = "idle" | "waiting" | "strike" | "caught" | "missed";

const STRIKE_WINDOW_MS = 800;
const PB_STORAGE_KEY = "carp-personal-best";

const SPECIES = ["mirror", "common", "leather", "ghost"];

let pbListeners: (() => void)[] = [];

function subscribeToPersonalBest(listener: () => void): () => void {
  pbListeners.push(listener);
  return () => {
    pbListeners = pbListeners.filter((l) => l !== listener);
  };
}

function readPersonalBest(): string | null {
  return localStorage.getItem(PB_STORAGE_KEY);
}

function writePersonalBest(weight: string): void {
  localStorage.setItem(PB_STORAGE_KEY, weight);
  for (const listener of pbListeners) listener();
}

function randomCarp(): { species: string; weight: string } {
  const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
  const weight = (8 + Math.random() * 34).toFixed(1);
  return { species, weight };
}

export function CarpGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [carp, setCarp] = useState<{ species: string; weight: string } | null>(
    null,
  );
  const [caught, setCaught] = useState(0);
  const personalBest = useSyncExternalStore(
    subscribeToPersonalBest,
    readPersonalBest,
    () => null,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const cast = () => {
    setPhase("waiting");
    setCarp(null);
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setPhase("strike");
      timeoutRef.current = setTimeout(
        () => setPhase("missed"),
        STRIKE_WINDOW_MS,
      );
    }, delay);
  };

  const strike = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const landed = randomCarp();
    setCarp(landed);
    setCaught((count) => count + 1);
    setPhase("caught");
    if (personalBest === null || Number(landed.weight) > Number(personalBest)) {
      writePersonalBest(landed.weight);
    }
  };

  const handleClick = () => {
    if (phase === "waiting") return;
    if (phase === "strike") {
      strike();
    } else {
      cast();
    }
  };

  const message = {
    idle: "The lake is flat calm. Nobody else around.",
    waiting: "Watching the water…",
    strike: "The bobbin's flying. HIT IT!",
    caught: carp
      ? `In the net: ${carp.weight}lb of ${carp.species} carp. Released gently, obviously.`
      : "",
    missed: "Gone. They always know.",
  }[phase];

  const buttonLabel = {
    idle: "Cast a line",
    waiting: "Wait for it…",
    strike: "STRIKE",
    caught: "Cast again",
    missed: "Cast again",
  }[phase];

  return (
    <div className="mt-10">
      <p
        aria-live="polite"
        className="min-h-14 max-w-[48ch] text-lg text-pretty text-neutral-700 dark:text-neutral-300"
      >
        {message}
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={phase === "waiting"}
        className={`mt-6 rounded-full px-6 py-3 font-mono text-base font-medium sm:text-sm ${
          phase === "strike"
            ? "bg-accent text-white dark:text-neutral-950"
            : "bg-neutral-950 text-white hover:bg-neutral-800 disabled:cursor-default disabled:bg-neutral-950/60 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:disabled:bg-white/60"
        }`}
      >
        {buttonLabel}
      </button>
      <dl className="mt-10 flex gap-x-12 border-t border-neutral-950/10 pt-6 font-mono dark:border-white/10">
        <div>
          <dt className="text-xs tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            Session
          </dt>
          <dd className="mt-1 text-lg font-medium tabular-nums">{caught}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            Personal best
          </dt>
          <dd className="mt-1 text-lg font-medium tabular-nums">
            {personalBest === null ? "—" : `${personalBest}lb`}
          </dd>
        </div>
      </dl>
    </div>
  );
}
