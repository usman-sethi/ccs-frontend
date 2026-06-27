"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import backendMiddleware from "@/backend-middleware";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  FormField,
  AuthHeading,
  AuthButton,
} from "@/components/auth/FormField";
import { useAuth } from "@/context/AuthContext";

const Schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const RESEND_SECONDS = 60;

function SuccessState({ email, onResend, busy }) {
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      {/* Icon */}
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="size-8 text-emerald-500" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight">Check your inbox</h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        We&apos;ve sent a password reset link to{" "}
        <span className="font-medium text-foreground">{email}</span>. It expires
        in 15 minutes.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-surface p-4 text-left space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">
          Didn&apos;t receive it?
        </p>
        <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
          <li>Check your spam or junk folder</li>
          <li>Make sure you used your university email</li>
          <li>Wait a minute and try resending</li>
        </ul>
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => {
            setSeconds(RESEND_SECONDS);
            onResend();
          }}
          disabled={seconds > 0 || busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="size-4" />
          {seconds > 0 ? `Resend in ${seconds}s` : "Resend email"}
        </button>

        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const result = await backendMiddleware("forgot-password");
      if (!result) router.push("/");
    })();
  }, []);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { email: "" },
  });

  const doSend = async (email) => {
    setBusy(true);
    try {
      await forgotPassword(email);
      setSentTo(email);
    } catch (e) {
      toast.error("Could not send reset email", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell backHref="/login" backLabel="Back to sign in">
      <AnimatePresence mode="wait">
        {sentTo ? (
          <SuccessState
            key="success"
            email={sentTo}
            busy={busy}
            onResend={() => doSend(sentTo)}
          />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <AuthHeading
              title="Forgot your password?"
              subtitle="Enter your email and we'll send you a reset link."
            />

            <form
              onSubmit={form.handleSubmit((v) => doSend(v.email))}
              noValidate
              className="space-y-4"
            >
              <FormField
                label="Email address"
                icon={Mail}
                error={form.formState.errors.email?.message}
              >
                <Input
                  type="email"
                  placeholder="you@university.edu"
                  autoComplete="email"
                  autoFocus
                  className="pl-10"
                  {...form.register("email")}
                />
              </FormField>

              <AuthButton loading={busy}>Send reset link</AuthButton>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remember it?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
