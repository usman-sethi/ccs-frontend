"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

const SignInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUpSchema = z.object({
  displayName: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

const ForgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function AuthPage() {
  const [tab, setTab] = useState("signin");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const { signIn, signUp, forgotPassword } = useAuth();
  const router = useRouter();

  const signInForm = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });
  const signUpForm = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { displayName: "", email: "", password: "", confirm: "" },
  });
  const forgotForm = useForm({
    resolver: zodResolver(ForgotSchema),
    defaultValues: { email: "" },
  });

  const onSignIn = async (v) => {
    setBusy(true);
    try {
      await signIn(v.email, v.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (e) {
      toast.error("Sign in failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const onSignUp = async (v) => {
    setBusy(true);
    try {
      await signUp(v.email, v.password, v.displayName);
      toast.success("Account created", {
        description: "Check your email to confirm your account before signing in.",
      });
      setTab("signin");
      signUpForm.reset();
    } catch (e) {
      toast.error("Sign up failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const onForgot = async (v) => {
    setBusy(true);
    try {
      await forgotPassword(v.email);
      setForgotSent(true);
      toast.success("Reset email sent", {
        description: "Check your inbox for a password reset link.",
      });
    } catch (e) {
      toast.error("Could not send reset email", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-bold">
            CCS
          </span>
          <h1 className="mt-3 text-xl font-semibold tracking-tight">Core Computing Society</h1>
          <p className="mt-1 text-sm text-muted-foreground">Member portal</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="signin" className="flex-1">Sign in</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">Sign up</TabsTrigger>
            <TabsTrigger value="forgot" className="flex-1">Forgot</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          {tab === "signin" && (
            <form onSubmit={signInForm.handleSubmit(onSignIn)} noValidate className="space-y-4">
              <Field label="Email" error={signInForm.formState.errors.email?.message}>
                <Input type="email" placeholder="you@university.edu" {...signInForm.register("email")} />
              </Field>
              <Field label="Password" error={signInForm.formState.errors.password?.message}>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="········"
                    className="pr-10"
                    {...signInForm.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          )}

          {tab === "signup" && (
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} noValidate className="space-y-4">
              <Field label="Full name" error={signUpForm.formState.errors.displayName?.message}>
                <Input placeholder="Your name" {...signUpForm.register("displayName")} />
              </Field>
              <Field label="Email" error={signUpForm.formState.errors.email?.message}>
                <Input type="email" placeholder="you@university.edu" {...signUpForm.register("email")} />
              </Field>
              <Field label="Password" error={signUpForm.formState.errors.password?.message}>
                <Input type="password" placeholder="Min. 8 characters" {...signUpForm.register("password")} />
              </Field>
              <Field label="Confirm password" error={signUpForm.formState.errors.confirm?.message}>
                <Input type="password" placeholder="Repeat password" {...signUpForm.register("confirm")} />
              </Field>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Creating account…" : "Create account"}
              </Button>
            </form>
          )}

          {tab === "forgot" && (
            forgotSent ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Check your email for the reset link.{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => { setForgotSent(false); setTab("signin"); }}
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={forgotForm.handleSubmit(onForgot)} noValidate className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Enter the email tied to your account and we&apos;ll send a reset link.
                </p>
                <Field label="Email" error={forgotForm.formState.errors.email?.message}>
                  <Input type="email" placeholder="you@university.edu" {...forgotForm.register("email")} />
                </Field>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            )
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing in, you agree to the CCS member code of conduct.
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
