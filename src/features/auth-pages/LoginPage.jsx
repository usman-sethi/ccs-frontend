"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  FormField, PasswordInput, OrDivider, GoogleButton,
  AuthHeading, AuthButton,
} from "@/components/auth/FormField";
import { useAuth } from "@/context/AuthContext";

const Schema = z.object({
  email:      z.string().email("Please enter a valid email"),
  password:   z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values) => {
    setBusy(true);
    try {
      await signIn(values.email, values.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (e) {
      toast.error("Sign in failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = () =>
    toast.info("Configure Google OAuth in your Express backend to enable this.");

  return (
    <AuthShell backHref="/" backLabel="Back to site">
      <AuthHeading
        title="Welcome back"
        subtitle="Sign in to your CCS member account."
      />

      <GoogleButton label="Continue with Google" onClick={handleGoogle} />
      <OrDivider />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          label="Email address"
          icon={Mail}
          error={form.formState.errors.email?.message}
        >
          <Input
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            className="pl-10"
            {...form.register("email")}
          />
        </FormField>

        <FormField
          label="Password"
          icon={Lock}
          error={form.formState.errors.password?.message}
        >
          <PasswordInput
            placeholder="Your password"
            autoComplete="current-password"
            className="pl-10"
            {...form.register("password")}
          />
        </FormField>

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground select-none">
            <input
              type="checkbox"
              className="size-3.5 rounded accent-primary"
              {...form.register("rememberMe")}
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton loading={busy} className="mt-2">
          Sign in
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
