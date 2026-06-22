"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Upload, Image as ImageIcon, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { cropToDataUrl, fileToDataUrl } from "@/lib/image-crop";
import { addToLibrary, clearLibrary, getLibrary } from "@/lib/image-library";

export function ImageUploadDialog({
  open,
  onOpenChange,
  shape = "rect",
  aspect = 1,
  maxEdge,
  title = "Upload image",
  onConfirm,
}) {
  const [step, setStep] = useState("pick");
  const [src, setSrc] = useState(null);
  const [library, setLibrary] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPx, setAreaPx] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (open) {
      setLibrary(getLibrary());
      setStep("pick");
      setSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  }, [open]);

  const onCropComplete = useCallback((_a, areaPixels) => {
    setAreaPx(areaPixels);
  }, []);

  const pickFile = async (f) => {
    const data = await fileToDataUrl(f);
    setSrc(data);
    setStep("crop");
  };

  const pickFromLibrary = (img) => {
    setSrc(img.src);
    setStep("crop");
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) pickFile(f);
  };

  const confirm = async () => {
    if (!src || !areaPx) return;
    setBusy(true);
    try {
      const out = await cropToDataUrl(src, areaPx, { maxEdge });
      addToLibrary(out);
      onConfirm(out);
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  const headerSubtitle = useMemo(
    () =>
      step === "pick"
        ? "Choose from your library or upload a new image."
        : "Drag to reposition, scroll or use the slider to zoom.",
    [step]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription className="text-xs">{headerSubtitle}</DialogDescription>
        </DialogHeader>

        {step === "pick" ? (
          <div className="space-y-4 px-5 pb-5 pt-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card/50 p-6 text-center transition-colors hover:border-foreground/30 hover:bg-card"
            >
              <Upload className="size-5 text-muted-foreground" />
              <p className="text-sm font-medium">Drop an image, or click to upload</p>
              <p className="text-[11px] text-muted-foreground">PNG, JPG, WEBP up to ~10 MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) pickFile(f);
                  e.target.value = "";
                }}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Recent
                </p>
                {library.length > 0 && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      clearLibrary();
                      setLibrary([]);
                    }}
                  >
                    <Trash2 className="size-3" /> Clear
                  </button>
                )}
              </div>
              {library.length === 0 ? (
                <div className="flex flex-col items-center gap-1 rounded-md border border-dashed border-border bg-card/30 py-6 text-muted-foreground">
                  <ImageIcon className="size-4" />
                  <p className="text-[11px]">No recent images yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {library.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => pickFromLibrary(img)}
                      className="group relative aspect-square overflow-hidden rounded-full border border-border transition-all hover:border-foreground/40 hover:shadow"
                      aria-label="Use this image"
                    >
                      <img src={img.src} alt="" className="size-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-5 pb-5 pt-2">
            <div className="relative w-full overflow-hidden rounded-lg bg-black h-[360px]">
              {src && (
                <Cropper
                  image={src}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  cropShape={shape === "round" ? "round" : "rect"}
                  showGrid
                  restrictPosition
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Zoom</span>
              <Slider
                value={[zoom]}
                min={1}
                max={4}
                step={0.05}
                onValueChange={(v) => setZoom(v[0])}
                className="flex-1"
              />
              <Button size="sm" variant="ghost" onClick={() => setStep("pick")} className="gap-1">
                <X className="size-3.5" /> Change
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-border bg-card/50 px-5 py-3">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === "crop" && (
            <Button size="sm" onClick={confirm} disabled={busy || !areaPx}>
              {busy ? "Saving…" : "Use image"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
