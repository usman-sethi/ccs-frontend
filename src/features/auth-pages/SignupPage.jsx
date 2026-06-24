"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Mail, Lock, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  FormField, PasswordInput, PasswordStrength, OrDivider,
  GoogleButton, AuthHeading, AuthButton,
} from "@/components/auth/FormField";
import { useAuth } from "@/context/AuthContext";
import { DEPARTMENTS } from "@/constants/society";

const Schema = z
  .object({
    displayName:     z.string().trim().min(2, "Enter your full name").max(80),
    email:           z.string().email("Enter a valid email").max(160),
    department:      z.string().min(1, "Select your department"),
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms:           z.boolean().refine((v) => v, "You must accept the terms to continue"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      displayName: "", email: "", department: "",
      password: "", confirmPassword: "", terms: false,
    },
  });

  const password = form.watch("password");

  const onSubmit = async (values) => {
    setBusy(true);
    try {
      await signUp(values.email, values.password, values.displayName);
      toast.success("Account created!", {
        description: "Check your email to verify your account before signing in.",
      });
      router.push("/verify-email?email=" + encodeURIComponent(values.email));
    } catch (e) {
      toast.error("Sign up failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = () =>
    toast.info("Configure Google OAuth in your Express backend to enable this.");

  return (
    <AuthShell backHref="/login" backLabel="Back to sign in">
      <AuthHeading
        title="Create your account"
        subtitle="Join CCS and get access to clubs, events, and more."
      />

      <GoogleButton label="Sign up with Google" onClick={handleGoogle} />
      <OrDivider />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          label="Full name"
          icon={User}
          error={form.formState.errors.displayName?.message}
        >
          <Input
            placeholder="Muhammad Usman"
            autoComplete="name"
            className="pl-10"
            {...form.register("displayName")}
          />
        </FormField>

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
          label="Department"
          icon={GraduationCap}
          error={form.formState.errors.department?.message}
        >
          <Select
            value={form.watch("department")}
            onValueChange={(v) => form.setValue("department", v, { shouldValidate: true })}
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Password"
          icon={Lock}
          error={form.formState.errors.password?.message}
        >
          <PasswordInput
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            className="pl-10"
            {...form.register("password")}
          />
          <PasswordStrength password={password} />
        </FormField>

        <FormField
          label="Confirm password"
          icon={Lock}
          error={form.formState.errors.confirmPassword?.message}
        >
          <PasswordInput
            placeholder="Repeat your password"
            autoComplete="new-password"
            className="pl-10"
            {...form.register("confirmPassword")}
          />
        </FormField>

        {/* Terms */}
        <div className="space-y-1">
          <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted-foreground select-none">
            <input
              type="checkbox"
              className="mt-0.5 size-3.5 rounded accent-primary"
              {...form.register("terms")}
            />
            <span>
              I agree to the{" "}
              <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
            </span>
          </label>
          {form.formState.errors.terms && (
            <p className="pl-5 text-xs text-destructive">
              {form.formState.errors.terms.message}
            </p>
          )}
        </div>

        <AuthButton loading={busy} className="mt-1">
          Create account
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
