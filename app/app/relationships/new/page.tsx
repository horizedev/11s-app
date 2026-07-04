import { RelationshipForm } from "@/components/relationship-form";
import { createRelationshipAction } from "@/app/app/relationships/new/actions";
import { getEmptyRelationshipFormState } from "@/lib/relationships/validation";

export default function NewRelationshipPage() {
  return (
    <div className="space-y-4">
      <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
        Relationships
      </p>
      <RelationshipForm
        action={createRelationshipAction}
        initialState={getEmptyRelationshipFormState()}
      />
    </div>
  );
}
