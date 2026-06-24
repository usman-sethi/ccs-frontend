"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, RotateCcw, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { AuthShell } from "@/components/auth/AuthShell";
import { forgotPassword } from "@/lib/api";

const RESEND_SECS = 60;

function EnvelopeIllustration() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      className="relative mx-auto mb-8 flex size-24 items-center justify-center"
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
      {/* Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
      {/* Icon bg */}
      <div className="relative flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Mail className="size-9 text-primary" />
        {/* Green dot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background"
        >
          <CheckCircle2 className="size-3.5 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email address";

  const [resendSecs, setResendSecs] = useState(RESEND_SECS);
  const [busy, setBusy] = useState(false);
  const [resentCount, setResentCount] = useState(0);

  useEffect(() => {
    if (resendSecs <= 0) return;
    const id = setTimeout(() => setResendSecs((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendSecs]);

  const handleResend = async () => {
    setBusy(true);
    try {
      await forgotPassword(email); // reuses the same "send email" mechanism
      setResentCount((c) => c + 1);
      setResendSecs(RESEND_SECS);
      toast.success("Verification email resent!");
    } catch (e) {
      toast.error("Could not resend", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell backHref="/signup" backLabel="Back to sign up">
      <div className="text-center">
        <EnvelopeIllustration />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            We sent a verification link to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            Click the link in that email to activate your account.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          className="mt-8 rounded-xl border border-border bg-surface p-5 text-left space-y-3"
        >
          {[
            { num: "1", text: "Open the email we sent you" },
            { num: "2", text: "Click the \"Verify email\" button" },
            { num: "3", text: "You'll be redirected to sign in" },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {step.num}
              </span>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Resend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-6 space-y-3"
        >
          <button
            type="button"
            onClick={handleResend}
            disabled={resendSecs > 0 || busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className={`size-4 ${busy ? "animate-spin" : ""}`} />
            {resendSecs > 0
              ? `Resend available in ${resendSecs}s`
              : busy
              ? "Sending…"
              : resentCount > 0
              ? "Resend again"
              : "Resend verification email"}
          </button>

          {resentCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-emerald-600 dark:text-emerald-400"
            >
              Email resent {resentCount} time{resentCount > 1 ? "s" : ""}. Check your spam folder too.
            </motion.p>
          )}

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to sign in
          </Link>
        </motion.div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-muted-foreground">
          Wrong email address?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up again
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
