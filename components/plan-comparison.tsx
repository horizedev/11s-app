import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PlanComparison({
  isPro,
  onSubscribe,
  onManage,
}: {
  isPro: boolean;
  onSubscribe?: () => Promise<void>;
  onManage?: () => Promise<void>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PlanCard
        title="Free"
        price="$0"
        description="Prove 11s with one important recurring relationship."
        features={[
          "1 active relationship",
          "3 meetings total",
          "5 AI generations per month",
          "Agenda, notes, decisions, and action tracking",
        ]}
        footer={isPro ? "Included as fallback if subscription is canceled." : "Current plan"}
      />
      <PlanCard
        highlighted
        title="Pro"
        price="$9/mo"
        description="Run 11s as your personal 1:1 operating system."
        features={[
          "Unlimited active relationships",
          "Unlimited meetings",
          "100 AI generations per month",
          "Premium continuity prep and follow-up summaries",
          "Stripe billing self-management",
        ]}
        footer={
          isPro && onManage ? (
            <form action={onManage}>
              <Button type="submit" variant="outline">Manage billing</Button>
            </form>
          ) : onSubscribe ? (
            <form action={onSubscribe}>
              <Button type="submit">Upgrade to Pro</Button>
            </form>
          ) : (
            <Button asChild>
              <a href="/auth/sign-up">Upgrade to Pro</a>
            </Button>
          )
        }
      />
    </div>
  );
}

function PlanCard({
  title,
  price,
  description,
  features,
  footer,
  highlighted = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  footer: ReactNode;
  highlighted?: boolean;
}) {
  return (
    <Card className={highlighted ? "border-primary/50 shadow-lg" : ""}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p className="pt-3 text-3xl font-semibold tracking-tight">{price}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
          {features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>{typeof footer === "string" ? <p className="text-sm text-muted-foreground">{footer}</p> : footer}</CardFooter>
    </Card>
  );
}
