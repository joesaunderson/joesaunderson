"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

export function ScrollNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const section of SECTIONS) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="In-page navigation" className="mt-16 max-lg:hidden">
      <ul role="list" className="space-y-4">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`group flex items-center gap-x-4 font-mono text-xs tracking-wide uppercase ${
                  isActive
                    ? "text-accent"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-px transition-all ${
                    isActive
                      ? "w-16 bg-accent"
                      : "w-8 bg-ink/25 group-hover:w-16 group-hover:bg-ink/50"
                  }`}
                />
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
