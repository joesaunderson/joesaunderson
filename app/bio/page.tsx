import type { Metadata } from "next";
import Link from "next/link";
import { bioIntro, bioTldr, readme } from "../../data/bio";

export const metadata: Metadata = {
  title: "Bio",
  description:
    "The unabridged Joe Saunderson: bio, readme, quirks, watch outs, and how to work with me.",
};

export default function BioPage() {
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
            / bio
          </p>
          <h1 className="mt-4 max-w-[24ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            The unabridged version
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg text-pretty text-neutral-600 dark:text-neutral-400">
            {bioTldr}
          </p>
        </header>

        <section className="mt-16">
          <div className="space-y-5">
            {bioIntro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="max-w-[64ch] text-base/7 text-pretty text-neutral-700 dark:text-neutral-300"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-mono text-sm font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            Readme
          </h2>
          <p className="mt-6 max-w-[64ch] text-base/7 text-pretty text-neutral-700 dark:text-neutral-300">
            The section below is lifted from the readme I share with new
            colleagues: how I work, what to expect, and where I need help.
            Published here in the spirit of working in the open.
          </p>
          <div className="mt-12 space-y-14">
            {readme.map((section) => (
              <div key={section.heading}>
                <h3 className="text-xl font-semibold tracking-tight text-balance">
                  {section.heading}
                </h3>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="mt-4 max-w-[64ch] text-base/7 text-pretty text-neutral-700 dark:text-neutral-300"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul
                    role="list"
                    className="mt-4 max-w-[64ch] space-y-3 text-base/7 text-neutral-700 dark:text-neutral-300"
                  >
                    {section.items.map((item) => (
                      <li key={item.slice(0, 32)} className="flex gap-x-4">
                        <span
                          aria-hidden="true"
                          className="font-mono text-accent select-none"
                        >
                          &gt;
                        </span>
                        <span className="text-pretty">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-neutral-950/10 pt-8 dark:border-white/10">
          <p className="font-mono text-base text-neutral-500 sm:text-sm dark:text-neutral-400">
            <Link
              href="/"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-accent dark:decoration-neutral-600 dark:hover:decoration-accent"
            >
              Back home
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
