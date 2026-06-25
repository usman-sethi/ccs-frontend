"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSiteContent } from "@/context/SiteContentContext";
import { submitContact } from "@/lib/api";

const whatsappSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.1.55 4.15 1.59 5.95L0 24l6.28-1.64a11.93 11.93 0 0 0 5.78 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.5-8.41zM12.07 21.82h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.87 9.87 0 0 1-1.52-5.25c0-5.47 4.45-9.92 9.92-9.92 2.65 0 5.14 1.03 7.01 2.91a9.84 9.84 0 0 1 2.9 7c0 5.47-4.45 9.92-9.94 9.92zm5.44-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.01-1.04 2.46s1.06 2.86 1.2 3.06c.15.2 2.08 3.18 5.03 4.46.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
  </svg>
);

const tiktokSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.77h-3.13v12.7a2.9 2.9 0 1 1-2.9-2.9c.24 0 .47.03.69.08V8.63a6.03 6.03 0 0 0-.69-.04A6.04 6.04 0 1 0 15.82 14V7.56a7.92 7.92 0 0 0 4.64 1.49V6.69h-.87z" />
  </svg>
);

const Schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  subject: z.string().trim().min(2, "Add a subject").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Message is too short")
    .max(1500, "Keep it under 1500 chars"),
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
      toast.success("Message sent", {
        description: "We'll get back to you within 2 business days",
      });
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
            <a href={`mailto:${SOCIETY.email}`} className="hover:text-primary">
              {SOCIETY.email}
            </a>
          </InfoCard>
          <InfoCard icon={MapPin} title="location">
            {SOCIETY.location}
          </InfoCard>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Social
            </p>
            <div className="mt-3 flex items-center gap-1">
              {[
                { href: SOCIETY.social.github, icon: Github, label: "GitHub" },
                {
                  href: SOCIETY.social.linkedin,
                  icon: Linkedin,
                  label: "LinkedIn",
                },
                {
                  href: SOCIETY.social.instagram,
                  icon: Instagram,
                  label: "Instagram",
                },
                {
                  href: SOCIETY.social?.tiktok,
                  icon: tiktokSVG,
                  label: "Tiktok",
                },
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
            <Field
              htmlFor="cname"
              label="Name"
              error={form.formState.errors.name?.message}
            >
              <Input
                placeholder="e.g, Muhammad Musa"
                id="cname"
                {...form.register("name")}
              />
            </Field>
            <Field
              htmlFor="cemail"
              label="Email"
              error={form.formState.errors.email?.message}
            >
              <Input
                id="cemail"
                placeholder="musa@example.com"
                type="email"
                {...form.register("email")}
              />
            </Field>
          </div>
          <div className="mt-5">
            <Field
              htmlFor="csubject"
              label="Subject"
              error={form.formState.errors.subject?.message}
            >
              <Input
                placeholder="Enter the subject of your email"
                id="csubject"
                {...form.register("subject")}
              />
            </Field>
          </div>
          <div className="mt-5">
            <Field
              htmlFor="cmsg"
              label="Message"
              error={form.formState.errors.message?.message}
            >
              <Textarea
                placeholder="Tell me about your project, question, or how I can help..."
                id="cmsg"
                rows={6}
                {...form.register("message")}
              />
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
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="mt-3 text-sm text-foreground/90">{children}</div>
    </div>
  );
}

function Field({ label, error, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
