"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSiteContent } from "@/context/SiteContentContext";
import { submitRecruitment } from "@/lib/api";
import { DEPARTMENTS } from "@/constants/society";

const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

const Schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  department: z.string().min(1, "Select your department"),
  semester: z.string().min(1, "Select your semester"),
  club: z.string().min(1, "Select a club"),
  motivation: z
    .string()
    .trim()
    .min(50, "Tell us more — at least 50 characters")
    .max(800, "Keep it under 800 characters"),
});

export default function RecruitmentPage() {
  const { content } = useSiteContent();
  const CLUBS = content.clubs;
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  // if recruited
  useEffect(() => {
    const isRecruited = JSON.parse(localStorage.getItem("isRecruited"));
    if (isRecruited) setDone(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      department: "",
      semester: "",
      club: "",
      motivation: "",
    },
  });

  const onSubmit = async (values) => {
    values.clubIntrested = values.club;
    delete values.club;
    setBusy(true);
    try {
      await submitRecruitment(values);
      localStorage.setItem("isRecruited", JSON.stringify(true));
      setDone(true);
    } catch (e) {
      toast.error("Submission failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <CheckCircle2 className="mx-auto size-12 text-primary" />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Application received!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks for applying to CCS. We&apos;ll review your application and
            reach out within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Recruitment"
        title="Join Core Computing Society."
        description="Applications are open to all computing and engineering students. Pick the club that matches your interests."
      />
      <section className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          {/* Info panel */}
          <aside className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Why join?
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Real projects with teammates",
                  "Weekly sessions & workshops",
                  "Competitions & hackathons",
                  "Industry connections & internships",
                  "Leadership opportunities",
                  "A community that builds together",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Clubs you can join
              </p>
              <div className="mt-3 space-y-2">
                {CLUBS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.slug}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <span>{c.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="rounded-xl border border-border bg-card p-6 md:p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full name"
                error={form.formState.errors.fullName?.message}
              >
                <Input placeholder="Full Name" {...form.register("fullName")} />
              </Field>
              <Field label="Email" error={form.formState.errors.email?.message}>
                <Input
                  type="email"
                  placeholder="you@university.edu"
                  {...form.register("email")}
                />
              </Field>
              <Field label="Phone" error={form.formState.errors.phone?.message}>
                <Input
                  type="tel"
                  placeholder="+92 300 0000000"
                  {...form.register("phone")}
                />
              </Field>
              <Field
                label="Department"
                error={form.formState.errors.department?.message}
              >
                <Select
                  value={form.watch("department")}
                  onValueChange={(v) =>
                    form.setValue("department", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger aria-label="Select department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label="Semester"
                error={form.formState.errors.semester?.message}
              >
                <Select
                  value={form.watch("semester")}
                  onValueChange={(v) =>
                    form.setValue("semester", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger aria-label="Select semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s} semester
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label="Club interest"
                error={form.formState.errors.club?.message}
              >
                <Select
                  value={form.watch("club")}
                  onValueChange={(v) =>
                    form.setValue("club", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger aria-label="Select club">
                    <SelectValue placeholder="Select club" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLUBS.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="mt-5">
              <Field
                label="Why do you want to join?"
                error={form.formState.errors.motivation?.message}
              >
                <Textarea
                  rows={5}
                  placeholder="Tell us about your interests and what you hope to contribute…"
                  {...form.register("motivation")}
                />
              </Field>
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {form.watch("motivation")?.length ?? 0} / 800
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" size="lg" disabled={busy}>
                {busy ? "Submitting…" : "Submit application"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
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
