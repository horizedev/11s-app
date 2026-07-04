import { Suspense } from "react";
import { MeetingForm } from "@/components/meeting-form";
import { createMeetingAction } from "@/app/app/relationships/[relationshipId]/meetings/new/actions";
import { listOpenActionItemsByRelationship } from "@/lib/action-items/repository";
import { getEmptyMeetingFormState } from "@/lib/meetings/validation";
import { createClient } from "@/lib/supabase/server";
import { getRelationshipById } from "@/lib/relationships/repository";
import { notFound } from "next/navigation";

type NewMeetingPageProps = {
  params: Promise<{
    relationshipId: string;
  }>;
};

async function NewMeetingContent({ params }: NewMeetingPageProps) {
  const { relationshipId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const relationship = await getRelationshipById({
    relationshipId,
    supabase,
    userId: user.id,
  });

  if (!relationship) {
    notFound();
  }

  const openActionItems = await listOpenActionItemsByRelationship({
    relationshipId,
    supabase,
    userId: user.id,
  });

  return (
    <div className="space-y-6">
      <MeetingForm
        action={createMeetingAction.bind(null, relationshipId)}
        initialState={getEmptyMeetingFormState()}
        relationshipName={relationship.personName}
      />
      {openActionItems.length > 0 ? (
        <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Carry forward
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Open action items from previous meetings
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Bring these forward into the next 1:1 so prior commitments stay visible.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {openActionItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border/70 bg-background p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.ownerLabel}
                      {item.dueDate
                        ? ` • Due ${new Date(item.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : ""}
                    </p>
                  </div>
                </div>
                {item.notes ? (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.notes}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function NewMeetingFallback() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <div className="h-7 w-28 rounded-2xl bg-muted" />
        <div className="space-y-3">
          <div className="h-10 w-72 rounded-2xl bg-muted" />
          <div className="h-20 rounded-2xl bg-muted" />
        </div>
      </div>
      <div className="space-y-6 rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded-2xl bg-muted" />
          <div className="h-9 rounded-2xl bg-muted" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-40 rounded-2xl bg-muted" />
          <div className="h-9 rounded-2xl bg-muted" />
        </div>
      </div>
    </section>
  );
}

export default function NewMeetingPage(props: NewMeetingPageProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
        Meetings
      </p>
      <Suspense fallback={<NewMeetingFallback />}>
        <NewMeetingContent {...props} />
      </Suspense>
    </div>
  );
}
