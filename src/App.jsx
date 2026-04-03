import { useState } from "react";
import TensFrame from "./TensFrame";
import NumberLine from "./NumberLine";
import BalanceScale from "./BalanceScale";
import PatternSequence from "./PatternSequence";
import MirrorReflection from "./MirrorReflection";
import OddOneOut from "./OddOneOut";

const DEMOS = [
  { id: "tens", label: "Tens Frame", emoji: "\u{1F7E2}", cat: "maths" },
  { id: "numline", label: "Number Line", emoji: "\u{1F4CF}", cat: "maths" },
  { id: "balance", label: "Balance Scale", emoji: "\u2696\uFE0F", cat: "maths" },
  { id: "pattern", label: "What Comes Next", emoji: "\u{1F52E}", cat: "sp2" },
  { id: "mirror", label: "Mirror Image", emoji: "\u{1FA9E}", cat: "sp2" },
  { id: "oddone", label: "Odd One Out", emoji: "\u{1F50D}", cat: "sp2" },
];

export default function App() {
  const [demo, setDemo] = useState("tens");

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <div style={{
        padding: "16px 20px", background: "#fff", borderBottom: "1px solid #E5E7EB",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>Pasa Maths</span>
        <span style={{ fontSize: 13, color: "#999" }}>activity demos</span>
      </div>

      {/* Maths demos */}
      <div style={{ padding: "12px 20px 4px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Maths
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {DEMOS.filter(d => d.cat === "maths").map(d => (
            <button
              key={d.id}
              onClick={() => setDemo(d.id)}
              style={{
                padding: "8px 14px", fontSize: 13, fontWeight: 700,
                borderRadius: 10, cursor: "pointer",
                border: demo === d.id ? "2px solid #22C55E" : "2px solid #E5E7EB",
                background: demo === d.id ? "#F0FDF4" : "#fff",
                color: demo === d.id ? "#166534" : "#374151",
              }}
            >
              {d.emoji} {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* SP2 demos */}
      <div style={{ padding: "8px 20px 12px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Pattern & Logic (SP2)
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {DEMOS.filter(d => d.cat === "sp2").map(d => (
            <button
              key={d.id}
              onClick={() => setDemo(d.id)}
              style={{
                padding: "8px 14px", fontSize: 13, fontWeight: 700,
                borderRadius: 10, cursor: "pointer",
                border: demo === d.id ? "2px solid #8B5CF6" : "2px solid #E5E7EB",
                background: demo === d.id ? "#F5F3FF" : "#fff",
                color: demo === d.id ? "#5B21B6" : "#374151",
              }}
            >
              {d.emoji} {d.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        {demo === "tens" && <TensFrame />}
        {demo === "numline" && <NumberLine />}
        {demo === "balance" && <BalanceScale />}
        {demo === "pattern" && <PatternSequence />}
        {demo === "mirror" && <MirrorReflection />}
        {demo === "oddone" && <OddOneOut />}
      </div>
    </div>
  );
}
