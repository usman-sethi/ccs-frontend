"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthButton } from "@/components/auth/FormField";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const OTP_LENGTH = 6;
const RESEND_SECS = 60;

/* ── Individual digit cell ── */
function OtpCell({ value, active, hasError }) {
  return (
    <div
      className={cn(
        "relative flex size-12 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-150",
        active
          ? "border-primary bg-primary/5 shadow-[0_0_0_3px] shadow-primary/20"
          : value
            ? "border-border bg-card"
            : "border-border bg-card text-muted-foreground",
        hasError && "border-destructive bg-destructive/5 animate-shake",
      )}
    >
      {value && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {value}
        </motion.span>
      )}
      {active && !value && (
        <span className="absolute size-0.5 w-6 rounded-full bg-primary opacity-70 animate-pulse" />
      )}
    </div>
  );
}

export default function TwoFAPage() {
  const { twoFactorAuth, setUser, resendOTP } = useAuth();

  const router = useRouter();
  const [email, setEmail] = useState("you email");

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [activeIdx, setActiveIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [resendSecs, setResendSecs] = useState(RESEND_SECS);

  useEffect(() => {
    const email = JSON.parse(sessionStorage.getItem("email")) || "your email";
    setEmail(email);
  }, []);

  const inputsRef = useRef([]);

  /* Resend countdown */
  useEffect(() => {
    if (resendSecs <= 0) return;
    const id = setTimeout(() => setResendSecs((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendSecs]);

  /* Focus current active cell */
  useEffect(() => {
    inputsRef.current[activeIdx]?.focus();
  }, [activeIdx]);

  const focusCell = (i) => {
    setActiveIdx(Math.max(0, Math.min(OTP_LENGTH - 1, i)));
  };

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[idx]) {
        next[idx] = "";
        setDigits(next);
      } else if (idx > 0) {
        next[idx - 1] = "";
        setDigits(next);
        focusCell(idx - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusCell(idx - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusCell(idx + 1);
    } else if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handleInput = (e, idx) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    setHasError(false);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    if (idx < OTP_LENGTH - 1) focusCell(idx + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    focusCell(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setHasError(true);
      toast.error("Enter all 6 digits");
      return;
    }

    setBusy(true);
    try {
      /* TODO: call your Express backend /api/auth/verify-2fa */
      const data = await twoFactorAuth(email, code);
      setUser(data.user);
      sessionStorage.removeItem("email");
      localStorage.setItem("loggedIn", JSON.stringify(true));
      toast.success("Verified! Welcome back.");
      router.push("/dashboard");
    } catch (e) {
      setHasError(true);
      setDigits(Array(OTP_LENGTH).fill(""));
      focusCell(0);
      toast.error("Invalid code", { description: "Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setResendSecs(RESEND_SECS);

    try {
      await resendOTP(email);
      toast.success("New code sent!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filled = digits.filter(Boolean).length;

  return (
    <AuthShell backHref="/login" backLabel="Back to sign in">
      {/* Icon */}
      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
        <ShieldCheck className="size-7 text-primary" />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Two-factor authentication
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>. Enter it
          below.
        </p>
      </div>

      {/* OTP cells */}
      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <div key={i} className="flex-1">
            <input
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              className="sr-only"
              onKeyDown={(e) => handleKey(e, i)}
              onChange={(e) => handleInput(e, i)}
              onFocus={() => setActiveIdx(i)}
              aria-label={`Digit ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => focusCell(i)}
              tabIndex={-1}
              className="w-full"
              aria-hidden
            >
              <OtpCell
                value={d}
                active={activeIdx === i && !busy}
                hasError={hasError}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${(filled / OTP_LENGTH) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      <p className="mt-1.5 text-right text-[11px] text-muted-foreground">
        {filled}/{OTP_LENGTH} digits
      </p>

      {/* Verify button */}
      <div className="mt-5">
        <AuthButton
          loading={busy}
          onClick={handleVerify}
          type="button"
          className={cn(
            filled === OTP_LENGTH &&
              !busy &&
              "ring-2 ring-primary/20 ring-offset-2",
          )}
        >
          Verify code
        </AuthButton>
      </div>

      {/* Resend */}
      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span>Didn&apos;t receive the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendSecs > 0}
          className="flex items-center gap-1 font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="size-3" />
          {resendSecs > 0 ? `Resend in ${resendSecs}s` : "Resend code"}
        </button>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className="text-center text-xs text-muted-foreground">
          Having trouble?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in with a different method
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
