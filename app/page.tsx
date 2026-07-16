import {
  about,
  career,
  education,
  opinions,
  profile,
  projects,
} from "../data/site";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-sm font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
      {children}
    </h2>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600 dark:decoration-neutral-600 dark:hover:decoration-neutral-300"
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <div className="py-16 sm:py-24">
      <main className="mx-auto max-w-2xl px-6">
        <header>
          <p className="font-mono text-sm font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
            {profile.role} · {profile.company} · {profile.location}
          </p>
          <h1 className="mt-4 max-w-[24ch] text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-[48ch] text-lg text-pretty text-neutral-600 dark:text-neutral-400">
            {profile.tagline}
          </p>
          <ul role="list" className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            <li className="font-mono text-base sm:text-sm">
              <ExternalLink href={profile.github}>GitHub</ExternalLink>
            </li>
            <li className="font-mono text-base sm:text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600 dark:decoration-neutral-600 dark:hover:decoration-neutral-300"
              >
                Email
              </a>
            </li>
          </ul>
        </header>

        <section className="mt-20 sm:mt-24">
          <SectionHeading>About</SectionHeading>
          <div className="mt-6 space-y-5">
            {about.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="max-w-[64ch] text-base/7 text-pretty text-neutral-700 dark:text-neutral-300"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <SectionHeading>Strong opinions</SectionHeading>
          <ul
            role="list"
            className="mt-6 max-w-[64ch] space-y-3 text-base/7 text-neutral-700 dark:text-neutral-300"
          >
            {opinions.map((opinion) => (
              <li key={opinion} className="flex gap-x-4">
                <span
                  aria-hidden="true"
                  className="font-mono text-neutral-400 select-none dark:text-neutral-600"
                >
                  &gt;
                </span>
                {opinion}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 sm:mt-24">
          <SectionHeading>Career</SectionHeading>
          <ol
            role="list"
            className="mt-2 divide-y divide-neutral-950/5 dark:divide-white/10"
          >
            {career.map((role) => (
              <li
                key={`${role.title} ${role.period}`}
                className="grid gap-y-2 py-8 first:pt-6 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-x-8"
              >
                <p className="font-mono text-base text-neutral-500 tabular-nums sm:text-sm/6 dark:text-neutral-400">
                  {role.period}
                </p>
                <div>
                  <h3 className="text-base font-semibold">
                    {role.title}{" "}
                    <span className="font-normal text-neutral-500 dark:text-neutral-400">
                      · {role.company}
                    </span>
                  </h3>
                  <p className="mt-2 max-w-[60ch] text-base/7 text-pretty text-neutral-700 sm:text-sm/6 dark:text-neutral-300">
                    {role.summary}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[64ch] border-t border-neutral-950/5 pt-6 font-mono text-base text-neutral-500 sm:text-sm/6 dark:border-white/10 dark:text-neutral-400">
            {education}
          </p>
        </section>

        <section className="mt-20 sm:mt-24">
          <SectionHeading>Side projects</SectionHeading>
          <ul
            role="list"
            className="mt-2 divide-y divide-neutral-950/5 dark:divide-white/10"
          >
            {projects.map((project) => (
              <li key={project.name} className="py-8 first:pt-6 last:pb-0">
                <h3 className="text-base font-semibold">
                  {project.url ? (
                    <ExternalLink href={project.url}>
                      {project.name}
                    </ExternalLink>
                  ) : (
                    project.name
                  )}
                </h3>
                <p className="mt-2 max-w-[60ch] text-base/7 text-pretty text-neutral-700 sm:text-sm/6 dark:text-neutral-300">
                  {project.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-20 border-t border-neutral-950/10 pt-8 sm:mt-24 dark:border-white/10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-4">
            <p className="font-mono text-base text-neutral-500 sm:text-sm dark:text-neutral-400">
              © {new Date().getFullYear()} {profile.name}
            </p>
            <ul role="list" className="flex flex-wrap gap-x-6">
              <li className="font-mono text-base sm:text-sm">
                <ExternalLink href={profile.github}>GitHub</ExternalLink>
              </li>
              <li className="font-mono text-base sm:text-sm">
                <ExternalLink href="https://prioboard.app">
                  Prioboard
                </ExternalLink>
              </li>
              <li className="font-mono text-base sm:text-sm">
                <ExternalLink href="https://github.com/joesaunderson/joesaunderson">
                  Source
                </ExternalLink>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
}
