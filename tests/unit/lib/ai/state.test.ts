import { describe, expect, it } from "vitest";

import { getEmptyAgendaIdeasState, getEmptyFollowUpSummaryState } from "@/lib/ai/state";

describe("AI form state", () => {
  it("starts with empty ideas and summary", () => {
    expect(getEmptyAgendaIdeasState()).toMatchObject({ ideas: [], formError: null });
    expect(getEmptyFollowUpSummaryState()).toMatchObject({ summary: null, formError: null });
  });
});
