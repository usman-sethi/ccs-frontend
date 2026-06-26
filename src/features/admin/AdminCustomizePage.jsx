"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Pencil,
  X,
  Image as ImageIcon,
  GripVertical,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageUploadDialog } from "@/components/shared/ImageUploadDialog";
import { useSiteContent } from "@/context/SiteContentContext";
import { DEFAULT_SITE_CONTENT, ICON_NAMES } from "@/lib/site-content";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Helper hooks / mini-components
───────────────────────────────────────────── */
function SectionTitle({ children, className }) {
  return (
    <h2 className={cn("text-sm font-semibold tracking-tight", className)}>
      {children}
    </h2>
  );
}

function Field({ label, error, children, className }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function RowActions({
  onEdit,
  onDelete,
  onUp,
  onDown,
  disableUp,
  disableDown,
}) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      {onUp && (
        <button
          type="button"
          disabled={disableUp}
          onClick={onUp}
          className="flex size-6 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ArrowUp className="size-3" />
        </button>
      )}
      {onDown && (
        <button
          type="button"
          disabled={disableDown}
          onClick={onDown}
          className="flex size-6 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ArrowDown className="size-3" />
        </button>
      )}
      {onEdit && (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={onEdit}
        >
          <Pencil className="size-3" />
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="size-3" />
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: General (society + stats)
───────────────────────────────────────────── */
function GeneralTab({ raw, update, set }) {
  return (
    <div className="space-y-6">
      <SectionTitle>Society info</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Short name">
          <Input
            value={raw.society.name}
            onChange={(e) => set("society.name", e.target.value)}
          />
        </Field>
        <Field label="Full name">
          <Input
            value={raw.society.fullName}
            onChange={(e) => set("society.fullName", e.target.value)}
          />
        </Field>
        <Field label="Tagline" className="md:col-span-2">
          <Input
            value={raw.society.tagline}
            onChange={(e) => set("society.tagline", e.target.value)}
          />
        </Field>
        <Field label="Email">
          <Input
            value={raw.society.email}
            onChange={(e) => set("society.email", e.target.value)}
          />
        </Field>
        <Field label="Location">
          <Input
            value={raw.society.location}
            onChange={(e) => set("society.location", e.target.value)}
          />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <Textarea
            rows={3}
            value={raw.society.description}
            onChange={(e) => set("society.description", e.target.value)}
          />
        </Field>
      </div>

      <Separator />
      <SectionTitle>Social links</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        {["github", "linkedin", "twitter", "instagram"].map((k) => (
          <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
            <Input
              value={raw.society.social[k] ?? ""}
              onChange={(e) => set(`society.social.${k}`, e.target.value)}
            />
          </Field>
        ))}
      </div>

      <Separator />
      <div className="flex items-center justify-between">
        <SectionTitle>Stats</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update((d) => {
              d.stats.push({ value: "0", label: "New stat" });
            })
          }
        >
          <Plus className="size-3.5 mr-1.5" /> Add stat
        </Button>
      </div>
      <div className="space-y-2">
        {(raw.stats ?? []).map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              className="w-24"
              placeholder="Value"
              value={s.value}
              onChange={(e) =>
                update((d) => {
                  d.stats[i].value = e.target.value;
                })
              }
            />
            <Input
              placeholder="Label"
              value={s.label}
              onChange={(e) =>
                update((d) => {
                  d.stats[i].label = e.target.value;
                })
              }
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() =>
                update((d) => {
                  d.stats.splice(i, 1);
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Hero
───────────────────────────────────────────── */
function HeroTab({ raw, set, openImagePicker }) {
  return (
    <div className="space-y-5">
      <SectionTitle>Hero section</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Badge text" className="md:col-span-2">
          <Input
            value={raw.hero.badge}
            onChange={(e) => set("hero.badge", e.target.value)}
          />
        </Field>
        <Field label="Heading (before accent)">
          <Input
            value={raw.hero.title}
            onChange={(e) => set("hero.title", e.target.value)}
          />
        </Field>
        <Field label="Accent word (highlighted)">
          <Input
            value={raw.hero.accent}
            onChange={(e) => set("hero.accent", e.target.value)}
          />
        </Field>
        <Field label="Primary CTA label">
          <Input
            value={raw.hero.ctaPrimary?.label ?? ""}
            onChange={(e) => set("hero.ctaPrimary.label", e.target.value)}
          />
        </Field>
        <Field label="Primary CTA path">
          <Input
            value={raw.hero.ctaPrimary?.to ?? ""}
            onChange={(e) => set("hero.ctaPrimary.to", e.target.value)}
          />
        </Field>
        <Field label="Secondary CTA label">
          <Input
            value={raw.hero.ctaSecondary?.label ?? ""}
            onChange={(e) => set("hero.ctaSecondary.label", e.target.value)}
          />
        </Field>
        <Field label="Secondary CTA path">
          <Input
            value={raw.hero.ctaSecondary?.to ?? ""}
            onChange={(e) => set("hero.ctaSecondary.to", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Background image URL">
        <div className="flex gap-2">
          <Input
            value={raw.hero.bgImage ?? ""}
            onChange={(e) => set("hero.bgImage", e.target.value)}
            placeholder="https://…"
          />
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => openImagePicker("hero.bgImage", "rect", 16 / 9)}
          >
            <ImageIcon className="size-4" />
          </Button>
        </div>
      </Field>
      {raw.hero.bgImage && (
        <img
          src={raw.hero.bgImage}
          alt=""
          className="h-28 w-full rounded-lg object-cover border border-border"
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Navigation
───────────────────────────────────────────── */
function NavTab({ raw, update }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Navigation links</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update((d) => {
              d.navLinks.push({
                to: "/new-page",
                label: "New link",
                visible: true,
              });
            })
          }
        >
          <Plus className="size-3.5 mr-1.5" /> Add link
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Toggle visibility or use arrows to reorder.
      </p>
      <div className="space-y-2">
        {(raw.navLinks ?? []).map((link, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
          >
            <RowActions
              onUp={() =>
                update((d) => {
                  [d.navLinks[i - 1], d.navLinks[i]] = [
                    d.navLinks[i],
                    d.navLinks[i - 1],
                  ];
                })
              }
              onDown={() =>
                update((d) => {
                  [d.navLinks[i], d.navLinks[i + 1]] = [
                    d.navLinks[i + 1],
                    d.navLinks[i],
                  ];
                })
              }
              disableUp={i === 0}
              disableDown={i === (raw.navLinks?.length ?? 0) - 1}
              onDelete={() =>
                update((d) => {
                  d.navLinks.splice(i, 1);
                })
              }
            />
            <Input
              className="h-7 w-32 text-xs"
              value={link.label}
              onChange={(e) =>
                update((d) => {
                  d.navLinks[i].label = e.target.value;
                })
              }
            />
            <Input
              className="h-7 flex-1 text-xs"
              value={link.to}
              onChange={(e) =>
                update((d) => {
                  d.navLinks[i].to = e.target.value;
                })
              }
            />
            <div className="flex items-center gap-1.5 ml-auto">
              {link.visible ? (
                <Eye className="size-3.5 text-muted-foreground" />
              ) : (
                <EyeOff className="size-3.5 text-muted-foreground" />
              )}
              <Switch
                checked={!!link.visible}
                onCheckedChange={(v) =>
                  update((d) => {
                    d.navLinks[i].visible = v;
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Leadership
───────────────────────────────────────────── */
function LeadershipTab({ raw, update, onEdit }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Leadership</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const idx = (raw.leaders ?? []).length;
            update((d) => {
              d.leaders.push({
                name: "New Leader",
                position: "Role",
                department: "Department",
                linkedin: "#",
                initials: "NL",
              });
            });
            onEdit(idx);
          }}
        >
          <Plus className="size-3.5 mr-1.5" /> Add leader
        </Button>
      </div>
      <div className="space-y-2">
        {(raw.leaders ?? []).map((leader, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-semibold text-primary shrink-0">
              {leader.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{leader.name}</p>
              <p className="text-xs text-muted-foreground">
                {leader.position} · {leader.department}
              </p>
            </div>
            <RowActions
              onEdit={() => onEdit(i)}
              onDelete={() =>
                update((d) => {
                  d.leaders.splice(i, 1);
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Events
───────────────────────────────────────────── */
function EventsTab({ raw, update, onEdit }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Events</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const idx = (raw.events ?? []).length;
            update((d) => {
              d.events.push({
                id: `e-${Date.now()}`,
                title: "New Event",
                date: "TBD",
                venue: "TBD",
                status: "upcoming",
                description: "",
                tag: "Event",
              });
            });
            onEdit(idx);
          }}
        >
          <Plus className="size-3.5 mr-1.5" /> Add event
        </Button>
      </div>
      <div className="space-y-2">
        {(raw.events ?? []).map((event, i) => (
          <div
            key={event.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {event.date} · {event.venue}
              </p>
            </div>
            <Select
              value={event.status}
              onValueChange={(v) =>
                update((d) => {
                  d.events[i].status = v;
                })
              }
            >
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
            <RowActions
              onEdit={() => onEdit(i)}
              onDelete={() =>
                update((d) => {
                  d.events.splice(i, 1);
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Projects
───────────────────────────────────────────── */
function ProjectsTab({ raw, update, onEdit }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Projects</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const idx = (raw.projects ?? []).length;
            update((d) => {
              d.projects.push({
                id: `p-${Date.now()}`,
                name: "New Project",
                description: "",
                tech: [],
                team: [],
                category: "Web",
                github: "",
                demo: "",
              });
            });
            onEdit(idx);
          }}
        >
          <Plus className="size-3.5 mr-1.5" /> Add project
        </Button>
      </div>
      <div className="space-y-2">
        {(raw.projects ?? []).map((project, i) => (
          <div
            key={project.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{project.name}</p>
              <p className="text-xs text-muted-foreground">
                {project.category} ·{" "}
                {(project.tech ?? []).slice(0, 3).join(", ")}
              </p>
            </div>
            <RowActions
              onEdit={() => onEdit(i)}
              onDelete={() =>
                update((d) => {
                  d.projects.splice(i, 1);
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Gallery
───────────────────────────────────────────── */
function GalleryTab({ raw, update, onEdit, openImagePicker }) {
  return (
    <div className="space-y-5">
      {/* Categories */}
      <div className="flex items-center justify-between">
        <SectionTitle>Gallery categories</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update((d) => {
              d.galleryCategories.push("New Category");
            })
          }
        >
          <Plus className="size-3.5 mr-1.5" /> Add category
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(raw.galleryCategories ?? []).map((cat, i) => (
          <div key={i} className="flex items-center gap-1">
            <Input
              className="h-7 w-36 text-xs"
              value={cat}
              onChange={(e) =>
                update((d) => {
                  d.galleryCategories[i] = e.target.value;
                })
              }
            />
            <button
              type="button"
              onClick={() =>
                update((d) => {
                  d.galleryCategories.splice(i, 1);
                })
              }
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Photos */}
      <div className="flex items-center justify-between">
        <SectionTitle>Photos</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const idx = (raw.gallery ?? []).length;
            update((d) => {
              d.gallery.push({
                id: `g-${Date.now()}`,
                category: d.galleryCategories?.[0] ?? "General",
                caption: "New photo",
                aspect: "square",
                hue: 220,
                src: "",
              });
            });
            onEdit(idx);
          }}
        >
          <Plus className="size-3.5 mr-1.5" /> Add photo
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {(raw.gallery ?? []).map((item, i) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-lg border border-border"
          >
            {item.src ? (
              <img
                src={item.src}
                alt={item.caption}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div
                className="aspect-square w-full"
                style={{ background: `hsl(${item.hue} 60% 55% / 0.4)` }}
              />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[10px] text-white truncate flex-1">
                {item.caption}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(i)}
                  className="flex size-6 items-center justify-center rounded bg-white/20 text-white hover:bg-white/40"
                >
                  <Pencil className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    update((d) => {
                      d.gallery.splice(i, 1);
                    })
                  }
                  className="flex size-6 items-center justify-center rounded bg-white/20 text-white hover:bg-red-500/60"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Achievements
───────────────────────────────────────────── */
function AchievementsTab({ raw, update, onEdit }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Achievements</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const idx = (raw.achievements ?? []).length;
            update((d) => {
              d.achievements.unshift({
                year: String(new Date().getFullYear()),
                title: "New Achievement",
                detail: "",
                kind: "Milestone",
              });
            });
            onEdit(0);
          }}
        >
          <Plus className="size-3.5 mr-1.5" /> Add achievement
        </Button>
      </div>
      <div className="space-y-2">
        {(raw.achievements ?? []).map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <span className="shrink-0 rounded bg-subtle px-2 py-0.5 text-xs font-semibold">
              {a.year}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {a.detail}
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px] shrink-0">
              {a.kind}
            </Badge>
            <RowActions
              onEdit={() => onEdit(i)}
              onDelete={() =>
                update((d) => {
                  d.achievements.splice(i, 1);
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Past Papers
───────────────────────────────────────────── */
function PastPapersTab({ raw, update }) {
  const [openSem, setOpenSem] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <SectionTitle>Past papers structure</SectionTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage semesters and subjects. Upload files on the /pastpapers page.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            update((d) => {
              d.pastPapers.push({
                id: `sem-${Date.now()}`,
                name: `Semester ${(d.pastPapers?.length ?? 0) + 1}`,
                subjects: [],
              });
            })
          }
        >
          <Plus className="size-3.5 mr-1.5" /> Add semester
        </Button>
      </div>

      <div className="space-y-3">
        {(raw.pastPapers ?? []).map((sem, si) => (
          <div
            key={sem.id}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpenSem(openSem === si ? null : si)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{sem.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({sem.subjects?.length ?? 0} subjects)
                  </span>
                </div>
              </button>
              <Input
                className="h-7 w-36 text-xs"
                value={sem.name}
                onChange={(e) =>
                  update((d) => {
                    d.pastPapers[si].name = e.target.value;
                  })
                }
              />
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive h-7"
                onClick={() => {
                  if (!confirm(`Delete "${sem.name}" and all its subjects?`))
                    return;
                  update((d) => {
                    d.pastPapers.splice(si, 1);
                  });
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            {openSem === si && (
              <div className="border-t border-border px-4 pb-3 pt-3 space-y-2">
                {(sem.subjects ?? []).map((sub, subi) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2"
                  >
                    <Input
                      className="h-7 flex-1 text-xs"
                      value={sub.name}
                      onChange={(e) =>
                        update((d) => {
                          d.pastPapers[si].subjects[subi].name = e.target.value;
                        })
                      }
                    />
                    <span className="text-xs text-muted-foreground shrink-0">
                      {sub.files?.length ?? 0} files
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        update((d) => {
                          d.pastPapers[si].subjects.splice(subi, 1);
                        })
                      }
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-1"
                  onClick={() =>
                    update((d) => {
                      d.pastPapers[si].subjects.push({
                        id: `sub-${Date.now()}`,
                        name: "New Subject",
                        files: [],
                      });
                    })
                  }
                >
                  <Plus className="size-3.5 mr-1.5" /> Add subject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Theme
───────────────────────────────────────────── */
function ThemeTab({ raw, set }) {
  const t = raw.theme ?? {};
  const navHue = t.navHue ?? 240;
  const navChr = t.navChroma ?? 0.12;
  const navL = t.navLightness ?? 0.22;
  const btnHue = t.navBtnHue ?? 252;
  const btnChr = t.navBtnChroma ?? 0.22;
  const btnL = t.navBtnLightness ?? 0.5;
  return (
    <div className="space-y-6">
      <SectionTitle>Primary colour</SectionTitle>
      <Field label={`Hue — ${t.primaryHue ?? 155}°`}>
        <Slider
          min={0}
          max={360}
          step={1}
          value={[t.primaryHue ?? 155]}
          onValueChange={([v]) => set("theme.primaryHue", v)}
        />
      </Field>
      <Field
        label={`Chroma (saturation) — ${(t.primaryChroma ?? 0.17).toFixed(2)}`}
      >
        <Slider
          min={0}
          max={0.4}
          step={0.01}
          value={[t.primaryChroma ?? 0.17]}
          onValueChange={([v]) => set("theme.primaryChroma", v)}
        />
      </Field>
      <Field label={`Border radius — ${t.radiusRem ?? 0.5}rem`}>
        <Slider
          min={0}
          max={1.5}
          step={0.05}
          value={[t.radiusRem ?? 0.5]}
          onValueChange={([v]) => set("theme.radiusRem", v)}
        />
      </Field>
      {/* Colour preview */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div
          className="h-12 w-full"
          style={{
            background: `oklch(0.53 ${t.primaryChroma ?? 0.17} ${t.primaryHue ?? 155})`,
          }}
        />
        <div className="flex p-3 gap-2">
          <button
            className="px-3 py-1 text-xs font-medium text-white"
            style={{
              background: `oklch(0.53 ${t.primaryChroma ?? 0.17} ${t.primaryHue ?? 155})`,
              borderRadius: `${t.radiusRem ?? 0.5}rem`,
            }}
          >
            Primary
          </button>
          <div
            className="border border-border px-3 py-1 text-xs font-medium"
            style={{ borderRadius: `${t.radiusRem ?? 0.5}rem` }}
          >
            Outline
          </div>
        </div>
      </div>

      <Separator />

      {/* Nav / footer colour */}
      <SectionTitle>Header &amp; footer (light mode)</SectionTitle>
      <p className="text-xs text-muted-foreground -mt-2">
        Controls the background colour of the navbar and footer in light mode.
        White text is always used on top.
      </p>
      <Field label={`Nav hue — ${navHue}°`}>
        <Slider
          min={0}
          max={360}
          step={1}
          value={[navHue]}
          onValueChange={([v]) => set("theme.navHue", v)}
        />
      </Field>
      <Field label={`Nav chroma — ${navChr.toFixed(2)}`}>
        <Slider
          min={0}
          max={0.35}
          step={0.01}
          value={[navChr]}
          onValueChange={([v]) => set("theme.navChroma", v)}
        />
      </Field>
      <Field
        label={`Nav lightness — ${navL.toFixed(2)} (darker = more contrast)`}
      >
        <Slider
          min={0.15}
          max={0.7}
          step={0.01}
          value={[navL]}
          onValueChange={([v]) => set("theme.navLightness", v)}
        />
      </Field>
      <Separator />
      <SectionTitle>Header &amp; footer button (Join CCS)</SectionTitle>
      <p className="text-xs text-muted-foreground -mt-2">
        Controls the colour of the primary CTA button in the navbar. Always
        white text.
      </p>
      <Field label={`Button hue — ${btnHue}°`}>
        <Slider
          min={0}
          max={360}
          step={1}
          value={[btnHue]}
          onValueChange={([v]) => set("theme.navBtnHue", v)}
        />
      </Field>
      <Field label={`Button chroma — ${btnChr.toFixed(2)}`}>
        <Slider
          min={0}
          max={0.35}
          step={0.01}
          value={[btnChr]}
          onValueChange={([v]) => set("theme.navBtnChroma", v)}
        />
      </Field>
      <Field label={`Button lightness — ${btnL.toFixed(2)}`}>
        <Slider
          min={0.25}
          max={0.75}
          step={0.01}
          value={[btnL]}
          onValueChange={([v]) => set("theme.navBtnLightness", v)}
        />
      </Field>

      {/* Nav live preview */}
      <div className="rounded-xl overflow-hidden border border-border">
        <div
          className="flex items-center justify-between px-4 py-3 gap-4"
          style={{ background: `oklch(${navL} ${navChr} ${navHue})` }}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-white/20 text-[9px] font-bold text-white">
              CCS
            </div>
            <span className="text-xs font-semibold text-white">
              Core Computing Society
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/75 hover:text-white">Home</span>
            <span className="text-xs text-white/75">Clubs</span>
            <span className="text-xs text-white/75">Events</span>
            <span
              className="rounded px-2.5 py-1 text-[10px] font-semibold text-white"
              style={{ background: `oklch(${btnL} ${btnChr} ${btnHue})` }}
            >
              Join CCS
            </span>
          </div>
        </div>
        <div className="px-4 py-2 text-[10px] text-muted-foreground bg-muted/50">
          ↑ Live nav preview (light mode)
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab: Member Fields
───────────────────────────────────────────── */
function MemberFieldsTab({ raw, update }) {
  return (
    <div className="space-y-4">
      <SectionTitle>Club member card fields</SectionTitle>
      <p className="text-xs text-muted-foreground">
        Toggle which fields are shown on club member cards.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(raw.clubMemberFields ?? {}).map(([key, val]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-2.5"
          >
            <Label className="text-sm capitalize cursor-pointer">{key}</Label>
            <Switch
              checked={!!val}
              onCheckedChange={(v) =>
                update((d) => {
                  d.clubMemberFields[key] = v;
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sheet: Edit Club (with full member management)
───────────────────────────────────────────── */
const ROLES = ["leader", "female-leader", "co-leader", "member"];
const MEMBER_DEFAULTS = {
  name: "",
  role: "member",
  title: "",
  department: "",
  year: "",
  bio: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  avatar: "",
};
const DEPARTMENTS_LIST = [
  "Software Engineering",
  "Artificial Intelligence",
  "Cyber Security",
  "Data Science",
  "Computer Science",
  "Other",
];
const YEAR_LIST = ["1st year", "2nd year", "3rd year", "4th year", "Alumni"];

function MemberEditDialog({ member, onClose, onSave }) {
  const [draft, setDraft] = useState(member);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const set = (k, v) => setDraft((p) => ({ ...p, [k]: v }));

  return (
    <>
      <Dialog open onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit member" : "Add member"}</DialogTitle>
            <DialogDescription>
              {draft.name || "Fill in the member details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="size-14 ring-2 ring-border">
                <AvatarImage src={draft.avatar} alt="" />
                <AvatarFallback className="text-lg">
                  {draft.name
                    ?.split(" ")
                    .map((p) => p[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5 flex-1">
                <Label className="text-xs font-medium text-muted-foreground">
                  Avatar URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={draft.avatar ?? ""}
                    onChange={(e) => set("avatar", e.target.value)}
                    placeholder="https://…"
                    className="text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAvatarOpen(true)}
                  >
                    <ImageIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" className="sm:col-span-2">
                <Input
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Muhammad Usman"
                />
              </Field>
              <Field label="Role">
                <Select
                  value={draft.role}
                  onValueChange={(v) => set("role", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Title (optional)">
                <Input
                  value={draft.title ?? ""}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="President"
                />
              </Field>
              <Field label="Department">
                <Select
                  value={draft.department ?? ""}
                  onValueChange={(v) => set("department", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS_LIST.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Year">
                <Select
                  value={draft.year ?? ""}
                  onValueChange={(v) => set("year", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_LIST.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="LinkedIn URL">
                <Input
                  value={draft.linkedin ?? ""}
                  onChange={(e) => set("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/…"
                />
              </Field>
              <Field label="GitHub URL">
                <Input
                  value={draft.github ?? ""}
                  onChange={(e) => set("github", e.target.value)}
                  placeholder="https://github.com/…"
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={draft.email ?? ""}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <Input
                  type="tel"
                  value={draft.phone ?? ""}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
              <Field label="Bio" className="sm:col-span-2">
                <Textarea
                  rows={2}
                  value={draft.bio ?? ""}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Short intro…"
                />
              </Field>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onSave(draft)}
              disabled={!draft.name?.trim()}
            >
              Save member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageUploadDialog
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        shape="round"
        aspect={1}
        maxEdge={400}
        title="Upload avatar"
        onConfirm={(url) => set("avatar", url)}
      />
    </>
  );
}

function ClubSheet({ club, onClose, onSave }) {
  const [draft, setDraft] = useState({
    ...club,
    people: Array.isArray(club.people) ? [...club.people] : [],
  });
  const [memberDialog, setMemberDialog] = useState(null); // { index: number|null, data: member }
  const [avatarOpen, setAvatarOpen] = useState(false);

  const setField = (k, v) => setDraft((p) => ({ ...p, [k]: v }));

  const openAddMember = () =>
    setMemberDialog({ index: null, data: { ...MEMBER_DEFAULTS } });
  const openEditMember = (i) =>
    setMemberDialog({ index: i, data: structuredClone(draft.people[i]) });
  const deleteMember = (i) =>
    setDraft((p) => ({ ...p, people: p.people.filter((_, j) => j !== i) }));

  const saveMember = (data) => {
    setDraft((p) => {
      const people = [...(p.people ?? [])];
      const entry = data.id ? data : { ...data, id: `m-${Date.now()}` };
      if (memberDialog.index === null) {
        people.push(entry);
      } else {
        people[memberDialog.index] = entry;
      }
      return { ...p, people };
    });
    setMemberDialog(null);
    toast.success(
      memberDialog.index === null ? "Member added" : "Member updated",
    );
  };

  const moveMember = (i, dir) => {
    setDraft((p) => {
      const people = [...p.people];
      const j = i + dir;
      if (j < 0 || j >= people.length) return p;
      [people[i], people[j]] = [people[j], people[i]];
      return { ...p, people };
    });
  };

  return (
    <>
      <Sheet open onOpenChange={(o) => !o && onClose()}>
        <SheetContent
          className="w-full max-w-[560px] overflow-y-auto"
          side="right"
        >
          <SheetHeader className="mb-4">
            <SheetTitle>Edit club</SheetTitle>
            <SheetDescription>{draft.name}</SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            {/* Club info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" className="sm:col-span-2">
                <Input
                  value={draft.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </Field>
              <Field label="Slug (URL key)">
                <Input
                  value={draft.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                />
              </Field>
              <Field label="Icon">
                <Select
                  value={draft.iconName}
                  onValueChange={(v) => setField("iconName", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_NAMES.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Tagline" className="sm:col-span-2">
                <Input
                  value={draft.tagline ?? ""}
                  onChange={(e) => setField("tagline", e.target.value)}
                />
              </Field>
              <Field label="Short description" className="sm:col-span-2">
                <Textarea
                  rows={2}
                  value={draft.short}
                  onChange={(e) => setField("short", e.target.value)}
                />
              </Field>
              <Field label="About (detail page)" className="sm:col-span-2">
                <Textarea
                  rows={3}
                  value={draft.about ?? ""}
                  onChange={(e) => setField("about", e.target.value)}
                />
              </Field>
              <Field label="Member count">
                <Input
                  type="number"
                  value={draft.members}
                  onChange={(e) => setField("members", Number(e.target.value))}
                />
              </Field>
              <Field label="Leads (comma-separated)">
                <Input
                  value={(draft.leads ?? []).join(", ")}
                  onChange={(e) =>
                    setField(
                      "leads",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </Field>
            </div>

            <Separator />

            {/* Member management */}
            <div className="flex items-center justify-between">
              <SectionTitle>Members ({draft.people?.length ?? 0})</SectionTitle>
              <Button size="sm" variant="outline" onClick={openAddMember}>
                <Plus className="size-3.5 mr-1.5" /> Add member
              </Button>
            </div>

            <div className="space-y-2">
              {(draft.people ?? []).length === 0 && (
                <p className="text-xs text-muted-foreground py-2">
                  No members yet. Click "Add member" to get started.
                </p>
              )}
              {(draft.people ?? []).map((m, i) => (
                <div
                  key={m.id ?? i}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2"
                >
                  <RowActions
                    onUp={() => moveMember(i, -1)}
                    onDown={() => moveMember(i, 1)}
                    disableUp={i === 0}
                    disableDown={i === draft.people.length - 1}
                  />
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={m.avatar} alt="" />
                    <AvatarFallback className="text-xs">
                      {m.name
                        ?.split(" ")
                        .map((p) => p[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.role}
                      {m.department ? ` · ${m.department}` : ""}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {m.role}
                  </Badge>
                  <RowActions
                    onEdit={() => openEditMember(i)}
                    onDelete={() => {
                      if (confirm(`Remove ${m.name}?`)) deleteMember(i);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => onSave(draft)}>Save club</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {memberDialog && (
        <MemberEditDialog
          member={memberDialog.data}
          onClose={() => setMemberDialog(null)}
          onSave={saveMember}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Sheet: Edit Leader
───────────────────────────────────────────── */
function LeaderSheet({ leader, onClose, onSave }) {
  const [draft, setDraft] = useState(leader);
  const set = (k, v) => setDraft((p) => ({ ...p, [k]: v }));
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Edit leader</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Field label="Name">
            <Input
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Position">
            <Input
              value={draft.position}
              onChange={(e) => set("position", e.target.value)}
            />
          </Field>
          <Field label="Department">
            <Input
              value={draft.department}
              onChange={(e) => set("department", e.target.value)}
            />
          </Field>
          <Field label="Initials (2 chars)">
            <Input
              maxLength={2}
              value={draft.initials ?? ""}
              onChange={(e) => set("initials", e.target.value.toUpperCase())}
            />
          </Field>
          <Field label="LinkedIn URL">
            <Input
              value={draft.linkedin ?? ""}
              onChange={(e) => set("linkedin", e.target.value)}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(draft)}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─────────────────────────────────────────────
   Sheet: Edit Event
───────────────────────────────────────────── */
function EventSheet({ event, onClose, onSave }) {
  const [draft, setDraft] = useState(event);
  const set = (k, v) => setDraft((p) => ({ ...p, [k]: v }));
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Edit event</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Field label="Title">
            <Input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field label="Date">
            <Input
              value={draft.date}
              onChange={(e) => set("date", e.target.value)}
              placeholder="Jul 18, 2026"
            />
          </Field>
          <Field label="Venue">
            <Input
              value={draft.venue}
              onChange={(e) => set("venue", e.target.value)}
            />
          </Field>
          <Field label="Tag">
            <Input
              value={draft.tag}
              onChange={(e) => set("tag", e.target.value)}
              placeholder="Workshop"
            />
          </Field>
          <Field label="Status">
            <Select
              value={draft.status}
              onValueChange={(v) => set("status", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Description">
            <Textarea
              rows={3}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(draft)}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─────────────────────────────────────────────
   Sheet: Edit Project
───────────────────────────────────────────── */
function ProjectSheet({ project, onClose, onSave }) {
  const [draft, setDraft] = useState(project);
  const set = (k, v) => setDraft((p) => ({ ...p, [k]: v }));
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Edit project</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Field label="Name">
            <Input
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Description">
            <Textarea
              rows={2}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <Field label="Category">
            <Input
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Web, AI, Mobile…"
            />
          </Field>
          <Field label="Tech stack (comma-separated)">
            <Input
              value={(draft.tech ?? []).join(", ")}
              onChange={(e) =>
                set(
                  "tech",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
          <Field label="Team (comma-separated)">
            <Input
              value={(draft.team ?? []).join(", ")}
              onChange={(e) =>
                set(
                  "team",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
          <Field label="GitHub URL">
            <Input
              value={draft.github ?? ""}
              onChange={(e) => set("github", e.target.value)}
              placeholder="https://github.com/…"
            />
          </Field>
          <Field label="Demo URL">
            <Input
              value={draft.demo ?? ""}
              onChange={(e) => set("demo", e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(draft)}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─────────────────────────────────────────────
   Sheet: Edit Gallery item
───────────────────────────────────────────── */
function GallerySheet({ item, categories, onClose, onSave }) {
  const [draft, setDraft] = useState(item);
  const [imgOpen, setImgOpen] = useState(false);
  const set = (k, v) => setDraft((p) => ({ ...p, [k]: v }));
  return (
    <>
      <Sheet open onOpenChange={(o) => !o && onClose()}>
        <SheetContent className="overflow-y-auto" side="right">
          <SheetHeader>
            <SheetTitle>Edit gallery photo</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Field label="Caption">
              <Input
                value={draft.caption}
                onChange={(e) => set("caption", e.target.value)}
              />
            </Field>
            <Field label="Category">
              <Select
                value={draft.category}
                onValueChange={(v) => set("category", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(categories ?? []).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Aspect ratio">
              <Select
                value={draft.aspect}
                onValueChange={(v) => set("aspect", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square (1:1)</SelectItem>
                  <SelectItem value="wide">Wide (4:3)</SelectItem>
                  <SelectItem value="tall">Tall (3:4)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Image URL">
              <div className="flex gap-2">
                <Input
                  value={draft.src ?? ""}
                  onChange={(e) => set("src", e.target.value)}
                  placeholder="https://…"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setImgOpen(true)}
                >
                  <ImageIcon className="size-4" />
                </Button>
              </div>
            </Field>
            {draft.src && (
              <img
                src={draft.src}
                alt=""
                className="h-24 w-full rounded-lg object-cover border border-border"
              />
            )}
            <Field label={`Fallback hue — ${draft.hue}°`}>
              <Slider
                min={0}
                max={360}
                step={1}
                value={[draft.hue ?? 220]}
                onValueChange={([v]) => set("hue", v)}
              />
            </Field>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => onSave(draft)}>Save</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <ImageUploadDialog
        open={imgOpen}
        onOpenChange={setImgOpen}
        shape="rect"
        aspect={4 / 3}
        title="Upload photo"
        onConfirm={(url) => set("src", url)}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   Sheet: Edit Achievement
───────────────────────────────────────────── */
const ACHIEVEMENT_KINDS = [
  "Hackathon",
  "Milestone",
  "Publication",
  "Competition",
  "Certification",
  "Award",
];

function AchievementSheet({ achievement, onClose, onSave }) {
  const [draft, setDraft] = useState(achievement);
  const set = (k, v) => setDraft((p) => ({ ...p, [k]: v }));
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Edit achievement</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Field label="Year">
            <Input
              value={draft.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="2026"
            />
          </Field>
          <Field label="Title">
            <Input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field label="Detail">
            <Textarea
              rows={2}
              value={draft.detail}
              onChange={(e) => set("detail", e.target.value)}
            />
          </Field>
          <Field label="Kind">
            <Select value={draft.kind} onValueChange={(v) => set("kind", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACHIEVEMENT_KINDS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(draft)}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ─────────────────────────────────────────────
   Clubs Tab
───────────────────────────────────────────── */
function ClubsTab({ raw, update, onEdit }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Clubs</SectionTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const idx = (raw.clubs ?? []).length;
            update((d) => {
              d.clubs.push({
                slug: `club-${Date.now()}`,
                name: "New Club",
                iconName: "Code2",
                short: "Short description.",
                description: "Full description.",
                about: "About this club.",
                tagline: "Club tagline.",
                members: 0,
                leads: [],
                people: [],
              });
            });
            onEdit(idx);
          }}
        >
          <Plus className="size-3.5 mr-1.5" /> Add club
        </Button>
      </div>
      <div className="space-y-2">
        {(raw.clubs ?? []).map((club, i) => (
          <div
            key={club.slug}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{club.name}</p>
              <p className="text-xs text-muted-foreground">
                {club.slug} · {club.members} members ·{" "}
                {Array.isArray(club.people) ? club.people.length : 0} people
              </p>
            </div>
            <RowActions
              onEdit={() => onEdit(i)}
              onDelete={() => {
                if (!confirm(`Delete club "${club.name}"?`)) return;
                update((d) => {
                  d.clubs.splice(i, 1);
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function AdminCustomizePage() {
  const { raw, update, reset, exportJson, importJson } = useSiteContent();
  const [tab, setTab] = useState("general");
  const importRef = useRef(null);

  const { isAdmin } = useAuth();

  // Sheet/dialog state
  const [clubSheet, setClubSheet] = useState(null); // { index }
  const [leaderSheet, setLeaderSheet] = useState(null); // { index }
  const [eventSheet, setEventSheet] = useState(null); // { index }
  const [projectSheet, setProjectSheet] = useState(null);
  const [gallerySheet, setGallerySheet] = useState(null);
  const [achievementSheet, setAchievementSheet] = useState(null);

  // Top-level image picker (for fields like hero.bgImage)
  const [imageTarget, setImageTarget] = useState(null); // { path, shape, aspect }

  /* helpers */
  const set = (path, value) =>
    update((d) => {
      const parts = path.split(".");
      let obj = d;
      for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] === undefined) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
    });

  const openImagePicker = (path, shape = "rect", aspect = 1) =>
    setImageTarget({ path, shape, aspect });

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ccs-content.json";
    a.click();
    toast.success("Content exported");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importJson(reader.result);
      if (result.ok) toast.success("Content imported");
      else toast.error("Import failed", { description: result.error });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (!confirm("Reset ALL content to defaults? This cannot be undone."))
      return;
    reset();
    toast.success("Content reset to defaults");
  };

  /* Sheet save helpers */
  const saveClub = (data) => {
    update((d) => {
      d.clubs[clubSheet.index] = { ...d.clubs[clubSheet.index], ...data };
    });
    setClubSheet(null);
    toast.success("Club saved");
  };

  const saveLeader = (data) => {
    update((d) => {
      d.leaders[leaderSheet.index] = data;
    });
    setLeaderSheet(null);
    toast.success("Leader saved");
  };

  const saveEvent = (data) => {
    update((d) => {
      d.events[eventSheet.index] = data;
    });
    setEventSheet(null);
    toast.success("Event saved");
  };

  const saveProject = (data) => {
    update((d) => {
      d.projects[projectSheet.index] = data;
    });
    setProjectSheet(null);
    toast.success("Project saved");
  };

  const saveGallery = (data) => {
    update((d) => {
      d.gallery[gallerySheet.index] = data;
    });
    setGallerySheet(null);
    toast.success("Photo saved");
  };

  const saveAchievement = (data) => {
    update((d) => {
      d.achievements[achievementSheet.index] = data;
    });
    setAchievementSheet(null);
    toast.success("Achievement saved");
  };

  /* Tab labels */
  let TABS = [
    { value: "general", label: "General" },
    { value: "hero", label: "Hero" },
    { value: "nav", label: "Navigation" },
    { value: "clubs", label: "Clubs" },
    { value: "leadership", label: "Leadership" },
    { value: "events", label: "Events" },
    { value: "projects", label: "Projects" },
    { value: "gallery", label: "Gallery" },
    { value: "achievements", label: "Achievements" },
    { value: "pastpapers", label: "Past Papers" },
    { value: "theme", label: "Theme" },
    { value: "memberfields", label: "Member Fields" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Customize</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Changes save automatically to localStorage.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="size-3.5 mr-1.5" /> Export JSON
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => importRef.current?.click()}
          >
            <Upload className="size-3.5 mr-1.5" /> Import JSON
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={handleReset}
          >
            <RotateCcw className="size-3.5 mr-1.5" /> Reset
          </Button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex h-auto flex-wrap gap-1 justify-start bg-muted/50 p-1">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="text-xs px-3 py-1.5"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent
            key={t.value}
            value={t.value}
            className="mt-4 rounded-xl border border-border bg-card p-5"
          >
            {t.value === "general" && (
              <GeneralTab raw={raw} update={update} set={set} />
            )}
            {t.value === "hero" && (
              <HeroTab raw={raw} set={set} openImagePicker={openImagePicker} />
            )}
            {t.value === "nav" && <NavTab raw={raw} update={update} />}
            {t.value === "clubs" && (
              <ClubsTab
                raw={raw}
                update={update}
                onEdit={(i) => setClubSheet({ index: i })}
              />
            )}
            {t.value === "leadership" && (
              <LeadershipTab
                raw={raw}
                update={update}
                onEdit={(i) => setLeaderSheet({ index: i })}
              />
            )}
            {t.value === "events" && (
              <EventsTab
                raw={raw}
                update={update}
                onEdit={(i) => setEventSheet({ index: i })}
              />
            )}
            {t.value === "projects" && (
              <ProjectsTab
                raw={raw}
                update={update}
                onEdit={(i) => setProjectSheet({ index: i })}
              />
            )}
            {t.value === "gallery" && (
              <GalleryTab
                raw={raw}
                update={update}
                onEdit={(i) => setGallerySheet({ index: i })}
                openImagePicker={openImagePicker}
              />
            )}
            {t.value === "achievements" && (
              <AchievementsTab
                raw={raw}
                update={update}
                onEdit={(i) => setAchievementSheet({ index: i })}
              />
            )}
            {t.value === "pastpapers" && (
              <PastPapersTab raw={raw} update={update} />
            )}
            {t.value === "theme" && <ThemeTab raw={raw} set={set} />}
            {t.value === "memberfields" && (
              <MemberFieldsTab raw={raw} update={update} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Sheets ── */}
      {clubSheet && (
        <ClubSheet
          club={structuredClone(
            raw.clubs?.[clubSheet.index] ?? DEFAULT_SITE_CONTENT.clubs[0],
          )}
          onClose={() => setClubSheet(null)}
          onSave={saveClub}
        />
      )}

      {leaderSheet && (
        <LeaderSheet
          leader={structuredClone(raw.leaders?.[leaderSheet.index] ?? {})}
          onClose={() => setLeaderSheet(null)}
          onSave={saveLeader}
        />
      )}

      {eventSheet && (
        <EventSheet
          event={structuredClone(raw.events?.[eventSheet.index] ?? {})}
          onClose={() => setEventSheet(null)}
          onSave={saveEvent}
        />
      )}

      {projectSheet && (
        <ProjectSheet
          project={structuredClone(raw.projects?.[projectSheet.index] ?? {})}
          onClose={() => setProjectSheet(null)}
          onSave={saveProject}
        />
      )}

      {gallerySheet && (
        <GallerySheet
          item={structuredClone(raw.gallery?.[gallerySheet.index] ?? {})}
          categories={raw.galleryCategories ?? []}
          onClose={() => setGallerySheet(null)}
          onSave={saveGallery}
        />
      )}

      {achievementSheet && (
        <AchievementSheet
          achievement={structuredClone(
            raw.achievements?.[achievementSheet.index] ?? {},
          )}
          onClose={() => setAchievementSheet(null)}
          onSave={saveAchievement}
        />
      )}

      {/* Top-level image picker (for hero background etc.) */}
      <ImageUploadDialog
        open={!!imageTarget}
        onOpenChange={(o) => !o && setImageTarget(null)}
        shape={imageTarget?.shape ?? "rect"}
        aspect={imageTarget?.aspect ?? 1}
        title="Upload image"
        onConfirm={(url) => {
          if (!imageTarget?.path) return;
          set(imageTarget.path, url);
          toast.success("Image updated");
          setImageTarget(null);
        }}
      />
    </div>
  );
}
