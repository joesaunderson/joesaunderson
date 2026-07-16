export const profile = {
  name: "Joe Saunderson",
  role: "Head of Engineering at Mention Me",
  location: "Kent, UK",
  email: "joesaunderson@me.com",
  github: "https://github.com/joesaunderson",
  tagline:
    "I build products at pace, measure everything, and occasionally catch fish.",
};

export const about = [
  "By day I run engineering at Mention Me, a referral and advocacy platform in London. \"Run\" is doing light work there: I'm responsible for a 12-engineer org, but 70% of my week is still shipping, and I'm disappointed if I don't get three to five PRs out in a day. I won't run an org I couldn't code in.",
  "I joined on the literal first day of UK lockdown in March 2020 and spent my first 18 months having met only the founders in person. Since then I've gone from software engineer to tech lead to Head of Engineering, and spent the last year rebuilding our entire development lifecycle around AI agents. Output per engineer has roughly tripled. Yes, I measured it.",
  "Away from the keyboard I'm a long-suffering (recently less suffering) Liverpool FC fan, dad to two daughters, and a carp angler of moderate distinction. I live in Kent, I'm usually online from 8am to 8pm, and I vanish for school runs: I like being the dad who's always there while I can be.",
];

export type Role = {
  title: string;
  company: string;
  period: string;
  summary: string;
  tech: string[];
};

export const career: Role[] = [
  {
    title: "Head of Engineering",
    company: "Mention Me",
    period: "2026–now",
    summary:
      "Responsible for a 12-engineer org, but 70% of my week is still shipping. Rearchitected the platform from PHP monolith to a Next.js stack in six weeks, rebuilt the development lifecycle around agentic AI, and present engineering and AI strategy to the board.",
    tech: ["Claude Code", "MCP", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    title: "Technical Lead",
    company: "Mention Me",
    period: "2020–2026",
    summary:
      "Built Mention Me Influencer from zero in a team of three: first revenue in eight weeks, tens of B2B clients within six months. Led a team of four full-stack engineers with end-to-end ownership of their problem space.",
    tech: ["React", "TypeScript", "GraphQL", "PHP", "Symfony", "AWS"],
  },
  {
    title: "Software Engineer",
    company: "Influential Software",
    period: "2019–2020",
    summary:
      "Client work across React, TypeScript and PHP. Migrated the CI/CD estate to a containerised, parallelised system and cut build times by 75%.",
    tech: ["React", "TypeScript", "PHP", "Docker"],
  },
  {
    title: "Software Developer",
    company: "Jobs in Kent",
    period: "2017–2019",
    summary:
      "Joined as a junior straight from university; promoted within the year. Lead developer on the full redesign and relaunch of jobsinkent.com.",
    tech: ["Symfony", "PHP", "MySQL"],
  },
  {
    title: "Placement Engineer",
    company: "IBM Kenexa",
    period: "2014–2015",
    summary:
      "Recruitment platforms for blue-chip global clients. Nominated for Placement Student of the Year; contract extended by four months.",
    tech: [],
  },
];

export const education =
  "BSc Multimedia Computing, University of Westminster. First Class Honours, 2017.";

export type Project = {
  name: string;
  url?: string;
  description: string;
};

export const projects: Project[] = [
  {
    name: "Prioboard",
    url: "https://prioboard.app",
    description:
      "A prioritisation lens on Linear: teams pull in initiatives, score them async with RICE-style frameworks, reveal with divergence analysis, and publish the ranking back. Live SaaS with free and paid plans.",
  },
  {
    name: "PostHog",
    url: "https://github.com/PostHog/posthog",
    description:
      "Contributor to the open-source product analytics platform I also run in production.",
  },
  {
    name: "BetHero",
    description:
      "Models the probability of sports betting market outcomes from live data feeds.",
  },
];
