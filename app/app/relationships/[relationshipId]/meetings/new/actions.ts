"use server";

import { redirect } from "next/navigation";

import { createMeeting } from "@/lib/meetings/repository";
import { trackProductEvent } from "@/lib/analytics/repository";
import {
  getEmptyMeetingFormState,
  toMeetingFormValues,
  type MeetingFormState,
  validateMeetingInput,
} from "@/lib/meetings/validation";
import { getRelationshipById } from "@/lib/relationships/repository";
import { createClient } from "@/lib/supabase/server";

export async function createMeetingAction(
  relationshipId: string,
  _previousState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const validation = validateMeetingInput({
    purpose: formData.get("purpose"),
    scheduledAt: formData.get("scheduledAt"),
  });

  if (!validation.success) {
    return validation.state;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=%2Fapp%2Frelationships%2F${relationshipId}%2Fmeetings%2Fnew`);
  }

  const relationship = await getRelationshipById({
    relationshipId,
    supabase,
    userId: user.id,
  });

  if (!relationship) {
    redirect("/app");
  }

  let meetingId: string;

  try {
    const meeting = await createMeeting({
      input: validation.data,
      relationshipId,
      supabase,
      userId: user.id,
    });

    await trackProductEvent({
      supabase,
      userId: user.id,
      eventName: "meeting_created",
      entityType: "meeting",
      entityId: meeting.id,
    });
    meetingId = meeting.id;
  } catch {
    return {
      ...getEmptyMeetingFormState(),
      formError:
        "We couldn't create this draft meeting right now. Try again in a moment.",
      values: toMeetingFormValues(validation.data),
    };
  }

  redirect(`/app/relationships/${relationshipId}/meetings/${meetingId}`);
}
