import { useState } from "react";
import DevSkillMap from "./DevSkillMap";
import PasaMaths from "./components/PasaMaths";
import TensFrame from "./TensFrame";
import NumberLine from "./NumberLine";
import BalanceScale from "./BalanceScale";
import FractionFactory from "./FractionFactory";
import CoinMaker from "./CoinMaker";
import FairShare from "./FairShare";
import SkipCount from "./SkipCount";
import ShapeExplorer from "./ShapeExplorer";
import ClockTime from "./ClockTime";
import KwachaMoney from "./KwachaMoney";
import AreaPerimeter from "./AreaPerimeter";
import MeasureUp from "./MeasureUp";
import PatternSequence from "./PatternSequence";
import MirrorReflection from "./MirrorReflection";
import OddOneOut from "./OddOneOut";

const DEMOS = [
  { id: "course", label: "Full Course", emoji: "\u{1F393}", cat: "dev" },
  { id: "skillmap", label: "Skill Map", emoji: "\u{1F5FA}\uFE0F", cat: "dev" },
  { id: "tens", label: "Tens Frame", emoji: "\u{1F7E2}", cat: "number" },
  { id: "numline", label: "Number Line", emoji: "\u{1F4CF}", cat: "number" },
  { id: "coins", label: "Place Value", emoji: "\u{1FA99}", cat: "number" },
  { id: "kwacha", label: "Kwacha", emoji: "\u{1F4B0}", cat: "number" },
  { id: "balance", label: "Balance", emoji: "\u2696\uFE0F", cat: "operations" },
  { id: "skip", label: "Skip Count", emoji: "\u{1F438}", cat: "operations" },
  { id: "share", label: "Fair Share", emoji: "\u{1F36A}", cat: "operations" },
  { id: "fraction", label: "Fractions", emoji: "\u{1F52A}", cat: "operations" },
  { id: "shapes", label: "Shapes", emoji: "\u{1F534}", cat: "geometry" },
  { id: "area", label: "Area & Perimeter", emoji: "\u{1F4D0}", cat: "geometry" },
  { id: "measure", label: "Measurement", emoji: "\u{1F4CF}", cat: "geometry" },
  { id: "clock", label: "Clock", emoji: "\u{1F570}", cat: "geometry" },
  { id: "pattern", label: "Sequences", emoji: "\u{1F52E}", cat: "sp2" },
  { id: "mirror", label: "Mirror Image", emoji: "\u{1FA9E}", cat: "sp2" },
  { id: "oddone", label: "Odd One Out", emoji: "\u{1F50D}", cat: "sp2" },
];

const CATS = [
  { id: "dev", label: "Dev Tools", color: "#6B7280" },
  { id: "number", label: "Number Sense", color: "#22C55E" },
  { id: "operations", label: "Operations", color: "#3B82F6" },
  { id: "geometry", label: "Shape, Space & Measure", color: "#F59E0B" },
  { id: "sp2", label: "Pattern & Logic", color: "#8B5CF6" },
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
        <span style={{ fontSize: 13, color: "#999" }}>15 activity demos</span>
      </div>

      {CATS.map(cat => (
        <div key={cat.id} style={{ padding: "8px 20px 4px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
            {cat.label}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {DEMOS.filter(d => d.cat === cat.id).map(d => (
              <button key={d.id} onClick={() => setDemo(d.id)} style={{
                padding: "5px 10px", fontSize: 11, fontWeight: 700,
                borderRadius: 7, cursor: "pointer",
                border: demo === d.id ? `2px solid ${cat.color}` : "1px solid #E5E7EB",
                background: demo === d.id ? `${cat.color}18` : "#fff",
                color: demo === d.id ? cat.color : "#374151",
              }}>
                {d.emoji} {d.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding: "8px 20px 40px", maxWidth: 480, margin: "0 auto" }}>
        {demo === "course" && <PasaMaths onExit={() => setDemo("skillmap")} />}
        {demo === "skillmap" && <DevSkillMap />}
        {demo === "tens" && <TensFrame />}
        {demo === "numline" && <NumberLine />}
        {demo === "coins" && <CoinMaker />}
        {demo === "kwacha" && <KwachaMoney />}
        {demo === "balance" && <BalanceScale />}
        {demo === "skip" && <SkipCount />}
        {demo === "share" && <FairShare />}
        {demo === "fraction" && <FractionFactory />}
        {demo === "shapes" && <ShapeExplorer />}
        {demo === "area" && <AreaPerimeter />}
        {demo === "measure" && <MeasureUp />}
        {demo === "clock" && <ClockTime />}
        {demo === "pattern" && <PatternSequence />}
        {demo === "mirror" && <MirrorReflection />}
        {demo === "oddone" && <OddOneOut />}
      </div>
    </div>
  );
}
