"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Shield,
  Download,
  Eye,
  X,
  Award,
  CreditCard,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  QrCode,
  CodeXml,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageUploadDialog } from "@/components/shared/ImageUploadDialog";
import { CCSCard } from "@/components/shared/CCSCard";
import { useAuth } from "@/context/AuthContext";
import { DEPARTMENTS } from "@/constants/society";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCardStatus, applyForCard } from "@/lib/card-status";
import {
  getCertificatesFor,
  getTemplates,
  downloadCertificate,
  renderCertificateToCanvas,
  seedDemoTemplates,
  seedDemoIssuedCerts,
} from "@/lib/certificate-templates";

/* ─── Profile form schema ─── */
const Schema = z.object({
  fullName: z.string().trim().min(2).max(80),
  department: z.string().optional(),
  year: z.string().optional(),
  bio: z.string().max(300).optional(),
  linkedin: z.string().url().or(z.literal("")).optional(),
  github: z.string().url().or(z.literal("")).optional(),
});

const YEARS = ["1st year", "2nd year", "3rd year", "4th year", "Alumni"];

/* ─── Certificate thumbnail — uses real template image as thumbnail ─── */
function CertCard({ cert, template, onView, onDownload, downloading }) {
  // Show template background as thumbnail; name is overlaid in text
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-[1.414/1] overflow-hidden bg-muted">
        {template?.bgImageDataUrl ? (
          <img
            src={template.bgImageDataUrl}
            alt={cert.templateName}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Award className="size-6 text-primary/40" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-[10px] font-semibold truncate leading-tight">
          {cert.fieldValues?.title || cert.templateName}
        </p>
        <p className="text-[9px] text-muted-foreground">
          {cert.fieldValues?.date ||
            new Date(cert.issuedAt).toLocaleDateString()}
        </p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          className="h-7 px-2 text-xs gap-1"
          onClick={() => onView(cert)}
        >
          <Eye className="size-3" /> View
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-7 px-2 text-xs gap-1"
          disabled={downloading === cert.id}
          onClick={() => onDownload(cert)}
        >
          <Download className="size-3" />{" "}
          {downloading === cert.id ? "…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Certificate lightbox ─── */
function CertViewer({ cert, template, onClose, onDownload, downloading }) {
  if (!cert) return null;
  const canvasRef = useRef(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!template || !canvasRef.current) return;
    renderCertificateToCanvas(
      canvasRef.current,
      template,
      cert.fieldValues,
      900,
    )
      .then(() => setRendered(true))
      .catch(() => {});
  }, [cert, template]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {cert.fieldValues?.title || cert.templateName}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Certificate for {cert.recipientName}
        </DialogDescription>
        <div className="relative bg-muted min-h-40">
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{
              aspectRatio: `${template?.bgImageWidth ?? 1.414} / ${template?.bgImageHeight ?? 1}`,
              imageRendering: "pixelated",
            }}
          />
          {!rendered && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              Rendering…
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold">
              {cert.fieldValues?.title || cert.templateName}
            </p>
            <p className="text-xs text-muted-foreground">
              {cert.certNumber} · Issued{" "}
              {new Date(cert.issuedAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            size="sm"
            disabled={downloading === cert.id}
            onClick={() => onDownload(cert)}
            className="gap-1.5"
          >
            <Download className="size-3.5" />{" "}
            {downloading === cert.id ? "Downloading…" : "Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── CCS Card section ─── */
function CardSection({ user }) {
  const [cardData, setCardData] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    setCardData(getCardStatus());
  }, []);

  const handleApply = () => {
    const data = applyForCard(user?.fullName || "Member");
    setCardData(data);
    toast.success("Card application submitted!", {
      description: "Your card will be issued by an admin.",
    });
  };

  if (!cardData)
    return <div className="h-16 animate-pulse rounded-xl bg-muted" />;

  const name = user?.fullName || "Member";
  const dept = user?.department || "Computing";
  const since = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "2024";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">CCS Membership Card</h3>
        </div>
        {cardData.status === "issued" && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3" /> Active
          </span>
        )}
        {cardData.status === "pending" && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="size-3" /> Pending
          </span>
        )}
      </div>

      {cardData.status === "none" ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-center space-y-3">
          {/* Ghost card preview */}
          <div className="mx-auto max-w-[260px] rounded-xl border-2 border-dashed border-border/50 bg-muted/30 aspect-[1.6] flex items-center justify-center">
            <div className="text-center">
              <CreditCard className="size-8 mx-auto text-muted-foreground/40" />
              <p className="text-[10px] text-muted-foreground/50 mt-1">
                Your card appears here
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Apply for your CCS member card
          </p>
          <Button size="sm" className="w-full" onClick={handleApply}>
            Apply for card
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <CCSCard
            name={name}
            department={dept}
            cardNumber={cardData.cardNumber ?? "•••• •••• •••• ••••"}
            validThrough="12/27"
            memberSince={String(since)}
          />
          <p className="text-center text-[10px] text-muted-foreground">
            Click card to flip
          </p>
          {cardData.status === "pending" && (
            <p className="text-center text-[10px] text-amber-600 dark:text-amber-400">
              Awaiting admin approval
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Dashboard Page
═══════════════════════════════════════ */
export default function DashboardPage() {
  const { user, isAdmin, isDeveloper, updateProfile } = useAuth();
  const router = useRouter()
  const [busy, setBusy] = useState(false);
  const [avatarDialog, setAvatarDialog] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatarUrl || "");

  useEffect(() => {
    if (!user) router.push("/")
  })

  // Real certificates from the certificate system
  const [certs, setCerts] = useState([]);
  const [certTemplates, setCertTemplates] = useState([]);
  const [activeCert, setActiveCert] = useState(null);
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(null);
  const visibleCerts = showAllCerts ? certs : certs.slice(0, 4);

  const loadCerts = useCallback(async () => {
    await seedDemoTemplates();
    const tmpls = getTemplates();
    setCertTemplates(tmpls);
    seedDemoIssuedCerts(tmpls);
    const name = user?.fullName || "Ayesha Khan";
    setCerts(getCertificatesFor(name));
  }, [user?.fullName]);

  // useEffect(() => {
  //   loadCerts();
  // }, [loadCerts]);

  const findTemplate = (cert) =>
    certTemplates.find((t) => t.id === cert.templateId);

  const handleDownloadCert = async (cert) => {
    const tmpl = findTemplate(cert);
    if (!tmpl) {
      toast.error("Certificate template not found.");
      return;
    }
    setDownloadingCert(cert.id);
    try {
      const safeName = cert.recipientName.toLowerCase().replace(/\s+/g, "-");
      await downloadCertificate(
        tmpl,
        cert.fieldValues,
        `${safeName}-${cert.category}-certificate.png`,
      );
      toast.success("Certificate downloaded.");
    } catch (e) {
      toast.error("Download failed", { description: e.message });
    } finally {
      setDownloadingCert(null);
    }
  };

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      fullName: user?.fullName || "",
      department: user?.department || "",
      year: user?.year || "",
      bio: user?.bio || "",
      linkedin: user?.linkedin || "",
      github: user?.github || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        department: user.department || "",
        year: user.year || "",
        bio: user.bio || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
      });
      setAvatar(user.avatarUrl || "");
    }
  }, [user]);

  const onSubmit = async (values, e) => {
    e.preventDefault();
    if (!user._id) return;

    setBusy(true);

    try {
      await updateProfile({ ...values, id: user._id });
      for (const el in values) {
        user[el] = values[el];
      }
      toast.success("Profile updated");
    } catch (e) {
      toast.error("Update failed", { description: e.message });
    } finally {
      setBusy(false);
    }
  };

  const initials =
    (user?.fullName || "")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border bg-surface">
        <div className="container-page flex items-center justify-between py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              My profile
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email ?? "guest@ccs.dev"}
            </p>
          </div>
          {isAdmin ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/recruitment">
                <Shield className="mr-2 size-4" /> Admin panel
              </Link>
            </Button>
          ) : (
            isDeveloper && (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                  <CodeXml className="mr-2 size-4" /> Developer panel
                </Link>
              </Button>
            )
          )}
        </div>
      </div>

      <section className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-5">
            {/* Avatar + identity card */}
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
              <Avatar className="size-24 ring-2 ring-border">
                <AvatarImage src={avatar} alt="" />
                <AvatarFallback className="text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-sm font-semibold">
                  {user?.fullName || "Member"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email ?? "guest@ccs.dev"}
                </p>
                {isAdmin ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <Shield className="size-3" /> Admin
                  </span>
                ) : isDeveloper ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <CodeXml className="size-3" /> Developer
                  </span>
                ) : null}
              </div>
              {/* <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => setAvatarDialog(true)}
              >
                Change photo
              </Button> */}
            </div>

            <Separator />

            {/* ─── Certificates ─── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Certificates</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {certs.length}
                  </span>
                </div>
              </div>

              {certs.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">
                  No certificates yet. Attend workshops and events to earn them.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {visibleCerts.map((cert) => (
                      <CertCard
                        key={cert.id}
                        cert={cert}
                        template={findTemplate(cert)}
                        onView={setActiveCert}
                        onDownload={handleDownloadCert}
                        downloading={downloadingCert}
                      />
                    ))}
                  </div>
                  {certs.length > 4 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={() => setShowAllCerts((v) => !v)}
                    >
                      {showAllCerts ? (
                        <>
                          <ChevronUp className="size-3 mr-1" /> Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-3 mr-1" />{" "}
                          {certs.length - 4} more
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* <Separator /> */}

            {/* ─── CCS Card ─── */}
            {/* <CardSection user={user} /> */}

            {/* <Separator /> */}

            {/* ─── Scan event QR ─── */}
            {/* <div className="space-y-2">
              <div className="flex items-center gap-2">
                <QrCode className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Event Attendance</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Scan the QR code displayed at an event to mark your attendance.
              </p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full gap-1.5"
              >
                <Link href="/attendance/scan">
                  <QrCode className="size-3.5" /> Scan event QR
                </Link>
              </Button>
            </div> */}
          </div>

          {/* ─── RIGHT COLUMN — Profile form ─── */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="rounded-xl border border-border bg-card p-6 space-y-5 self-start"
          >
            <h2 className="text-base font-semibold">Edit profile</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Display name"
                error={form.formState.errors.fullName?.message}
              >
                <Input
                  placeholder={user?.fullName || "Your Name"}
                  {...form.register("fullName")}
                />
              </Field>
              <Field
                label="Department"
                error={form.formState.errors.department?.message}
              >
                <Select
                  value={form.watch("department")}
                  onValueChange={(v) => form.setValue("department", v)}
                >
                  <SelectTrigger aria-label="Department">
                    <SelectValue placeholder="Select" />
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
              <Field label="Year" error={form.formState.errors.year?.message}>
                <Select
                  value={form.watch("year")}
                  onValueChange={(v) => form.setValue("year", v)}
                >
                  <SelectTrigger aria-label="Year">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label="LinkedIn"
                error={form.formState.errors.linkedin?.message}
              >
                <Input
                  placeholder="https://linkedin.com/in/…"
                  {...form.register("linkedin")}
                />
              </Field>
              <Field
                label="GitHub"
                error={form.formState.errors.github?.message}
              >
                <Input
                  placeholder="https://github.com/…"
                  {...form.register("github")}
                />
              </Field>
            </div>
            <Field label="Bio" error={form.formState.errors.bio?.message}>
              <Textarea
                rows={3}
                placeholder="A short intro…"
                {...form.register("bio")}
              />
              <p className="text-right text-[11px] text-muted-foreground">
                {form.watch("bio")?.length ?? 0} / 300
              </p>
            </Field>
            <div className="flex justify-end border-t border-border pt-4">
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Certificate viewer dialog */}
      {activeCert && (
        <CertViewer
          cert={activeCert}
          template={findTemplate(activeCert)}
          onClose={() => setActiveCert(null)}
          onDownload={handleDownloadCert}
          downloading={downloadingCert}
        />
      )}

      {/* Avatar upload dialog */}
      <ImageUploadDialog
        open={avatarDialog}
        onOpenChange={setAvatarDialog}
        shape="round"
        aspect={1}
        maxEdge={400}
        title="Change profile photo"
        onConfirm={(url) => setAvatar(url)}
      />
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
