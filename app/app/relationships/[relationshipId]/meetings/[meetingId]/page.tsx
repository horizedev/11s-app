import { completeActionItemAction } from "@/app/app/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AgendaItemsPanel } from "@/components/agenda-items-panel";
import { AgendaIdeasPanel } from "@/components/agenda-ideas-panel";
import { ActionItemsPanel } from "@/components/action-items-panel";
import { AiPrepBriefPanel } from "@/components/ai-prep-brief-panel";
import { DecisionsPanel } from "@/components/decisions-panel";
import { FollowUpSummaryPanel } from "@/components/follow-up-summary-panel";
import { MeetingNotesPanel } from "@/components/meeting-notes-panel";
import { Button } from "@/components/ui/button";
import {
  createAgendaItemAction,
  createActionItemAction,
  createDecisionAction,
  addAgendaSuggestionAction,
  completeMeetingAction,
  generateAgendaIdeasAction,
  generatePrepBriefAction,
  prepBriefCopiedAction,
  prepBriefUpgradeClickedAction,
  generateFollowUpSummaryAction,
  saveMeetingNotesAction,
  summaryCopiedAction,
} from "@/app/app/relationships/[relationshipId]/meetings/[meetingId]/actions";
import { listAgendaItemsForMeeting } from "@/lib/agenda/repository";
import { getEmptyAgendaItemFormState } from "@/lib/agenda/validation";
import {
  getEmptyAgendaIdeasState,
  getEmptyPrepBriefState,
  getEmptyFollowUpSummaryState,
} from "@/lib/ai/state";
import { getEmptyActionItemFormState } from "@/lib/action-items/validation";
import { listActionItemsForMeeting } from "@/lib/action-items/repository";
import { getLatestPrepBriefForMeeting } from "@/lib/ai/prep-brief-repository";
import { getBillingUsage } from "@/lib/billing/repository";
import { getMeetingNotesBundle } from "@/lib/meeting-notes/repository";
import {
  getEmptyDecisionFormState,
  type MeetingNotesFormState,
} from "@/lib/meeting-notes/validation";
import { getMeetingById } from "@/lib/meetings/repository";
import { getRelationshipById } from "@/lib/relationships/repository";
import { createClient } from "@/lib/supabase/server";

type MeetingDetailPageProps = {
  params: Promise<{
    relationshipId: string;
    meetingId: string;
  }>;
};

async function MeetingDetailContent({ params }: MeetingDetailPageProps) {
  const { relationshipId, meetingId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const [relationship, meeting, agendaItems, meetingNotes, actionItems, usage, latestPrepBrief] = await Promise.all([
    getRelationshipById({
      relationshipId,
      supabase,
      userId: user.id,
    }),
    getMeetingById({
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    }),
    listAgendaItemsForMeeting({
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    }),
    getMeetingNotesBundle({
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    }),
    listActionItemsForMeeting({
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    }),
    getBillingUsage({
      supabase,
      userId: user.id,
    }),
    getLatestPrepBriefForMeeting({
      meetingId,
      relationshipId,
      supabase,
      userId: user.id,
    }),
  ]);

  if (!relationship || !meeting) {
    notFound();
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {meeting.purpose ?? `Draft 1:1 with ${relationship.personName}`}
          </h1>
          <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {meeting.status}
          </span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {meeting.scheduledAt
            ? `Scheduled for ${new Date(meeting.scheduledAt).toLocaleString()}.`
            : "No meeting time added yet."}
        </p>
        <form action={completeMeetingAction.bind(null, relationshipId, meetingId)}>
          <Button type="submit" variant={meeting.status === "completed" ? "outline" : "default"}>
            {meeting.status === "completed" ? "Meeting completed" : "Complete meeting"}
          </Button>
        </form>
      </div>

      <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Agenda
            </p>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Start building the talking points
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                This meeting draft is ready for agenda items, AI ideas, notes,
                and action tracking. Start by capturing the topics you want to
                cover in this 1:1.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/app/relationships/${relationship.id}`}>
              Back to {relationship.personName}
            </Link>
          </Button>
        </div>
      </section>

      <AgendaItemsPanel
        action={createAgendaItemAction.bind(null, relationshipId, meetingId)}
        initialState={getEmptyAgendaItemFormState()}
        items={agendaItems}
        relationshipName={relationship.personName}
        meetingPurpose={meeting.purpose}
      />

      <AgendaIdeasPanel
        generateAction={generateAgendaIdeasAction.bind(null, relationshipId, meetingId)}
        addAction={addAgendaSuggestionAction.bind(null, relationshipId, meetingId)}
        initialState={getEmptyAgendaIdeasState()}
      />

      <AiPrepBriefPanel
        generateAction={generatePrepBriefAction.bind(null, relationshipId, meetingId)}
        copyEventAction={prepBriefCopiedAction.bind(null, relationshipId, meetingId)}
        upgradeAction={prepBriefUpgradeClickedAction.bind(null, relationshipId, meetingId)}
        initialState={getEmptyPrepBriefState(
          latestPrepBrief
            ? {
                id: latestPrepBrief.id,
                contentMarkdown: latestPrepBrief.contentMarkdown,
                includedPrivateNotes: latestPrepBrief.includedPrivateNotes,
                model: latestPrepBrief.model,
                inputSnapshot: latestPrepBrief.inputSnapshot,
                createdAt: latestPrepBrief.createdAt,
              }
            : null,
        )}
        showUpgradeCta={usage.plan !== "pro"}
      />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <MeetingNotesPanel
          action={saveMeetingNotesAction.bind(null, relationshipId, meetingId)}
          initialState={{
            fieldErrors: {},
            formError: null,
            values: {
              shareableNotes: meetingNotes.shareableNotes ?? "",
              privateNotes: meetingNotes.privateNotes ?? "",
            },
          } satisfies MeetingNotesFormState}
        />
        <DecisionsPanel
          action={createDecisionAction.bind(null, relationshipId, meetingId)}
          decisions={meetingNotes.decisions}
          initialState={getEmptyDecisionFormState()}
        />
      </section>

      <ActionItemsPanel
        action={createActionItemAction.bind(null, relationshipId, meetingId)}
        completeAction={completeActionItemAction.bind(
          null,
          `/app/relationships/${relationshipId}/meetings/${meetingId}`,
        )}
        initialState={getEmptyActionItemFormState()}
        items={actionItems}
      />

      <FollowUpSummaryPanel
        generateAction={generateFollowUpSummaryAction.bind(null, relationshipId, meetingId)}
        copyEventAction={summaryCopiedAction.bind(null, relationshipId, meetingId)}
        initialState={getEmptyFollowUpSummaryState()}
      />
    </>
  );
}

function MeetingDetailFallback() {
  return (
    <>
      <div className="space-y-3">
        <div className="h-10 w-72 rounded-2xl bg-muted" />
        <div className="h-5 w-48 rounded-2xl bg-muted" />
      </div>
      <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="space-y-3">
          <div className="h-4 w-20 rounded-2xl bg-muted" />
          <div className="h-8 w-80 rounded-2xl bg-muted" />
          <div className="h-20 rounded-2xl bg-muted" />
        </div>
      </section>
    </>
  );
}

export default function MeetingDetailPage(props: MeetingDetailPageProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
          Meeting
        </p>
      </div>
      <Suspense fallback={<MeetingDetailFallback />}>
        <MeetingDetailContent {...props} />
      </Suspense>
    </div>
  );
}
