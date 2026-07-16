export const profile = {
  name: "Joe Saunderson",
  role: "Head of Engineering",
  company: "Mention Me",
  location: "Kent, UK",
  email: "joesaunderson@me.com",
  github: "https://github.com/joesaunderson",
  tagline:
    "I run engineering at Mention Me and still ship 70% of the time. TL;DR: I like to get shit done.",
};

export const about = [
  "My first day at Mention Me was March 2020, literally the first day of UK lockdown; I spent my first 18 months having only met the founders in person. I've been there since, progressing from software engineer to tech lead to Head of Engineering, though I still very much consider myself an IC who just happens to run the org. I won't run an org I couldn't code in.",
  "The last year has been our AI-first transformation: I rebuilt our development lifecycle around agentic tooling, built the Mention Me MCP server, and shipped an internal platform of 30+ agent skills used daily by Sales, Customer Success and Marketing. Output per engineer has roughly tripled, and yes, I measured it.",
  "Away from the keyboard I'm a long-suffering (recently less suffering) Liverpool FC fan. I live in Kent with my wife and our two daughters, and while I'm usually online from 8am to 8pm, you'll find me offline around school drop-offs and pick-ups: I like being the dad who's always there while I can be. Otherwise I'm at the carp lake or renovating the house, learning each trade badly before learning it properly.",
  "Apparently no bio is complete without a joke, but I'm legally required to note there's no J-O-K-E without J-O-E. I'm a dad, after all.",
];

export const opinions = [
  "Most meetings don't need to be meetings",
  "Give me a PR over an idea; lead with code",
  "An agent should be doing this, and if it isn't, that's a backlog item",
  "Ship it and iterate",
];

export type Role = {
  title: string;
  company: string;
  period: string;
  summary: string;
};

export const career: Role[] = [
  {
    title: "Head of Engineering",
    company: "Mention Me",
    period: "2026–now",
    summary:
      "Responsible for a 12-engineer org, but 70% of my week is still shipping. Rearchitected the platform from PHP monolith to a Next.js stack in six weeks, rebuilt the development lifecycle around agentic AI, and present engineering and AI strategy to the board.",
  },
  {
    title: "Technical Lead",
    company: "Mention Me",
    period: "2020–2026",
    summary:
      "Built Mention Me Influencer from zero in a team of three: first revenue in eight weeks, tens of B2B clients within six months. Led a team of four full-stack engineers with end-to-end ownership of their problem space. React, TypeScript, GraphQL, PHP/Symfony, AWS.",
  },
  {
    title: "Software Engineer",
    company: "Influential Software",
    period: "2019–2020",
    summary:
      "Client work across React, TypeScript and PHP. Migrated the CI/CD estate to a containerised, parallelised system and cut build times by 75%.",
  },
  {
    title: "Software Developer",
    company: "Jobs in Kent",
    period: "2017–2019",
    summary:
      "Joined as a junior straight from university; promoted within the year. Lead developer on the full redesign and relaunch of jobsinkent.com.",
  },
  {
    title: "Placement Engineer",
    company: "IBM Kenexa",
    period: "2014–2015",
    summary:
      "Recruitment platforms for blue-chip global clients. Nominated for Placement Student of the Year; contract extended by four months.",
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
