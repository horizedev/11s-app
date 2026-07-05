import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

function LoginPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

async function LoginPageContent({
  searchParams,
}: Pick<LoginPageProps, "searchParams">) {
  const params = await searchParams;
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <LoginPageShell>
      <LoginForm nextPath={nextPath} />
    </LoginPageShell>
  );
}

export default function Page({ searchParams }: LoginPageProps) {
  return (
    <Suspense
      fallback={
        <LoginPageShell>
          <LoginForm nextPath="/app" />
        </LoginPageShell>
      }
    >
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  );
}
