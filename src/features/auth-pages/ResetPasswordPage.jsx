"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  FormField, PasswordInput, PasswordStrength, AuthHeading, AuthButton,
} from "@/components/auth/FormField";
import { resetPassword } from "@/lib/api";

const Schema = z
  .object({
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const token       = searchParams.get("token") || "";
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = form.watch("password");

  const onSubmit = async (values) => {
    setBusy(true);
    try {
      await resetPassword({ password: values.password, token });
      setDone(true);
    } catch (e) {
      toast.error("Reset failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  /* Invalid / missing token */
  if (!token) {
    return (
      <AuthShell backHref="/forgot-password" backLabel="Request new link">
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="size-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Invalid link</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            This password reset link is missing or has expired. Request a new one.
          </p>
          <Button asChild className="mt-6 w-full" variant="outline">
            <Link href="/forgot-password">Request new link</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell backHref="/login" backLabel="Back to sign in">
      <AnimatePresence mode="wait">
        {done ? (
          /* Success state */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Password updated!</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Your password has been changed. You can now sign in with your new credentials.
            </p>
            <Button className="mt-8 w-full" onClick={() => router.push("/login")}>
              Go to sign in
            </Button>
          </motion.div>
        ) : (
          /* Form */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <AuthHeading
              title="Set new password"
              subtitle="Choose a strong password you haven't used before."
            />

            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
              <FormField
                label="New password"
                icon={Lock}
                error={form.formState.errors.password?.message}
              >
                <PasswordInput
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  autoFocus
                  className="pl-10"
                  {...form.register("password")}
                />
                <PasswordStrength password={password} />
              </FormField>

              <FormField
                label="Confirm new password"
                icon={Lock}
                error={form.formState.errors.confirmPassword?.message}
              >
                <PasswordInput
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  className="pl-10"
                  {...form.register("confirmPassword")}
                />
              </FormField>

              <AuthButton loading={busy} className="mt-2">
                Update password
              </AuthButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
