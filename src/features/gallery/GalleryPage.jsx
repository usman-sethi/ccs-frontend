"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/SectionHeader";
import { GalleryTile } from "@/components/shared/cards";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSiteContent } from "@/context/SiteContentContext";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const { content } = useSiteContent();
  const GALLERY = content.gallery;
  const GALLERY_CATEGORIES = content.galleryCategories;
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(null);

  const items = useMemo(
    () => (cat === "All" ? GALLERY : GALLERY.filter((g) => g.category === cat)),
    [cat, GALLERY]
  );

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments from CCS."
        description="Workshops, seminars, hackathons, orientation and community days."
      />
      <section className="container-page py-12 md:py-16">
        <div className="flex flex-wrap gap-1.5">
          {["All", ...GALLERY_CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                cat === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
          {items.map((g) => (
            <div key={g.id} className="break-inside-avoid">
              <GalleryTile item={g} onClick={() => setActive(g)} />
            </div>
          ))}
        </div>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {active && (
            <>
              {active.src ? (
                <img
                  src={active.src}
                  alt={active.caption}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  className="aspect-[16/10] w-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, hsl(${active.hue} 60% 55% / 0.9), hsl(${(active.hue + 40) % 360} 55% 35% / 0.95))`,
                  }}
                  aria-hidden
                />
              )}
              <div className="p-5">
                <DialogTitle className="text-sm font-semibold">{active.caption}</DialogTitle>
                <DialogDescription className="mt-1 text-xs">{active.category}</DialogDescription>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
