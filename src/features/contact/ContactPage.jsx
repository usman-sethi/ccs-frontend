"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSiteContent } from "@/context/SiteContentContext";
import { submitContact } from "@/lib/api";

const Schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: z.string().trim().min(2, "Add a subject").max(120),
  message: z.string().trim().min(10, "Message is too short").max(1500, "Keep it under 1500 chars"),
});

export default function ContactPage() {
  const { content } = useSiteContent();
  const SOCIETY = content.society;
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await submitContact(values);
      toast.success("Message sent", { description: "We'll get back to you within 1–2 days." });
      form.reset();
    } catch (e) {
      toast.error("Could not send message", { description: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch."
        description="Questions, partnerships, sponsorships, or just want to say hi — we'd love to hear from you."
      />
      <section className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-5">
          <InfoCard icon={Mail} title="Email">
            <a href={`mailto:${SOCIETY.email}`} className="hover:text-primary">{SOCIETY.email}</a>
          </InfoCard>
          <InfoCard icon={MapPin} title="Office">{SOCIETY.location}</InfoCard>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Social</p>
            <div className="mt-3 flex items-center gap-1">
              {[
                { href: SOCIETY.social.github, icon: Github, label: "GitHub" },
                { href: SOCIETY.social.linkedin, icon: Linkedin, label: "LinkedIn" },
                { href: SOCIETY.social.twitter, icon: Twitter, label: "Twitter" },
                { href: SOCIETY.social.instagram, icon: Instagram, label: "Instagram" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </aside>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="rounded-xl border border-border bg-card p-6 md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field htmlFor="cname" label="Name" error={form.formState.errors.name?.message}>
              <Input id="cname" {...form.register("name")} />
            </Field>
            <Field htmlFor="cemail" label="Email" error={form.formState.errors.email?.message}>
              <Input id="cemail" type="email" {...form.register("email")} />
            </Field>
          </div>
          <div className="mt-5">
            <Field htmlFor="csubject" label="Subject" error={form.formState.errors.subject?.message}>
              <Input id="csubject" {...form.register("subject")} />
            </Field>
          </div>
          <div className="mt-5">
            <Field htmlFor="cmsg" label="Message" error={form.formState.errors.message?.message}>
              <Textarea id="cmsg" rows={6} {...form.register("message")} />
            </Field>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={submitting} size="lg">
              {submitting ? "Sending..." : "Send message"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-md bg-subtle">
          <Icon className="size-4" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      </div>
      <div className="mt-3 text-sm text-foreground/90">{children}</div>
    </div>
  );
}

function Field({ label, error, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
