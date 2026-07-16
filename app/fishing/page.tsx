import type { Metadata } from "next";
import Link from "next/link";
import { CarpGame } from "../../components/carp-game/carp-game";

export const metadata: Metadata = {
  title: "Gone fishing",
  description:
    "A fully operational carp lake. Day and night, rain, herons, legendary fish, and a shopping trolley.",
  robots: { index: false },
};

export default function FishingPage() {
  return (
    <div className="py-16 sm:py-24">
      <main className="mx-auto max-w-3xl px-6">
        <header>
          <p className="font-mono text-sm font-medium tracking-wide text-ink-muted uppercase">
            <Link
              href="/"
              className="hover:text-ink"
            >
              Joe Saunderson
            </Link>{" "}
            / fishing
          </p>
          <h1 className="mt-4 max-w-[24ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            You found the lake.
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg text-pretty text-ink-muted">
            This is where I am when the laptop lid is shut. Hold to charge a
            cast, strike when the alarm screams, then keep the tension out of
            the red. The lake is infinite. The lake is mostly carp. Mostly.
          </p>
        </header>
        <CarpGame />
        <footer className="mt-20 border-t border-ink/10 pt-8">
          <p className="font-mono text-base text-ink-muted sm:text-sm">
            <Link
              href="/"
              className="underline decoration-ink/25 underline-offset-4 hover:decoration-accent"
            >
              Back to work
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
