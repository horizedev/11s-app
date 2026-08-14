import type { Locale } from "@/lib/i18n/types";
import type { Relationship } from "@/lib/types";

export const PERSONA_SLUGS = [
  "professionals",
  "people-managers",
  "fresh-grads",
  "professional-network",
  "family-friends",
] as const;

export type PersonaSlug = (typeof PERSONA_SLUGS)[number];

type StoryContact = {
  initials: string;
  name: string;
  role: string;
  relationship: Relationship;
  color: string;
  timing: string;
};

export type PersonaStory = {
  person: {
    name: string;
    role: string;
    initials: string;
    color: string;
  };
  eyebrow: string;
  hero: {
    title: string;
    accent: string;
    body: string;
    goalLabel: string;
    goal: string;
  };
  tension: {
    label: string;
    title: string;
    body: string;
  };
  chapters: Array<{
    label: string;
    title: string;
    body: string;
    outcome: string;
  }>;
  workspace: {
    label: string;
    meetingTitle: string;
    meetingMeta: string;
    meetingStatus: string;
    contacts: StoryContact[];
    activeContact: StoryContact;
    context: string[];
    notes: string[];
    lead: {
      label: string;
      title: string;
      prompt: string;
    };
    supports: Array<{
      label: string;
      title: string;
      prompt: string;
    }>;
    history: {
      label: string;
      title: string;
      date: string;
      summary: string;
    };
    privacy: string;
  };
  outcome: {
    label: string;
    title: string;
    body: string;
    metrics: Array<{ value: string; label: string }>;
  };
  quote: string;
};

export const PERSONA_METADATA: Record<
  PersonaSlug,
  { title: string; description: string }
> = {
  professionals: {
    title: "Olivia's promotion-path story",
    description:
      "How a product lead uses 11s to turn recurring manager conversations into a concrete path to broader scope.",
  },
  "people-managers": {
    title: "Daniel's manager story",
    description:
      "How an engineering manager uses 11s to make each direct-report 1:1 more thoughtful, specific, and actionable.",
  },
  "fresh-grads": {
    title: "Nia's first-network story",
    description:
      "How a new graduate uses 11s to turn a coffee chat with an alum into a clear next step.",
  },
  "professional-network": {
    title: "Caleb's network story",
    description:
      "How an independent strategist uses 11s to make informal conversations across a wider network compound.",
  },
  "family-friends": {
    title: "Mina's friendship story",
    description:
      "How a busy designer uses 11s to show up more thoughtfully for the people she loves.",
  },
};

const stories: Record<Locale, Record<PersonaSlug, PersonaStory>> = {
  en: {
    professionals: {
      person: {
        name: "Olivia Chen",
        role: "Product lead · Northstar",
        initials: "OC",
        color: "#6C63A8",
      },
      eyebrow: "Career-driven professional",
      hero: {
        title: "I stopped leaving my career story to chance.",
        accent: "One prepared 1:1 at a time.",
        body:
          "I lead a product team, but I used to leave my manager meetings with a vague “keep doing great work.” 11s gave me a private place to connect outcomes, feedback, and the next ask—before the conversation happened.",
        goalLabel: "My goal",
        goal: "Make the path to director concrete before the next planning cycle.",
      },
      tension: {
        label: "The tension",
        title: "I had the work. I did not yet have the narrative.",
        body:
          "My wins lived across launch docs, meeting notes, and half-finished tabs. When Maya asked what I wanted next, I could describe ambition—but not the evidence, scope, or support that would make it real.",
      },
      chapters: [
        {
          label: "Chapter 01",
          title: "I captured the signals while they were still fresh.",
          body:
            "After each launch, I added the decision, the outcome, and the people who saw it. My brag doc stopped being a quarterly rescue project and became a quiet record of scope.",
          outcome: "A living case for my next level",
        },
        {
          label: "Chapter 02",
          title: "I prepared one question worth answering.",
          body:
            "Before my 1:1, 11s brought my notes, past feedback, and career direction together. I chose a career intent, refined the lead question, and kept two supports ready—not a script.",
          outcome: "A focused, human conversation",
        },
        {
          label: "Chapter 03",
          title: "I left with a definition of “ready.”",
          body:
            "Maya named the cross-functional scope and sponsorship evidence that mattered. I logged it immediately, routed one need to my mentor, and turned a hopeful conversation into a plan.",
          outcome: "Clear proof points for the next cycle",
        },
      ],
      workspace: {
        label: "Olivia's private 11s workspace",
        meetingTitle: "Prepare for Maya · Career growth",
        meetingMeta: "Manager 1:1 · Thursday at 10:00",
        meetingStatus: "Lead ready",
        contacts: [
          {
            initials: "MC",
            name: "Maya Chen",
            role: "VP Product",
            relationship: "manager",
            color: "#6C63A8",
            timing: "Tomorrow",
          },
          {
            initials: "RV",
            name: "Ravi Verma",
            role: "Design director",
            relationship: "mentor",
            color: "#2E8277",
            timing: "8d ago",
          },
          {
            initials: "EB",
            name: "Elena Brooks",
            role: "Engineering lead",
            relationship: "peer",
            color: "#D26A4C",
            timing: "12d ago",
          },
        ],
        activeContact: {
          initials: "MC",
          name: "Maya Chen",
          role: "VP Product",
          relationship: "manager",
          color: "#6C63A8",
          timing: "Tomorrow",
        },
        context: [
          "Goal · Director track",
          "Win · Led Q2 launch across 4 teams",
          "Need · Sponsorship for broader scope",
        ],
        notes: [
          "Connect the launch outcome to the next-level scope.",
          "Ask which evidence Maya would want to see by planning.",
          "Name Ravi as a possible sponsor for the operating review.",
        ],
        lead: {
          label: "Lead question",
          title: "Make the next-level path tangible",
          prompt:
            "What evidence of director-level scope would make the strongest case in the next planning cycle?",
        },
        supports: [
          {
            label: "Support",
            title: "Connect work to evidence",
            prompt:
              "Which launch outcomes should we put on the table as proof of readiness?",
          },
          {
            label: "Support",
            title: "Turn support into a next step",
            prompt:
              "Who else should see this work before the operating review?",
          },
        ],
        history: {
          label: "Last conversation",
          title: "Q2 launch debrief",
          date: "12 days ago",
          summary:
            "Maya highlighted Olivia's cross-functional judgment and asked her to make the next scope visible earlier.",
        },
        privacy:
          "Only Olivia's notes, history, and chosen career context are used for this prep.",
      },
      outcome: {
        label: "What changed",
        title: "My manager no longer has to guess what I am building toward.",
        body:
          "I walk into 1:1s with a clear ask, the proof behind it, and a record of what we agreed to. Every conversation now makes the next one more useful.",
        metrics: [
          { value: "1", label: "clear career ask" },
          { value: "3", label: "proof points in context" },
          { value: "2", label: "people ready to help" },
        ],
      },
      quote:
        "11s helps me bring the right evidence into the room without turning my manager into a project tracker.",
    },
    "people-managers": {
      person: {
        name: "Daniel Ortiz",
        role: "Engineering manager · Vela",
        initials: "DO",
        color: "#D26A4C",
      },
      eyebrow: "團隊主管",
      hero: {
        title: "I made 1:1s feel like a place to grow—not report status.",
        accent: "One person, one honest thread at a time.",
        body:
          "I manage seven engineers. I could remember the sprint, but not always the thread behind a person's confidence, ambition, or blocker. 11s gave me a humane memory between meetings.",
        goalLabel: "My goal",
        goal: "Help Aisha move toward staff scope without losing the human side of the relationship.",
      },
      tension: {
        label: "The tension",
        title: "My team deserved more than a better status update.",
        body:
          "Aisha was delivering, but her confidence dipped whenever the roadmap changed. I wanted to coach her toward broader influence—not keep rediscovering the same uncertainty every other Thursday.",
      },
      chapters: [
        {
          label: "Chapter 01",
          title: "I kept a thread, not a surveillance log.",
          body:
            "After each 1:1, I saved only what would make me a better manager next time: the risk she named, the experiment she wanted to try, and the support I had promised.",
          outcome: "Continuity without status theater",
        },
        {
          label: "Chapter 02",
          title: "I chose a coaching intent before I walked in.",
          body:
            "11s turned our prior notes into a lead question, a growth support, and a stall card. I could be present while still having enough structure to ask the harder thing.",
          outcome: "A clearer, calmer 1:1",
        },
        {
          label: "Chapter 03",
          title: "We turned uncertainty into a visible experiment.",
          body:
            "Aisha chose to lead the architecture review with a partner. I logged the commitment, carried it into the next prep, and made room to celebrate the result—not just the delivery date.",
          outcome: "More confidence through real scope",
        },
      ],
      workspace: {
        label: "Daniel's private 11s workspace",
        meetingTitle: "Prepare for Aisha · Growth conversation",
        meetingMeta: "Direct-report 1:1 · Friday at 14:30",
        meetingStatus: "Coaching thread ready",
        contacts: [
          {
            initials: "AK",
            name: "Aisha Khan",
            role: "Senior engineer",
            relationship: "direct-report",
            color: "#D26A4C",
            timing: "Friday",
          },
          {
            initials: "JS",
            name: "Jonah Stein",
            role: "Engineering manager",
            relationship: "peer",
            color: "#3F6FA3",
            timing: "3d ago",
          },
          {
            initials: "PT",
            name: "Priya Tan",
            role: "Staff engineer",
            relationship: "mentor",
            color: "#2E8277",
            timing: "9d ago",
          },
        ],
        activeContact: {
          initials: "AK",
          name: "Aisha Khan",
          role: "Senior engineer",
          relationship: "direct-report",
          color: "#D26A4C",
          timing: "Friday",
        },
        context: [
          "Growth · Staff-level influence",
          "Signal · Strong systems judgment",
          "Promise · Pair on architecture review",
        ],
        notes: [
          "Ask how the roadmap shift landed for her.",
          "Make the architecture-review role concrete.",
          "Follow up on the cross-team partner she chose.",
        ],
        lead: {
          label: "Lead question",
          title: "Make broader influence feel reachable",
          prompt:
            "What would make leading the architecture review feel like a meaningful next step—not just another meeting?",
        },
        supports: [
          {
            label: "Support",
            title: "Name the strength",
            prompt:
              "Where have you already shown the judgment we want to make more visible?",
          },
          {
            label: "Support",
            title: "Remove the blocker",
            prompt:
              "What support from me would make this experiment feel safe enough to try?",
          },
        ],
        history: {
          label: "Last conversation",
          title: "Finding the right stretch",
          date: "14 days ago",
          summary:
            "Aisha wanted bigger technical influence but worried that the roadmap reset had narrowed her options.",
        },
        privacy:
          "Daniel keeps only the relationship context that helps him show up as a better manager.",
      },
      outcome: {
        label: "What changed",
        title: "Our 1:1s now compound instead of restarting every two weeks.",
        body:
          "Aisha can see that I remember the work and the person behind it. I can coach more specifically, make promises visible, and follow through without a spreadsheet full of people.",
        metrics: [
          { value: "7", label: "people held with care" },
          { value: "1", label: "growth experiment in motion" },
          { value: "0", label: "status-only check-ins" },
        ],
      },
      quote:
        "The preparation is private, but the result is a more present manager in the room.",
    },
    "fresh-grads": {
      person: {
        name: "Nia Bose",
        role: "New graduate · Design & research",
        initials: "NB",
        color: "#2E8277",
      },
      eyebrow: "Fresh grad",
      hero: {
        title: "I turned one coffee chat into a real opening.",
        accent: "Prepared curiosity, not a rehearsed pitch.",
        body:
          "Early in my search, I treated every alum conversation like a high-stakes interview. 11s helped me remember the person, find one sincere question, and leave enough room for an actual connection.",
        goalLabel: "My goal",
        goal: "Learn how Ruth made the transition from research to product—and earn a thoughtful next conversation.",
      },
      tension: {
        label: "The tension",
        title: "I had questions, but they were too broad to be useful.",
        body:
          "I would open with “Do you have advice for a new grad?” and hope for magic. I needed a better way to turn what I had already learned about someone into a specific, generous conversation.",
      },
      chapters: [
        {
          label: "Chapter 01",
          title: "I collected context before asking for time.",
          body:
            "I saved Ruth's portfolio focus, the class we shared, and a research piece I genuinely admired. My notes became a reason to reach out—not a pile of facts.",
          outcome: "A warmer invitation",
        },
        {
          label: "Chapter 02",
          title: "I prepared for curiosity, not perfection.",
          body:
            "11s suggested a lead question about her transition, plus two supports for the moments after the answer. I had a place to return to if nerves made my mind go blank.",
          outcome: "A conversation that could breathe",
        },
        {
          label: "Chapter 03",
          title: "I followed up with the detail that mattered.",
          body:
            "Ruth mentioned a research community I should join. I logged it, thanked her with a specific note, and made the next conversation about what I learned after acting on her advice.",
          outcome: "A relationship, not a transaction",
        },
      ],
      workspace: {
        label: "Nia's private 11s workspace",
        meetingTitle: "Prepare for Ruth · Coffee chat",
        meetingMeta: "Alumni conversation · Tuesday at 16:00",
        meetingStatus: "Warm opener ready",
        contacts: [
          {
            initials: "RW",
            name: "Ruth Wu",
            role: "Product researcher",
            relationship: "mentor",
            color: "#2E8277",
            timing: "Tuesday",
          },
          {
            initials: "AM",
            name: "Avery Moore",
            role: "Campus recruiter",
            relationship: "peer",
            color: "#6C63A8",
            timing: "6d ago",
          },
          {
            initials: "LO",
            name: "Leo Ortiz",
            role: "Classmate",
            relationship: "peer",
            color: "#D26A4C",
            timing: "Yesterday",
          },
        ],
        activeContact: {
          initials: "RW",
          name: "Ruth Wu",
          role: "Product researcher",
          relationship: "mentor",
          color: "#2E8277",
          timing: "Tuesday",
        },
        context: [
          "Background · Human-computer interaction",
          "Interest · Research that changes product decisions",
          "Need · Find a first product-research team",
        ],
        notes: [
          "Mention Ruth's field-study piece on first-time creators.",
          "Ask what helped her move from research to product.",
          "Follow up on the community she recommends.",
        ],
        lead: {
          label: "Lead question",
          title: "Learn from a path I can see myself on",
          prompt:
            "When you were moving from research into product, which early choices made the biggest difference?",
        },
        supports: [
          {
            label: "Support",
            title: "Make the advice actionable",
            prompt:
              "If you were building a first-year learning plan today, what would you include?",
          },
          {
            label: "Support",
            title: "Close with care",
            prompt:
              "Is there a community or person whose work would be useful for me to follow next?",
          },
        ],
        history: {
          label: "Last conversation",
          title: "Introduction from Professor Lee",
          date: "2 days ago",
          summary:
            "Nia noted the shared course and the research article that made Ruth feel like the right person to learn from.",
        },
        privacy:
          "Nia chooses exactly which background and goals help make the coffee chat more specific.",
      },
      outcome: {
        label: "What changed",
        title: "I now leave every coffee chat with a next step I can own.",
        body:
          "I am not trying to win a referral in 20 minutes. I am building a network through thoughtful questions, remembered details, and a follow-up that proves I listened.",
        metrics: [
          { value: "1", label: "specific question" },
          { value: "2", label: "natural supports" },
          { value: "1", label: "earned follow-up" },
        ],
      },
      quote:
        "11s gives me something steadier than confidence: a reason to be genuinely curious.",
    },
    "professional-network": {
      person: {
        name: "Caleb Morgan",
        role: "Independent strategist · Fieldwork",
        initials: "CM",
        color: "#3F6FA3",
      },
      eyebrow: "Professional network",
      hero: {
        title: "I gave my weak ties a reason to remember me.",
        accent: "Less networking. More continuity.",
        body:
          "Most of my best work comes through people I see only occasionally: former clients, conference friends, alumni, and collaborators. 11s helps me carry the small details that make a casual chat worth having.",
        goalLabel: "My goal",
        goal: "Reconnect with Samir before the design-systems meetup and open a useful collaboration thread.",
      },
      tension: {
        label: "The tension",
        title: "My network was wide, but my memory was shallow.",
        body:
          "I could recognize a name and still forget the project, the personal update, or the offer I had made. That made follow-ups feel either generic or overdue.",
      },
      chapters: [
        {
          label: "Chapter 01",
          title: "I saved the thread, not just the contact.",
          body:
            "After a conference chat, I wrote down the client problem Samir was exploring, the community event he cared about, and the article we disagreed about.",
          outcome: "A reason to reconnect",
        },
        {
          label: "Chapter 02",
          title: "I let context create the opening.",
          body:
            "The context bank reminded me that I had just finished a related service-design sprint. 11s gave me an opener that was timely, relevant, and easy to make my own.",
          outcome: "A message with an actual point of view",
        },
        {
          label: "Chapter 03",
          title: "I kept the relationship warm after the event.",
          body:
            "When Samir introduced me to a founder, I logged the connection and sent the resource I promised. The next meeting started with momentum instead of polite reintroduction.",
          outcome: "A network that compounds",
        },
      ],
      workspace: {
        label: "Caleb's private 11s workspace",
        meetingTitle: "Prepare for Samir · Reconnect",
        meetingMeta: "Design-systems meetup · Wednesday at 18:30",
        meetingStatus: "Contextual opener ready",
        contacts: [
          {
            initials: "SP",
            name: "Samir Patel",
            role: "Platform lead",
            relationship: "peer",
            color: "#3F6FA3",
            timing: "Wednesday",
          },
          {
            initials: "EI",
            name: "Elise Ingram",
            role: "Founder",
            relationship: "peer",
            color: "#D26A4C",
            timing: "18d ago",
          },
          {
            initials: "MO",
            name: "Maya Ortiz",
            role: "Creative director",
            relationship: "peer",
            color: "#6C63A8",
            timing: "7d ago",
          },
        ],
        activeContact: {
          initials: "SP",
          name: "Samir Patel",
          role: "Platform lead",
          relationship: "peer",
          color: "#3F6FA3",
          timing: "Wednesday",
        },
        context: [
          "Work · Finished a service-design sprint",
          "Shared thread · Design systems for internal tools",
          "Promise · Send the research synthesis template",
        ],
        notes: [
          "Ask how the internal-tools pilot changed after the reorg.",
          "Share the service-design pattern from the latest sprint.",
          "Offer the research synthesis template after the meetup.",
        ],
        lead: {
          label: "Lead question",
          title: "Reconnect around a real shared thread",
          prompt:
            "How did the internal-tools pilot change after the reorg—and where is the design system helping most now?",
        },
        supports: [
          {
            label: "Support",
            title: "Offer useful context",
            prompt:
              "I just finished a similar sprint—would a short synthesis template be useful to compare notes?",
          },
          {
            label: "Support",
            title: "Make the next connection easy",
            prompt:
              "Who else at the meetup is thinking about this problem from a different angle?",
          },
        ],
        history: {
          label: "Last conversation",
          title: "Post-conference follow-up",
          date: "5 weeks ago",
          summary:
            "Samir was testing a smaller design-system team after a reorg and wanted examples from complex internal products.",
        },
        privacy:
          "Caleb keeps relationship context private, then decides what belongs in the actual conversation.",
      },
      outcome: {
        label: "What changed",
        title: "I no longer have to choose between being casual and being prepared.",
        body:
          "The details help me show up like I remember the person, not like I am mining a contact list. That makes introductions, collaborations, and light follow-ups feel natural.",
        metrics: [
          { value: "1", label: "relevant opening" },
          { value: "1", label: "promise kept" },
          { value: "3", label: "threads carried forward" },
        ],
      },
      quote:
        "The best networkers remember what mattered. 11s gives me a way to do that with care.",
    },
    "family-friends": {
      person: {
        name: "Mina Park",
        role: "Designer, sister, and friend",
        initials: "MP",
        color: "#9C5F80",
      },
      eyebrow: "Family and friends",
      hero: {
        title: "I made room for the conversations that matter at home.",
        accent: "A warmer way to stay close.",
        body:
          "Work is full of calendars. The people I love rarely are. 11s gives me a quiet place to remember what a friend was carrying, what my brother was excited about, and how to begin without pretending no time has passed.",
        goalLabel: "My goal",
        goal: "Show up for Tara after a hard month without making our catch-up feel like an interview.",
      },
      tension: {
        label: "The tension",
        title: "I cared deeply, but busy life kept making me start from zero.",
        body:
          "Weeks would pass. I would remember that something important had happened, but not the details. The fear of getting it wrong made the first message harder than it needed to be.",
      },
      chapters: [
        {
          label: "Chapter 01",
          title: "I saved the small things that made a big difference.",
          body:
            "After our last walk, I wrote down the gallery Tara wanted to visit, the family decision she was weighing, and the joke that made her laugh when things felt heavy.",
          outcome: "A gentler return",
        },
        {
          label: "Chapter 02",
          title: "I prepared a warm opening, not an agenda.",
          body:
            "I chose a catch-up intent and let 11s surface one sincere way in, plus a support if the conversation went deeper. The structure stayed in the background.",
          outcome: "Less pressure, more presence",
        },
        {
          label: "Chapter 03",
          title: "I remembered to follow through after the call.",
          body:
            "Tara mentioned the gallery date again. I logged it and sent a note two days later with a time that worked. The care did not end when the call did.",
          outcome: "Closeness built through small follow-through",
        },
      ],
      workspace: {
        label: "Mina's private 11s workspace",
        meetingTitle: "Prepare for Tara · Catch up",
        meetingMeta: "Long-distance call · Sunday at 19:00",
        meetingStatus: "Warm opening ready",
        contacts: [
          {
            initials: "TL",
            name: "Tara Lin",
            role: "Longtime friend",
            relationship: "friend",
            color: "#9C5F80",
            timing: "Sunday",
          },
          {
            initials: "JP",
            name: "Jon Park",
            role: "Brother",
            relationship: "friend",
            color: "#3F6FA3",
            timing: "4d ago",
          },
          {
            initials: "AD",
            name: "Ana Diaz",
            role: "Former roommate",
            relationship: "friend",
            color: "#2E8277",
            timing: "16d ago",
          },
        ],
        activeContact: {
          initials: "TL",
          name: "Tara Lin",
          role: "Longtime friend",
          relationship: "friend",
          color: "#9C5F80",
          timing: "Sunday",
        },
        context: [
          "Life · Tara is weighing a family decision",
          "Joy · The neighborhood gallery show",
          "Follow-through · Offer two dates for a visit",
        ],
        notes: [
          "Start with the gallery artist she sent last month.",
          "Ask how the family decision is feeling—not whether it is solved.",
          "Send two possible visit dates after the call.",
        ],
        lead: {
          label: "Lead question",
          title: "Make space without forcing an answer",
          prompt:
            "I have been thinking about the gallery artist you sent—how have you been feeling about everything else you were carrying then?",
        },
        supports: [
          {
            label: "Support",
            title: "Let her set the depth",
            prompt:
              "Would it feel good to talk about it, or should we save that space for another day?",
          },
          {
            label: "Support",
            title: "Turn care into a plan",
            prompt:
              "Could I make the next few weeks easier by putting a gallery day on the calendar now?",
          },
        ],
        history: {
          label: "Last conversation",
          title: "A long walk after work",
          date: "3 weeks ago",
          summary:
            "Tara shared a difficult family decision and lit up when she talked about a small gallery show nearby.",
        },
        privacy:
          "Mina's personal notes stay private and are only there to help her be more thoughtful.",
      },
      outcome: {
        label: "What changed",
        title: "I can be thoughtful without making the relationship feel managed.",
        body:
          "11s holds the details so I can hold the person. I show up warmer, remember what matters, and keep the small promises that make closeness last.",
        metrics: [
          { value: "1", label: "warmer way in" },
          { value: "2", label: "gentle supports" },
          { value: "1", label: "promise to keep" },
        ],
      },
      quote:
        "It is not about tracking friends. It is about making sure care survives a busy life.",
    },
  },
  "zh-TW": {
    professionals: {
      person: {
        name: "Olivia Chen",
        role: "產品主管 · Northstar",
        initials: "OC",
        color: "#6C63A8",
      },
      eyebrow: "想推進職涯的專業人士",
      hero: {
        title: "我不再把自己的職涯故事交給運氣。",
        accent: "從每一次有準備的一對一開始。",
        body:
          "我帶著產品團隊，卻曾經每次和主管開完會，只得到一句模糊的「繼續做得很好」。11s 給了我一個私密空間，在對話前把成果、回饋和下一個提問接在一起。",
        goalLabel: "我的目標",
        goal: "在下個規劃週期前，把通往總監職位的路談具體。",
      },
      tension: {
        label: "卡住的地方",
        title: "我有成果，卻還沒有說得清楚的職涯敘事。",
        body:
          "我的亮點散落在上線文件、會議筆記和沒整理完的分頁裡。當 Maya 問我下一步想要什麼，我能說出企圖心，卻說不清哪些證據、影響範圍和支持能讓它成真。",
      },
      chapters: [
        {
          label: "第一章",
          title: "我在訊號還新鮮時就把它記下來。",
          body:
            "每次上線後，我寫下做了什麼決策、產生什麼結果，以及誰看見了。成果紀錄不再是每季臨時補救，而是一份持續累積的影響力證明。",
          outcome: "一份活著的升遷論證",
        },
        {
          label: "第二章",
          title: "我只準備一個值得被好好回答的問題。",
          body:
            "一對一前，11s 把筆記、過去的回饋和職涯方向整理在一起。我選擇職涯意圖、微調主問題，備好兩條延伸，而不是帶著腳本進場。",
          outcome: "聚焦又自然的對話",
        },
        {
          label: "第三章",
          title: "我帶著「準備好了」的定義離開。",
          body:
            "Maya 說清楚什麼樣的跨團隊影響力與推薦證據最重要。我立刻記下來、把一個需求交給導師，讓原本充滿期待的對話變成可執行的計畫。",
          outcome: "下個週期要準備的明確證據",
        },
      ],
      workspace: {
        label: "Olivia 的私人 11s 工作區",
        meetingTitle: "為 Maya 準備 · 職涯成長",
        meetingMeta: "和主管一對一 · 星期四 10:00",
        meetingStatus: "主問題就緒",
        contacts: [
          {
            initials: "MC",
            name: "Maya Chen",
            role: "產品副總裁",
            relationship: "manager",
            color: "#6C63A8",
            timing: "明天",
          },
          {
            initials: "RV",
            name: "Ravi Verma",
            role: "設計總監",
            relationship: "mentor",
            color: "#2E8277",
            timing: "8 天前",
          },
          {
            initials: "EB",
            name: "Elena Brooks",
            role: "工程主管",
            relationship: "peer",
            color: "#D26A4C",
            timing: "12 天前",
          },
        ],
        activeContact: {
          initials: "MC",
          name: "Maya Chen",
          role: "產品副總裁",
          relationship: "manager",
          color: "#6C63A8",
          timing: "明天",
        },
        context: [
          "目標 · 走向總監職位",
          "成果 · 帶領 4 個團隊完成第二季上線",
          "需求 · 爭取更大影響範圍的推薦",
        ],
        notes: [
          "把上線成果連到更高一級的影響範圍。",
          "問 Maya 在規劃前想看到哪些證據。",
          "把 Ravi 列為營運檢討前可能的推薦人。",
        ],
        lead: {
          label: "主問題",
          title: "把下一級的路談具體",
          prompt: "下個規劃週期裡，哪些總監級影響範圍的證據最有說服力？",
        },
        supports: [
          {
            label: "延伸",
            title: "把工作連到證據",
            prompt: "哪些上線成果最該放上桌，證明我已經準備好了？",
          },
          {
            label: "延伸",
            title: "把支持變成下一步",
            prompt: "在營運檢討前，還有誰應該看見這份工作？",
          },
        ],
        history: {
          label: "上次對話",
          title: "第二季上線回顧",
          date: "12 天前",
          summary: "Maya 肯定 Olivia 的跨團隊判斷，也提醒她更早讓下一步的影響範圍被看見。",
        },
        privacy: "這次準備只會使用 Olivia 選擇的筆記、紀錄與職涯脈絡。",
      },
      outcome: {
        label: "改變的是",
        title: "我的主管不再需要猜我正在往哪裡走。",
        body:
          "我帶著清楚的提問、背後的證據，以及我們同意的下一步進到每次一對一。每段對話都讓下一次更有用。",
        metrics: [
          { value: "1", label: "明確職涯提問" },
          { value: "3", label: "已納入的證據" },
          { value: "2", label: "能幫上忙的人" },
        ],
      },
      quote: "11s 幫我把對的證據帶進現場，卻不會把主管變成專案追蹤器。",
    },
    "people-managers": {
      person: {
        name: "Daniel Ortiz",
        role: "工程經理 · Vela",
        initials: "DO",
        color: "#D26A4C",
      },
      eyebrow: "People manager",
      hero: {
        title: "我讓一對一成為成長的地方，而不只是進度回報。",
        accent: "一個人、一條真實主線，慢慢往前。",
        body:
          "我管理七位工程師。我記得 sprint，卻不一定記得每個人的信心、企圖心或卡點。11s 成了兩次會議之間，一份更有人味的記憶。",
        goalLabel: "我的目標",
        goal: "幫 Aisha 往 Staff 級影響力前進，也不失去這段關係的溫度。",
      },
      tension: {
        label: "卡住的地方",
        title: "我的團隊值得的不只是一份更好的進度報告。",
        body:
          "Aisha 一直有產出，但每次路線圖調整，她的信心就會動搖。我想陪她練習更大的影響力，而不是每隔一個星期四又重新理解一次同樣的不安。",
      },
      chapters: [
        {
          label: "第一章",
          title: "我留下的是主線，不是監控紀錄。",
          body:
            "每次一對一後，我只記那些能讓下次的我成為更好主管的內容：她說出的風險、想嘗試的實驗，以及我答應提供的支持。",
          outcome: "連續性，而不是進度表演",
        },
        {
          label: "第二章",
          title: "進場前，我先選好教練式意圖。",
          body:
            "11s 把前次筆記變成一個主問題、一條成長延伸和一張冷場備援。我可以專心在現場，也有足夠結構去問更困難的事。",
          outcome: "更清楚、更平靜的一對一",
        },
        {
          label: "第三章",
          title: "我們把不確定，變成看得見的實驗。",
          body:
            "Aisha 選擇和夥伴一起主導架構檢討。我記下承諾、帶進下一次準備，也留出空間慶祝結果，而不只看交付日期。",
          outcome: "透過真實範圍建立信心",
        },
      ],
      workspace: {
        label: "Daniel 的私人 11s 工作區",
        meetingTitle: "為 Aisha 準備 · 成長對話",
        meetingMeta: "和直屬部屬一對一 · 星期五 14:30",
        meetingStatus: "教練主線就緒",
        contacts: [
          {
            initials: "AK",
            name: "Aisha Khan",
            role: "資深工程師",
            relationship: "direct-report",
            color: "#D26A4C",
            timing: "星期五",
          },
          {
            initials: "JS",
            name: "Jonah Stein",
            role: "工程經理",
            relationship: "peer",
            color: "#3F6FA3",
            timing: "3 天前",
          },
          {
            initials: "PT",
            name: "Priya Tan",
            role: "Staff 工程師",
            relationship: "mentor",
            color: "#2E8277",
            timing: "9 天前",
          },
        ],
        activeContact: {
          initials: "AK",
          name: "Aisha Khan",
          role: "資深工程師",
          relationship: "direct-report",
          color: "#D26A4C",
          timing: "星期五",
        },
        context: [
          "成長 · Staff 級影響力",
          "訊號 · 很強的系統判斷",
          "承諾 · 一起準備架構檢討",
        ],
        notes: [
          "問她這次路線圖調整對她的影響。",
          "把架構檢討裡的角色談具體。",
          "跟進她選擇的跨團隊夥伴。",
        ],
        lead: {
          label: "主問題",
          title: "讓更大的影響力變得可觸及",
          prompt: "什麼能讓主導架構檢討感覺像有意義的下一步，而不只是又一場會議？",
        },
        supports: [
          {
            label: "延伸",
            title: "說出她的強項",
            prompt: "你在哪些地方已經展現出我們想讓更多人看見的判斷力？",
          },
          {
            label: "延伸",
            title: "拿掉阻礙",
            prompt: "我可以提供什麼支持，讓你覺得這個實驗足夠安全、可以試試看？",
          },
        ],
        history: {
          label: "上次對話",
          title: "找到合適的伸展",
          date: "14 天前",
          summary: "Aisha 想建立更大的技術影響力，但擔心路線圖重設後，選項變少了。",
        },
        privacy: "Daniel 只保留能幫他成為更好主管的關係脈絡。",
      },
      outcome: {
        label: "改變的是",
        title: "我們的一對一不再每兩週重新開始。",
        body:
          "Aisha 看得見我記得她的工作，也記得她這個人。我能給更具體的教練式支持，讓承諾被看見並真正跟進。",
        metrics: [
          { value: "7", label: "被好好記得的人" },
          { value: "1", label: "正在進行的成長實驗" },
          { value: "0", label: "只談進度的 check-in" },
        ],
      },
      quote: "準備是私人的，但結果是我在現場成為一位更專注的主管。",
    },
    "fresh-grads": {
      person: {
        name: "Nia Bose",
        role: "新鮮人 · 設計與研究",
        initials: "NB",
        color: "#2E8277",
      },
      eyebrow: "新鮮人",
      hero: {
        title: "我把一次咖啡聊天，變成真的機會。",
        accent: "準備好好奇心，而不是背好自我推銷。",
        body:
          "剛開始找工作時，我把每次和校友的對話都當成高壓面試。11s 幫我記得這個人、找到一個真誠的問題，並為真正的連結留下空間。",
        goalLabel: "我的目標",
        goal: "理解 Ruth 如何從研究走進產品，並爭取下一次有意義的對話。",
      },
      tension: {
        label: "卡住的地方",
        title: "我有很多問題，卻都太大、太難真的回答。",
        body:
          "我總是以「你有給新鮮人的建議嗎？」開場，然後期待奇蹟。我需要更好的方式，把我已經了解的資訊變成具體又有分寸的對話。",
      },
      chapters: [
        {
          label: "第一章",
          title: "在開口前，我先收集有用的脈絡。",
          body:
            "我記下 Ruth 的作品集方向、我們一起修過的課，以及我真心欣賞的一篇研究。筆記成了我主動聯絡的理由，不是一堆資料。",
          outcome: "更溫暖的邀請",
        },
        {
          label: "第二章",
          title: "我準備的是好奇心，不是完美表現。",
          body:
            "11s 為她的轉換經驗提出主問題，也準備兩條延伸問題。緊張讓腦袋空白時，我還是有一個可以回來的地方。",
          outcome: "能呼吸的對話",
        },
        {
          label: "第三章",
          title: "我用最重要的細節去跟進。",
          body:
            "Ruth 提到一個我該加入的研究社群。我記下來、發了一封具體的感謝訊息，下一次對話就從我真的採取行動後學到什麼開始。",
          outcome: "一段關係，而不是一次交易",
        },
      ],
      workspace: {
        label: "Nia 的私人 11s 工作區",
        meetingTitle: "為 Ruth 準備 · 咖啡聊天",
        meetingMeta: "和校友對話 · 星期二 16:00",
        meetingStatus: "自然開場就緒",
        contacts: [
          {
            initials: "RW",
            name: "Ruth Wu",
            role: "產品研究員",
            relationship: "mentor",
            color: "#2E8277",
            timing: "星期二",
          },
          {
            initials: "AM",
            name: "Avery Moore",
            role: "校園招募",
            relationship: "peer",
            color: "#6C63A8",
            timing: "6 天前",
          },
          {
            initials: "LO",
            name: "Leo Ortiz",
            role: "同學",
            relationship: "peer",
            color: "#D26A4C",
            timing: "昨天",
          },
        ],
        activeContact: {
          initials: "RW",
          name: "Ruth Wu",
          role: "產品研究員",
          relationship: "mentor",
          color: "#2E8277",
          timing: "星期二",
        },
        context: [
          "背景 · 人機互動",
          "興趣 · 讓研究改變產品決策",
          "需求 · 找到第一個產品研究團隊",
        ],
        notes: [
          "提到 Ruth 寫的初次創作者田野研究。",
          "問她從研究走到產品的過程。",
          "跟進她推薦的社群。",
        ],
        lead: {
          label: "主問題",
          title: "從一條我看得到的路學習",
          prompt: "你當初從研究走進產品時，哪些早期選擇帶來最大的差別？",
        },
        supports: [
          {
            label: "延伸",
            title: "讓建議能執行",
            prompt: "如果你現在要為自己安排第一年的學習計畫，會放進哪些事？",
          },
          {
            label: "延伸",
            title: "溫暖地收尾",
            prompt: "有沒有哪個社群或人的作品，會很適合我接下來持續關注？",
          },
        ],
        history: {
          label: "上次對話",
          title: "Professor Lee 的介紹",
          date: "2 天前",
          summary: "Nia 記下共同的課程，以及讓她覺得 Ruth 很值得請教的那篇研究。",
        },
        privacy: "Nia 自己決定哪些背景與目標能幫咖啡聊天更具體。",
      },
      outcome: {
        label: "改變的是",
        title: "現在每次咖啡聊天結束，我都有一個能自己完成的下一步。",
        body:
          "我不是想在二十分鐘裡贏得內推。我是透過有心的提問、記得的細節與證明我有聽進去的跟進，慢慢建立人脈。",
        metrics: [
          { value: "1", label: "具體提問" },
          { value: "2", label: "自然延伸" },
          { value: "1", label: "值得再聊的下一步" },
        ],
      },
      quote: "11s 給我的不是虛假的自信，而是一個穩定、真誠地好奇的理由。",
    },
    "professional-network": {
      person: {
        name: "Caleb Morgan",
        role: "獨立策略師 · Fieldwork",
        initials: "CM",
        color: "#3F6FA3",
      },
      eyebrow: "專業人脈",
      hero: {
        title: "我讓淡一點的人脈，也有理由記得我。",
        accent: "少一點 networking，多一點延續。",
        body:
          "我最好的工作常來自偶爾才見到的人：前客戶、活動認識的朋友、校友與合作夥伴。11s 幫我留住那些讓一場輕鬆聊天有價值的小細節。",
        goalLabel: "我的目標",
        goal: "在設計系統聚會前重新聯絡 Samir，開啟一條有用的合作主線。",
      },
      tension: {
        label: "卡住的地方",
        title: "我的人脈很廣，記憶卻很淺。",
        body:
          "我記得名字，卻常忘了那個專案、個人近況，或我答應過什麼。讓跟進不是變得太泛，就是拖得太久。",
      },
      chapters: [
        {
          label: "第一章",
          title: "我記下的是主線，不只是聯絡人。",
          body:
            "活動聊天後，我寫下 Samir 正在研究的客戶問題、他在意的社群活動，以及我們意見不同的一篇文章。",
          outcome: "一個重新聯絡的理由",
        },
        {
          label: "第二章",
          title: "我讓脈絡自己長出開場。",
          body:
            "脈絡庫提醒我剛完成一個相關的服務設計衝刺。11s 提供了一個即時、相關、又能變成自己語氣的開場。",
          outcome: "有觀點的訊息",
        },
        {
          label: "第三章",
          title: "活動結束後，我繼續把關係留暖。",
          body:
            "Samir 介紹我認識一位創辦人時，我記下這個連結並寄出答應好的資源。下一次見面從動能開始，不必客套地重新認識。",
          outcome: "會持續累積的人脈",
        },
      ],
      workspace: {
        label: "Caleb 的私人 11s 工作區",
        meetingTitle: "為 Samir 準備 · 重新連結",
        meetingMeta: "設計系統聚會 · 星期三 18:30",
        meetingStatus: "脈絡式開場就緒",
        contacts: [
          {
            initials: "SP",
            name: "Samir Patel",
            role: "平台主管",
            relationship: "peer",
            color: "#3F6FA3",
            timing: "星期三",
          },
          {
            initials: "EI",
            name: "Elise Ingram",
            role: "創辦人",
            relationship: "peer",
            color: "#D26A4C",
            timing: "18 天前",
          },
          {
            initials: "MO",
            name: "Maya Ortiz",
            role: "創意總監",
            relationship: "peer",
            color: "#6C63A8",
            timing: "7 天前",
          },
        ],
        activeContact: {
          initials: "SP",
          name: "Samir Patel",
          role: "平台主管",
          relationship: "peer",
          color: "#3F6FA3",
          timing: "星期三",
        },
        context: [
          "工作 · 剛完成一個服務設計衝刺",
          "共同主線 · 內部工具的設計系統",
          "承諾 · 送研究整理範本",
        ],
        notes: [
          "問重組後內部工具試行的變化。",
          "分享最近衝刺裡的服務設計模式。",
          "聚會後送研究整理範本。",
        ],
        lead: {
          label: "主問題",
          title: "從真正共同的主線重新連結",
          prompt: "重組後，內部工具試行有什麼變化？現在設計系統最幫得上忙的地方在哪裡？",
        },
        supports: [
          {
            label: "延伸",
            title: "提供有用脈絡",
            prompt: "我剛做完一個相似的衝刺，要不要交換一下研究整理範本？",
          },
          {
            label: "延伸",
            title: "讓下一個連結自然發生",
            prompt: "今天聚會裡，還有誰正從不同角度想這個問題？",
          },
        ],
        history: {
          label: "上次對話",
          title: "活動後跟進",
          date: "5 週前",
          summary: "Samir 在重組後測試更小的設計系統團隊，想看複雜內部產品的實例。",
        },
        privacy: "Caleb 私下保存關係脈絡，再自己決定什麼適合帶進真正的對話。",
      },
      outcome: {
        label: "改變的是",
        title: "我不再需要在隨性與有準備之間二選一。",
        body:
          "這些細節讓我像是真的記得對方，而不是在經營名單。介紹、合作與輕鬆跟進，都更自然。",
        metrics: [
          { value: "1", label: "相關的開場" },
          { value: "1", label: "說到做到的承諾" },
          { value: "3", label: "帶到下次的主線" },
        ],
      },
      quote: "最會經營關係的人，記得對方在意什麼。11s 幫我帶著這份在意。",
    },
    "family-friends": {
      person: {
        name: "Mina Park",
        role: "設計師、姊妹與朋友",
        initials: "MP",
        color: "#9C5F80",
      },
      eyebrow: "家人與朋友",
      hero: {
        title: "我在家裡，也為重要的對話留出空間。",
        accent: "更溫暖地維持親近。",
        body:
          "工作行事曆很滿，愛的人卻不會自己排進去。11s 給我一個安靜的地方，記得朋友正承受什麼、弟弟最近為什麼興奮，以及怎麼開場才不會假裝時間沒有過去。",
        goalLabel: "我的目標",
        goal: "在 Tara 辛苦的一個月後好好陪她聊聊，又不讓這次敘舊像訪談。",
      },
      tension: {
        label: "卡住的地方",
        title: "我很在乎，只是忙碌讓我每次都要從零開始。",
        body:
          "幾個星期很快過去。我記得曾經發生重要的事，卻記不起細節。害怕問錯，反而讓第一封訊息比想像中更難發。",
      },
      chapters: [
        {
          label: "第一章",
          title: "我留下讓小事變重要的細節。",
          body:
            "上次散步後，我記下 Tara 想看的畫展、她正在衡量的家庭決定，以及她在低潮時聽到會笑的那個玩笑。",
          outcome: "更溫柔地回到彼此身邊",
        },
        {
          label: "第二章",
          title: "我準備的是自然開場，不是議程。",
          body:
            "我選擇敘舊意圖，讓 11s 帶出一個真誠的開頭；如果對話變深，還有一條延伸能接住。結構留在背景。",
          outcome: "少一點壓力，多一點在場",
        },
        {
          label: "第三章",
          title: "通話結束後，我也記得跟進。",
          body:
            "Tara 又提到那個畫展。我記下來，兩天後傳訊息提了可行的時間。關心沒有在掛電話時結束。",
          outcome: "用小小的做到，建立長久的親近",
        },
      ],
      workspace: {
        label: "Mina 的私人 11s 工作區",
        meetingTitle: "為 Tara 準備 · 敘舊",
        meetingMeta: "遠距通話 · 星期日 19:00",
        meetingStatus: "溫暖開場就緒",
        contacts: [
          {
            initials: "TL",
            name: "Tara Lin",
            role: "多年的朋友",
            relationship: "friend",
            color: "#9C5F80",
            timing: "星期日",
          },
          {
            initials: "JP",
            name: "Jon Park",
            role: "弟弟",
            relationship: "friend",
            color: "#3F6FA3",
            timing: "4 天前",
          },
          {
            initials: "AD",
            name: "Ana Diaz",
            role: "前室友",
            relationship: "friend",
            color: "#2E8277",
            timing: "16 天前",
          },
        ],
        activeContact: {
          initials: "TL",
          name: "Tara Lin",
          role: "多年的朋友",
          relationship: "friend",
          color: "#9C5F80",
          timing: "星期日",
        },
        context: [
          "生活 · Tara 正衡量一個家庭決定",
          "快樂 · 社區畫展",
          "跟進 · 通話後提出兩個見面的日期",
        ],
        notes: [
          "先從她上個月傳來的畫家開始。",
          "問這個家庭決定讓她感覺如何，而不是有沒有解決。",
          "通話後傳兩個可以見面的日期。",
        ],
        lead: {
          label: "主問題",
          title: "留出空間，不逼她給答案",
          prompt: "我一直想著你傳來的那位畫家。那時候你在承受的其他事情，現在感覺怎麼樣？",
        },
        supports: [
          {
            label: "延伸",
            title: "讓她決定深度",
            prompt: "你現在想聊這件事嗎？還是想把這個空間留到另一天？",
          },
          {
            label: "延伸",
            title: "把關心變成計畫",
            prompt: "要不要現在就把一起看畫展的日子排進行事曆，讓接下來幾週輕鬆一點？",
          },
        ],
        history: {
          label: "上次對話",
          title: "下班後的一段長散步",
          date: "3 週前",
          summary: "Tara 分享一個困難的家庭決定，但談到附近的小畫展時，整個人亮了起來。",
        },
        privacy: "Mina 的個人筆記只屬於她，用來幫她更體貼地出現。",
      },
      outcome: {
        label: "改變的是",
        title: "我能更用心，卻不會讓關係變成被管理。",
        body:
          "11s 幫我保存細節，讓我專心接住這個人。我出現得更溫暖、記得真正重要的事，也做到那些讓親近持續的小承諾。",
        metrics: [
          { value: "1", label: "更溫暖的開場" },
          { value: "2", label: "溫柔延伸" },
          { value: "1", label: "要做到的承諾" },
        ],
      },
      quote: "這不是追蹤朋友，而是確保關心能在忙碌生活裡留下來。",
    },
  },
};

export function isPersonaSlug(value: string): value is PersonaSlug {
  return PERSONA_SLUGS.includes(value as PersonaSlug);
}

export function getPersonaStory(
  persona: PersonaSlug,
  locale: Locale,
): PersonaStory {
  return stories[locale][persona];
}
