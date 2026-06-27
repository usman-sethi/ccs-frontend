"use client";

import { PageHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";
import backendMiddleware from "@/backend-middleware";
import { useSiteContent } from "@/context/SiteContentContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AchievementsPage() {
  const { content } = useSiteContent();
  const ACHIEVEMENTS = content.achievements;

  const router = useRouter();
  useEffect(() => {
    (async () => {
      const result = await backendMiddleware("achievements");
      if (!result) router.push("/");
    })();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Achievements"
        title="Wins worth remembering."
        description="A running timeline of what CCS members have achieved — together and individually."
      />
      <section className="container-page py-12 md:py-16">
        <ol className="relative space-y-8 border-l border-border pl-8">
          {ACHIEVEMENTS.map((a, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[37px] top-1.5 flex size-4 items-center justify-center rounded-full border border-border bg-background">
                <span className="size-2 rounded-full bg-primary" />
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{a.year}</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase tracking-wider"
                >
                  {a.kind}
                </Badge>
              </div>
              <h3 className="mt-1.5 text-base font-semibold tracking-tight">
                {a.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {a.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
