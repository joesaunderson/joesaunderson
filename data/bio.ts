export const bioTldr = "TL;DR: I like to get shit done.";

export const bioIntro = [
  "I'm a long-suffering (but recently less suffering) Liverpool FC fan who spends his free time with my young family, at the carp lake fishing, tackling DIY projects around the house, or shipping my side project, Prioboard.",
  "I live in Kent with my wife and our two daughters. We got properly married in Spain in June 2026, the best decision we ever made, second only to the buffet choices. While I'm usually online from 8am to 8pm, you'll find me offline for a bit around school drop-offs and pick-ups: I like being the dad who's always there while I can be.",
  "My first day at Mention Me was March 2020, literally the first day of UK lockdown. I spent my first 18 months having only met the founders in person. I've been here since, progressing from software engineer to tech lead to Head of Engineering, though I still very much consider myself an IC who just happens to run the org. Before Mention Me, I was in consulting.",
  "Apparently no bio is complete without a joke, but I'm legally required to note there's no J-O-K-E without J-O-E. I am a dad, after all.",
];

export type BioSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

export const readme: BioSection[] = [
  {
    heading: "Areas of responsibility",
    paragraphs: [
      "I'm responsible for our 12-engineer org: focus, priority, output, hiring, and presenting engineering and AI strategy to the board. If a product manager does the \"what\" and the \"why\", I deal with the \"how\", although with the modern world of AI I see these roles merging a lot more, and I'm thoroughly enjoying speaking to customers to get involved earlier in the lifecycle. Despite the title, I try to spend most of my time shipping code, roughly 70% of my week, and I am disappointed if I don't ship three to five PRs in a day. I won't run an org I couldn't code in.",
      "The last year has been our AI-first transformation: I rebuilt our development lifecycle around agentic tooling (Claude Code, MCP, internal agent skills), built the Mention Me MCP server, and shipped 30+ agent skills now used daily by Sales, Customer Success and Marketing. Output per engineer has roughly tripled, and yes, I measured it.",
      "I'm a full-stack at heart who can work on anything from infrastructure to frontend. Lately I've been enjoying Next.js, Tailwind, shadcn and the various platform-as-a-service providers cropping up and solving individual problems, like Clerk for auth and Neon for databases. We rearchitected our platform from PHP monolith to exactly that stack in six weeks.",
    ],
  },
  {
    heading: "A day in the life",
    paragraphs: [
      "My typical day is dodging around meetings and trying to get code shipped. I prioritise work myself, focused on the current goal. I try to keep one or two logs in the river to avoid a jam, and would recommend others do too. I don't like to go too deep planning things: I'd rather spend that time discovering as the rocket prepares for takeoff. In an ideal world, roughly 85% of my time is spent coding, 15% everything else. These days the org needs a bit more of me than the ideal world allows, so it lands nearer 70/30. I guard that number.",
    ],
  },
  {
    heading: "Facts",
    items: [
      "I have a CS degree but am self-taught on most of the more recent technology pieces",
      "I'm a full-stack generalist who can take on anything from infra all the way to frontend, but I lean to the frontend as my specialty",
      "My superpower is breaking down hurdles and getting shit done, but I can get frustrated if people don't move out of the way or we don't go fast enough",
      "I'm known as the guy who experiments, hacks away, and delivers things fast",
      "I'm extremely data-driven. You might find me breaking down your assumption with data; this isn't me being rude, this is just how I think",
      "I prefer greenfield projects and building new things",
      "I'm a \"ship it and iterate\" person, big time",
      "I can be extremely sarcastic, a realist, and say it how it is. I can come across as direct and blunt, which you may interpret as rude, but it's never my intention",
      "I listen to an absurdly wide range of music while coding, from country to James Blunt to drum and bass. Don't judge",
      "I have perfectionist tendencies which drive quality but can also mean I set expectations that feel daunting to others",
    ],
  },
  {
    heading: "Quirks",
    items: [
      "I work best when given a high-level goal and left to figure it out. I like solving problems, not implementing solutions",
      "I over-index on Slack. I'm freakishly fast to reply, and I will bombard you with messages (sorry in advance). This is just the way my brain works: I use Slack as a running commentary. Call me out if this annoys you",
      "I may be seen as moving too fast and leaving people behind, and I can come across as impatient when I just want to get going",
      "I might chase you for reviews or decisions. This isn't me being rude; this is me being stuck and wanting to move forward",
      "I don't like positive feedback for myself. I find it pointless (a pat on the back). I like constructive feedback: how could I have done better?",
      "I'm not naturally wired for patience, consensus-building, or slowing down for feelings. I'm actively working on this; help me by flagging when I need to shift gears",
      "I can slip into overwork mode and forget to switch off. My family keeps me grounded: those school runs aren't just logistics, they're my reset button",
    ],
  },
  {
    heading: "Watch outs",
    items: [
      "Listening: I can rush to solutions without fully hearing all perspectives. Call me out if I'm not listening",
      "Patience: I move fast and can get impatient with slower processes or people who need more time to think things through",
      "Appearing abrupt: my directness can sometimes land harder than intended. It's never personal",
      "Work obsession: I can over-index on work and forget to switch off. Remind me to take breaks",
    ],
  },
  {
    heading: "How I work",
    paragraphs: [
      "Give me autonomy and space to ship. I like quick decisions, not \"we'll decide on this in a meeting next Tuesday, then let you know by Friday.\" When I give feedback, I'll try to deliver it with a story: \"Next time you do X, try Y.\"",
    ],
  },
  {
    heading: "Strong opinions",
    items: [
      "Most meetings don't need to be meetings",
      "Give me a PR over an idea; lead with code",
      "An agent should be doing this, and if it isn't, that's a backlog item",
    ],
  },
  {
    heading: "How I can help you",
    paragraphs: [
      "I'm open to all forms of help, but I may route you to someone else if I think they can help you quicker (increasingly, that someone is an agent I can point you at). Come find me for technical unblocking, architecture discussions, or just getting unstuck.",
    ],
  },
  {
    heading: "How you can help me",
    items: [
      "Give me autonomy and trust to figure things out",
      "Make decisions quickly; don't make me wait until next week's meeting",
      "Review my PRs fast. I'll chase you if I'm blocked; it's not personal",
      "Give me clear direction, but not prescriptive solutions",
      "Don't overthink the problem or over-engineer something that might not even stick",
      "Skip the long meetings",
      "Be direct with feedback. Tell me how I could have done better, not just what went well, and frame it around the work rather than questioning my competence directly; I can get defensive about that",
      "Help me slow down when needed. I naturally move at pace and may miss important details or people's concerns",
      "Tell me if I'm not listening. I can jump to solutions before fully hearing you out",
      "Remind me that feelings matter too. I'm data-driven and logical, but I value being reminded when emotional and people factors should weigh more heavily",
    ],
  },
];
