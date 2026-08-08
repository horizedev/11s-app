# Between

Between is a focused workspace for better recurring 1:1s with managers, peers,
direct reports, mentors, and friends.

It includes:

- A relationship dashboard and upcoming-conversation queue
- Private notes for each person’s next 1:1
- Searchable discussion history with topics and follow-ups
- AI-assisted preparation grounded in saved notes and recent discussions
- Browser persistence, adding people, rescheduling, and logging conversations

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AI preparation

Copy `.env.example` to `.env.local` and add a Vercel AI Gateway key:

```bash
cp .env.example .env.local
```

Without credentials, preparation still works using deterministic starter ideas
derived from the same context. On Vercel, AI Gateway can authenticate through
OIDC without a local API key.
