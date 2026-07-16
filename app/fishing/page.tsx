import type { Metadata } from "next";
import Link from "next/link";
import { CarpGame } from "../../components/carp-game";

export const metadata: Metadata = {
  title: "Gone fishing",
  description: "A carp lake, a rod, and a suspiciously twitchy bobbin.",
  robots: { index: false },
};

export default function FishingPage() {
  return (
    <div className="py-16 sm:py-24">
      <main className="mx-auto max-w-2xl px-6">
        <header>
          <p className="font-mono text-sm font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            <Link
              href="/"
              className="hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Joe Saunderson
            </Link>{" "}
            / fishing
          </p>
          <h1 className="mt-4 max-w-[24ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            You found the lake.
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg text-pretty text-neutral-600 dark:text-neutral-400">
            This is where I am when the laptop lid is shut. Cast a line, wait
            for the bobbin, and strike when it flies. Just like production
            incidents, timing is everything.
          </p>
        </header>
        <CarpGame />
        <footer className="mt-20 border-t border-neutral-950/10 pt-8 dark:border-white/10">
          <p className="font-mono text-base text-neutral-500 sm:text-sm dark:text-neutral-400">
            <Link
              href="/"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-accent dark:decoration-neutral-600 dark:hover:decoration-accent"
            >
              Back to work
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
