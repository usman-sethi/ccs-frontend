"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/api";

const Schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = async (v) => {
    setBusy(true);
    try {
      await resetPassword({ password: v.password, token });
      setDone(true);
      toast.success("Password updated");
    } catch (e) {
      toast.error("Reset failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <p className="text-sm text-muted-foreground">
            Invalid or expired reset link. Please request a new one from the sign-in page.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => router.push("/auth")}>
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <CheckCircle2 className="mx-auto size-10 text-primary" />
          <h2 className="mt-3 text-lg font-semibold">Password updated!</h2>
          <p className="mt-1 text-sm text-muted-foreground">You can now sign in with your new password.</p>
          <Button className="mt-4" onClick={() => router.push("/auth")}>
            Go to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-bold">
            CCS
          </span>
          <h1 className="mt-3 text-xl font-semibold tracking-tight">Reset password</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter a new password for your account.</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">New password</Label>
            <Input type="password" placeholder="Min. 8 characters" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Confirm password</Label>
            <Input type="password" placeholder="Repeat password" {...form.register("confirm")} />
            {form.formState.errors.confirm && (
              <p className="text-xs text-destructive">{form.formState.errors.confirm.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Updating…" : "Set new password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
