import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PersonaStoryPage } from "@/components/persona-story-page";
import {
  isPersonaSlug,
  PERSONA_METADATA,
  PERSONA_SLUGS,
} from "@/lib/persona-stories";

export const dynamicParams = false;

type StoryPageProps = {
  params: Promise<{ persona: string }>;
};

export function generateStaticParams() {
  return PERSONA_SLUGS.map((persona) => ({ persona }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { persona } = await params;

  if (!isPersonaSlug(persona)) {
    return {};
  }

  const story = PERSONA_METADATA[persona];
  return {
    title: `${story.title} — 11s`,
    description: story.description,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { persona } = await params;

  if (!isPersonaSlug(persona)) {
    notFound();
  }

  return <PersonaStoryPage persona={persona} />;
}
