import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/login-form";

const push = vi.fn();
const signInWithPassword = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword,
    },
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    push.mockReset();
    signInWithPassword.mockReset();

    signInWithPassword.mockResolvedValue({ error: null });
  });

  it("redirects to the requested protected route after sign-in", async () => {
    render(<LoginForm nextPath="/app/relationships/new" />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "alex@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password-123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: "alex@example.com",
        password: "password-123",
      }),
    );
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/app/relationships/new"),
    );
  });
});
