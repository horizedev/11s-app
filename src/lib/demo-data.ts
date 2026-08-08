import type { Person } from "@/lib/types";

export const demoPeople: Person[] = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    role: "VP, Product",
    organization: "Northstar",
    relationship: "manager",
    cadence: "Every 2 weeks",
    nextMeetingAt: "2026-08-04T10:30:00",
    lastMeetingAt: "2026-07-21T10:30:00",
    notes:
      "Ask for feedback on the strategy narrative\nShare the early customer signals from Atlas\nClarify what success looks like for the Q3 review",
    color: "#6C63A8",
    discussions: [
      {
        id: "maya-jul-21",
        date: "2026-07-21T10:30:00",
        title: "Q3 priorities and product narrative",
        summary:
          "Aligned on narrowing the Q3 story to customer trust and adoption. Maya suggested leading with the decision we need rather than the project timeline.",
        topics: ["Q3 planning", "Strategy narrative", "Executive review"],
        followUps: [
          "Rewrite the first two slides around the customer decision",
          "Bring two adoption signals to the next review",
        ],
        mood: "positive",
      },
      {
        id: "maya-jul-07",
        date: "2026-07-07T10:30:00",
        title: "Scope, ownership, and visibility",
        summary:
          "Talked through where I should make calls independently and where Maya wants an early heads-up. Agreed to share a short Friday update.",
        topics: ["Ownership", "Communication", "Team visibility"],
        followUps: ["Send a three-bullet update on Fridays"],
        mood: "energized",
      },
    ],
    prepIdeas: [
      {
        id: "maya-prep-1",
        category: "Follow up",
        title: "Pressure-test the new strategy opening",
        rationale:
          "Maya previously asked for a decision-led narrative, so this closes the loop with something concrete.",
        prompt:
          "Does the revised opening make the decision clear enough for the executive team?",
      },
      {
        id: "maya-prep-2",
        category: "Alignment",
        title: "Define a strong Q3 review outcome",
        rationale:
          "Your note asks what success should look like; agreeing on it now will sharpen the preparation.",
        prompt:
          "At the end of the Q3 review, what do you most want the room to believe or decide?",
      },
      {
        id: "maya-prep-3",
        category: "Growth",
        title: "Ask for one piece of leadership feedback",
        rationale:
          "The current work creates a natural moment for focused feedback rather than a broad performance question.",
        prompt:
          "What is one thing I could do differently to lead this cross-functional work more effectively?",
      },
    ],
  },
  {
    id: "theo-williams",
    name: "Theo Williams",
    role: "Senior Product Designer",
    organization: "Northstar",
    relationship: "direct-report",
    cadence: "Weekly",
    nextMeetingAt: "2026-08-05T14:00:00",
    lastMeetingAt: "2026-07-29T14:00:00",
    notes:
      "Check how the research handoff felt\nMake space for the promotion conversation\nAsk what support would unblock the prototype",
    color: "#D26A4C",
    discussions: [
      {
        id: "theo-jul-29",
        date: "2026-07-29T14:00:00",
        title: "Research handoff and growth path",
        summary:
          "Theo is excited by the new concept but frustrated that research findings arrived after key design choices. We also opened the promotion conversation and agreed to make expectations specific.",
        topics: ["Research process", "Prototype", "Career growth"],
        followUps: [
          "Create a promotion expectations draft",
          "Invite Theo to the next research synthesis",
        ],
        mood: "neutral",
      },
      {
        id: "theo-jul-22",
        date: "2026-07-22T14:00:00",
        title: "Creative direction and workload",
        summary:
          "Reviewed the concept direction and removed two lower-value deliverables. Theo said the narrower scope felt much more achievable.",
        topics: ["Workload", "Creative direction", "Prioritization"],
        followUps: ["Protect Thursday afternoon for prototyping"],
        mood: "positive",
      },
    ],
    prepIdeas: [
      {
        id: "theo-prep-1",
        category: "Support",
        title: "Repair the research handoff",
        rationale:
          "The last conversation surfaced process friction that may continue unless the team agrees on a better handoff.",
        prompt:
          "What would an earlier, more useful research handoff look like for you next time?",
      },
      {
        id: "theo-prep-2",
        category: "Growth",
        title: "Make promotion evidence concrete",
        rationale:
          "Theo is ready for a specific growth conversation, and you committed to drafting expectations.",
        prompt:
          "Which promotion expectation feels clearest today, and which one needs more opportunities to demonstrate?",
      },
    ],
  },
  {
    id: "priya-shah",
    name: "Priya Shah",
    role: "Engineering Manager",
    organization: "Northstar",
    relationship: "peer",
    cadence: "Every 2 weeks",
    nextMeetingAt: "2026-08-06T15:30:00",
    lastMeetingAt: "2026-07-23T15:30:00",
    notes:
      "Compare notes on Atlas rollout risk\nDiscuss whether we need a shared decision log",
    color: "#2E8277",
    discussions: [
      {
        id: "priya-jul-23",
        date: "2026-07-23T15:30:00",
        title: "Atlas rollout and decision quality",
        summary:
          "Both teams are seeing uncertainty around rollout sequencing. Priya proposed a small pilot and asked for clearer product tradeoffs in writing.",
        topics: ["Atlas", "Rollout risk", "Decision-making"],
        followUps: ["Draft pilot guardrails", "Share the adoption dashboard"],
        mood: "positive",
      },
    ],
    prepIdeas: [
      {
        id: "priya-prep-1",
        category: "Alignment",
        title: "Agree on pilot guardrails",
        rationale:
          "A small pilot was the clearest shared path from your last discussion.",
        prompt:
          "What conditions would make us comfortable expanding the Atlas pilot?",
      },
      {
        id: "priya-prep-2",
        category: "Support",
        title: "Simplify cross-team decisions",
        rationale:
          "Your note about a shared decision log could reduce repeated alignment work for both teams.",
        prompt:
          "Where are our teams losing the most context between a decision and its execution?",
      },
    ],
  },
  {
    id: "jonah-lee",
    name: "Jonah Lee",
    role: "Founder",
    organization: "Fieldwork",
    relationship: "friend",
    cadence: "Monthly",
    nextMeetingAt: "2026-08-08T11:00:00",
    lastMeetingAt: "2026-07-04T11:00:00",
    notes:
      "Ask how the first two hires are settling in\nRemember to ask about the Kyoto trip\nShare the book on creative routines",
    color: "#3F6FA3",
    discussions: [
      {
        id: "jonah-jul-04",
        date: "2026-07-04T11:00:00",
        title: "Growing the team without losing focus",
        summary:
          "Jonah was preparing to hire his first two employees and thinking about how much structure to introduce. We also planned a late-summer hike.",
        topics: ["First hires", "Founder energy", "Hiking"],
        followUps: ["Send the creative routines book", "Pick a hike date"],
        mood: "energized",
      },
    ],
    prepIdeas: [
      {
        id: "jonah-prep-1",
        category: "Follow up",
        title: "Check in on the first hires",
        rationale:
          "This was the biggest transition Jonah was navigating when you last caught up.",
        prompt:
          "What has surprised you most about having the first two people on the team?",
      },
      {
        id: "jonah-prep-2",
        category: "Personal",
        title: "Make room for life outside work",
        rationale:
          "Your note about Kyoto is an easy way to keep the conversation from becoming only a founder update.",
        prompt: "What are you most looking forward to about Kyoto?",
      },
    ],
  },
  {
    id: "elena-rossi",
    name: "Elena Rossi",
    role: "Chief Product Officer",
    organization: "Lumio",
    relationship: "mentor",
    cadence: "Monthly",
    nextMeetingAt: "2026-08-18T09:00:00",
    lastMeetingAt: "2026-07-14T09:00:00",
    notes:
      "Bring the career options I am weighing\nAsk how she evaluates a stretch role\nUpdate her on the strategy review",
    color: "#9C5F80",
    discussions: [
      {
        id: "elena-jul-14",
        date: "2026-07-14T09:00:00",
        title: "Choosing the right kind of stretch",
        summary:
          "Elena encouraged me to distinguish between a bigger title and a role that builds the operating skills I want. She suggested writing down the next two capabilities to develop.",
        topics: ["Career direction", "Leadership range", "Operating skills"],
        followUps: ["Write two capabilities to develop next"],
        mood: "energized",
      },
    ],
    prepIdeas: [
      {
        id: "elena-prep-1",
        category: "Growth",
        title: "Test the career options against capabilities",
        rationale:
          "Elena’s prior advice gives you a clear framework for making the next conversation useful.",
        prompt:
          "Which option would best build the two capabilities I want next, and what might I be underestimating?",
      },
    ],
  },
  {
    id: "sam-okafor",
    name: "Sam Okafor",
    role: "Product Manager",
    organization: "Northstar",
    relationship: "direct-report",
    cadence: "Weekly",
    nextMeetingAt: "2026-08-10T13:00:00",
    lastMeetingAt: "2026-07-27T13:00:00",
    notes:
      "Celebrate the onboarding experiment result\nCheck workload after Lina's leave",
    color: "#A37A2F",
    discussions: [
      {
        id: "sam-jul-27",
        date: "2026-07-27T13:00:00",
        title: "Onboarding experiment and team capacity",
        summary:
          "The onboarding experiment is showing a promising lift. Sam is proud of the result but covering extra coordination while Lina is away.",
        topics: ["Experiment results", "Team capacity", "Recognition"],
        followUps: ["Share the experiment result at product review"],
        mood: "positive",
      },
    ],
    prepIdeas: [
      {
        id: "sam-prep-1",
        category: "Support",
        title: "Check the cost of covering extra work",
        rationale:
          "Sam is carrying additional coordination, and the impact may not be visible from the positive experiment result.",
        prompt:
          "What has felt hardest to keep moving while you cover for Lina, and what can we pause?",
      },
    ],
  },
];

export function freshDemoPeople() {
  return structuredClone(demoPeople);
}
