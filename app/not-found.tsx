import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 sm:py-24">
      <main className="mx-auto max-w-2xl px-6">
        <p className="font-mono text-sm font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          404
        </p>
        <h1 className="mt-4 max-w-[24ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          This swim&apos;s empty.
        </h1>
        <p className="mt-6 max-w-[48ch] text-lg text-pretty text-neutral-600 dark:text-neutral-400">
          Whatever you were after isn&apos;t here. Nothing&apos;s biting on
          this page,
          but the lake next door is well stocked.
        </p>
        <ul role="list" className="mt-8 flex flex-wrap gap-x-6">
          <li className="font-mono text-base sm:text-sm">
            <Link
              href="/"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-accent dark:decoration-neutral-600 dark:hover:decoration-accent"
            >
              Back home
            </Link>
          </li>
          <li className="font-mono text-base sm:text-sm">
            <Link
              href="/fishing"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-accent dark:decoration-neutral-600 dark:hover:decoration-accent"
            >
              Have a cast
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
