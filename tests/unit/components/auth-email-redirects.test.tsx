import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { SignUpForm } from "@/components/sign-up-form";

const push = vi.fn();
const signUp = vi.fn();
const resetPasswordForEmail = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      resetPasswordForEmail,
      signUp,
    },
  }),
}));

describe("auth email redirects", () => {
  beforeEach(() => {
    push.mockReset();
    signUp.mockReset();
    resetPasswordForEmail.mockReset();

    signUp.mockResolvedValue({ error: null });
    resetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it("routes signup email confirmations through the auth callback", async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "alex@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password-123" },
    });
    fireEvent.change(screen.getByLabelText("Repeat Password"), {
      target: { value: "password-123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() =>
      expect(signUp).toHaveBeenCalledWith({
        email: "alex@example.com",
        password: "password-123",
        options: {
          emailRedirectTo:
            "http://localhost:3000/auth/confirm?next=%2Fapp",
        },
      }),
    );
  });

  it("routes password recovery emails through the auth callback", async () => {
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "alex@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send reset email" }));

    await waitFor(() =>
      expect(resetPasswordForEmail).toHaveBeenCalledWith(
        "alex@example.com",
        {
          redirectTo:
            "http://localhost:3000/auth/confirm?next=%2Fauth%2Fupdate-password",
        },
      ),
    );
  });
});
