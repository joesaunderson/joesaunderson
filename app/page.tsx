import Link from "next/link";
import { ScrollNav } from "../components/scroll-nav";
import { about, career, education, profile, projects } from "../data/site";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-sm font-medium tracking-wide text-neutral-500 uppercase lg:sr-only dark:text-neutral-400">
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
      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-accent dark:decoration-neutral-600 dark:hover:decoration-accent"
    >
      {children}
    </a>
  );
}

function TechList({ tech }: { tech: string[] }) {
  if (tech.length === 0) return null;
  return (
    <ul role="list" className="mt-4 flex flex-wrap gap-2">
      {tech.map((item) => (
        <li
          key={item}
          className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:flex lg:gap-x-20">
      <header className="pt-16 sm:pt-24 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-2/5 lg:flex-col lg:justify-between lg:py-24">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-pretty">{profile.role}</p>
          <p className="mt-4 max-w-[36ch] text-lg text-pretty text-neutral-600 dark:text-neutral-400">
            {profile.tagline}
          </p>
          <ScrollNav />
        </div>
        <ul
          role="list"
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2 lg:mt-0"
        >
          <li className="font-mono text-base sm:text-sm">
            <ExternalLink href={profile.github}>GitHub</ExternalLink>
          </li>
          <li className="font-mono text-base sm:text-sm">
            <a
              href={`mailto:${profile.email}`}
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-accent dark:decoration-neutral-600 dark:hover:decoration-accent"
            >
              Email
            </a>
          </li>
          <li className="font-mono text-base sm:text-sm">
            <Link
              href="/bio"
              className="underline decoration-neutral-300 underline-offset-4 hover:decoration-accent dark:decoration-neutral-600 dark:hover:decoration-accent"
            >
              Full bio
            </Link>
          </li>
        </ul>
      </header>

      <main className="pb-16 lg:w-3/5 lg:py-24">
        <section id="about" className="scroll-mt-16 pt-16 sm:pt-24 lg:pt-0">
          <SectionHeading>About</SectionHeading>
          <div className="mt-6 space-y-5 lg:mt-0">
            {about.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="max-w-[64ch] text-base/7 text-pretty text-neutral-700 dark:text-neutral-300"
              >
                {paragraph}
              </p>
            ))}
            <p className="max-w-[64ch] text-base/7 text-pretty text-neutral-700 dark:text-neutral-300">
              If you want the unabridged version, there&apos;s a{" "}
              <Link
                href="/bio"
                className="underline decoration-neutral-300 underline-offset-4 hover:decoration-accent dark:decoration-neutral-600 dark:hover:decoration-accent"
              >
                full bio
              </Link>
              . If you&apos;d rather poke around: this site has at least three
              easter eggs, and the browser console is a good place to start.
            </p>
          </div>
        </section>

        <section id="experience" className="scroll-mt-16 pt-20 sm:pt-24">
          <SectionHeading>Experience</SectionHeading>
          <ol
            role="list"
            className="mt-2 divide-y divide-neutral-950/5 lg:mt-0 dark:divide-white/10"
          >
            {career.map((role, index) => (
              <li
                key={`${role.title} ${role.period}`}
                className={`grid gap-y-2 py-8 last:pb-0 sm:grid-cols-[9rem_1fr] sm:gap-x-8 ${
                  index === 0 ? "pt-6 lg:pt-0" : ""
                }`}
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
                  <TechList tech={role.tech} />
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[64ch] border-t border-neutral-950/5 pt-6 font-mono text-base text-neutral-500 sm:text-sm/6 dark:border-white/10 dark:text-neutral-400">
            {education}
          </p>
        </section>

        <section id="projects" className="scroll-mt-16 pt-20 sm:pt-24">
          <SectionHeading>Projects</SectionHeading>
          <ul
            role="list"
            className="mt-2 divide-y divide-neutral-950/5 lg:mt-0 dark:divide-white/10"
          >
            {projects.map((project, index) => (
              <li
                key={project.name}
                className={`py-8 last:pb-0 ${index === 0 ? "pt-6 lg:pt-0" : ""}`}
              >
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
            <ul role="list" className="flex flex-wrap items-baseline gap-x-6">
              <li className="font-mono text-base sm:text-sm">
                <ExternalLink href="https://github.com/joesaunderson/joesaunderson">
                  Source
                </ExternalLink>
              </li>
              <li className="font-mono text-base sm:text-sm">
                <Link
                  href="/fishing"
                  aria-label="Gone fishing"
                  className="text-neutral-400 hover:text-accent dark:text-neutral-600 dark:hover:text-accent"
                >
                  {"><> "}
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
}
