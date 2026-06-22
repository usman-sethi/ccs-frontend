"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import { Camera, ScanLine, AlertCircle, PlayCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/SectionHeader";
import { useSiteContent } from "@/context/SiteContentContext";
import { decodeQrPayload, buildAttendanceRedirectUrl } from "@/lib/qr-payload";

/**
 * QR scanner — intentionally identity-blind.
 *
 * This component's ONLY job is:
 *   1. Read the QR payload (camera or demo trigger)
 *   2. Extract eventId / eventName / qrSecret / username
 *   3. Generate the current token + profile URL
 *   4. Redirect
 *
 * It never checks who is logged in. All validation and attendance
 * writes happen on the destination profile page.
 */
export default function ScanPage() {
  const router = useRouter();
  const { raw } = useSiteContent();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => stopCamera(), []);

  const redirectFromQrData = (qrData) => {
    stopCamera();
    const { eventId, eventName } = qrData;
    const { url: redirectUrl, token } = buildAttendanceRedirectUrl(qrData);

    // Required scan-flow log — fires right before navigation
    console.log({
      type: "QR_SCANNED",
      eventId,
      eventName,
      generatedToken: token,
      redirectUrl,
    });

    router.push(redirectUrl);
  };

  const handleDecoded = (rawText) => {
    const qrData = decodeQrPayload(rawText);
    if (!qrData) {
      setError("Unrecognized QR code. Please scan a valid CCS event QR code.");
      return;
    }
    redirectFromQrData(qrData);
  };

  const tick = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      handleDecoded(code.data);
      return; // stop the loop — handled
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      tick();
    } catch {
      setError("Camera access denied or unavailable. Use demo mode below instead.");
    }
  };

  // Demo mode: simulate a scan without needing a camera or printed QR.
  // Uses the same redirectFromQrData() path as a real scan.
  const demoEvent = (raw.events ?? []).find((e) => e.qrSecret);

  const handleDemoScan = () => {
    if (!demoEvent) return;
    redirectFromQrData({
      eventId: demoEvent.id,
      eventName: demoEvent.title,
      qrSecret: demoEvent.qrSecret,
      username: "isa", // placeholder routing username for the demo
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Attendance"
        title="Scan event QR code"
        description="Point your camera at the QR code displayed at the event to mark your attendance."
      />
      <section className="container-page py-12 max-w-lg">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="relative aspect-square bg-black">
            <video ref={videoRef} className="absolute inset-0 size-full object-cover" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />

            {!scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/60">
                <Camera className="size-10" />
                <p className="text-sm">Camera preview will appear here</p>
              </div>
            )}

            {scanning && (
              <div className="pointer-events-none absolute inset-10 animate-pulse rounded-xl border-2 border-primary/70" />
            )}
          </div>

          <div className="space-y-3 p-4">
            {error && (
              <p className="flex items-start gap-2 text-xs text-destructive">
                <AlertCircle className="size-3.5 shrink-0 mt-0.5" /> {error}
              </p>
            )}

            {!scanning ? (
              <Button className="w-full gap-2" onClick={startCamera}>
                <ScanLine className="size-4" /> Start scanning
              </Button>
            ) : (
              <Button variant="outline" className="w-full gap-2" onClick={stopCamera}>
                <X className="size-4" /> Stop
              </Button>
            )}
          </div>
        </div>

        {demoEvent && (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-card/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Demo mode (no camera needed)
            </p>
            <p className="mb-3 text-xs text-muted-foreground">
              Simulates scanning the QR code for &quot;{demoEvent.title}&quot;.
            </p>
            <Button size="sm" variant="outline" className="w-full gap-2" onClick={handleDemoScan}>
              <PlayCircle className="size-3.5" /> Simulate scan
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
