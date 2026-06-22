"use client";

import { useState } from "react";
import { Cpu } from "lucide-react";

/** Simple QR-code-like decorative pattern */
function QRPattern({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" shapeRendering="crispEdges">
      {/* Top-left finder */}
      <rect x="0" y="0" width="3" height="3" fill="white" />
      <rect x="1" y="1" width="1" height="1" fill="rgba(0,0,0,0.8)" />
      {/* Top-right finder */}
      <rect x="7" y="0" width="3" height="3" fill="white" />
      <rect x="8" y="1" width="1" height="1" fill="rgba(0,0,0,0.8)" />
      {/* Bottom-left finder */}
      <rect x="0" y="7" width="3" height="3" fill="white" />
      <rect x="1" y="8" width="1" height="1" fill="rgba(0,0,0,0.8)" />
      {/* Data pattern cells */}
      {[
        [4,0],[5,0],[3,1],[5,1],[6,1],[4,2],[6,2],[8,2],[9,2],
        [0,4],[2,4],[3,4],[5,4],[7,4],[9,4],[1,5],[4,5],[6,5],[8,5],
        [0,6],[2,6],[5,6],[7,6],[9,6],[3,7],[4,7],[6,8],[9,8],
        [0,9],[1,9],[4,9],[6,9],[7,9],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill="white" />
      ))}
    </svg>
  );
}

/** EMV chip */
function ChipIcon() {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
      <rect x="0" y="0" width="40" height="32" rx="4" fill="#d4a853" />
      <rect x="4" y="0" width="1" height="32" fill="#b8902e" />
      <rect x="35" y="0" width="1" height="32" fill="#b8902e" />
      <rect x="0" y="4" width="40" height="1" fill="#b8902e" />
      <rect x="0" y="27" width="40" height="1" fill="#b8902e" />
      <rect x="12" y="8" width="16" height="16" rx="2" fill="#c49a2a" />
      <line x1="12" y1="16" x2="28" y2="16" stroke="#b8902e" strokeWidth="1" />
      <line x1="20" y1="8" x2="20" y2="24" stroke="#b8902e" strokeWidth="1" />
    </svg>
  );
}

/**
 * Flippable CCS membership card.
 * Props: name, department, cardNumber, validThrough, memberSince
 */
export function CCSCard({ name = "Member", department = "Computing", cardNumber = "•••• •••• •••• ••••", validThrough = "12/27", memberSince = "2024" }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{ perspective: "1000px" }}
      className="w-full max-w-[340px] cursor-pointer select-none"
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      aria-label="CCS membership card — click to flip"
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.65s cubic-bezier(.4,0,.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          position: "relative",
          height: "200px",
        }}
      >
        {/* ───── FRONT ───── */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: "absolute", inset: 0 }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, oklch(0.25 0.12 252) 0%, oklch(0.40 0.18 252) 50%, oklch(0.30 0.14 252) 100%)",
            }}
          />
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 size-40 rounded-full opacity-10"
            style={{ background: "oklch(0.62 0.18 252)" }} />
          <div className="absolute -right-2 top-16 size-24 rounded-full opacity-10"
            style={{ background: "oklch(0.62 0.18 252)" }} />

          {/* Content */}
          <div className="relative h-full p-5 flex flex-col justify-between text-white">
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <span className="text-[10px] font-extrabold tracking-tight text-white">CCS</span>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-white/60">Core Computing Society</p>
                  <p className="text-[8px] text-white/40 uppercase tracking-wider">Member Card</p>
                </div>
              </div>
              <ChipIcon />
            </div>

            {/* Card number */}
            <div>
              <p className="font-mono text-sm tracking-[0.2em] text-white/80">{cardNumber}</p>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[8px] text-white/50 uppercase tracking-widest">Card Holder</p>
                <p className="text-sm font-bold tracking-wide">{name.toUpperCase()}</p>
                <p className="text-[9px] text-white/60 mt-0.5">{department}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-white/50 uppercase tracking-widest">Valid</p>
                <p className="text-xs font-mono text-white/90">{validThrough}</p>
                <p className="text-[8px] text-white/40 mt-0.5">Since {memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ───── BACK ───── */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
          }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Same gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, oklch(0.25 0.12 252) 0%, oklch(0.40 0.18 252) 50%, oklch(0.30 0.14 252) 100%)",
            }}
          />
          <div className="absolute -left-8 -bottom-8 size-40 rounded-full opacity-10"
            style={{ background: "oklch(0.62 0.18 252)" }} />

          {/* Magnetic stripe */}
          <div className="absolute top-7 left-0 right-0 h-9 bg-black/60" />

          {/* Content */}
          <div className="relative h-full px-5 py-4 flex flex-col justify-between text-white">
            <div /> {/* spacer for stripe */}

            {/* Signature + QR row */}
            <div className="flex items-end justify-between mt-10">
              <div className="flex-1 mr-4">
                <div className="h-8 rounded bg-white/90 mb-1 flex items-end px-2 pb-0.5">
                  <span className="font-serif italic text-xs text-gray-500">{name}</span>
                </div>
                <p className="text-[8px] text-white/40 uppercase tracking-wider">Authorized Signature</p>
              </div>
              <div className="bg-white rounded-lg p-1.5">
                <QRPattern size={44} />
              </div>
            </div>

            {/* Bottom info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[7px] text-white/40 uppercase tracking-widest">Valid Through</p>
                <p className="text-xs font-mono text-white/80">{validThrough}</p>
              </div>
              <div className="text-right">
                <p className="text-[7px] text-white/40">hello@ccs.university.edu</p>
                <p className="text-[7px] text-white/40">Core Computing Society</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
