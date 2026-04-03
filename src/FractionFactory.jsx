/**
 * FractionFactory — slice a bar and fill an order.
 *
 * "Give me 3/4" → child taps to slice the bar into parts,
 * then taps slices to select them. Visual fraction building.
 */
import { useState, useEffect } from "react";

const COLORS = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6"];

function generateRound(difficulty, prev) {
  const denoms = difficulty <= 2 ? [2, 3, 4] : difficulty <= 4 ? [2, 3, 4, 5, 6] : [3, 4, 5, 6, 8];
  let denom, numer;
  // Avoid repeating the same fraction
  let attempts = 0;
  do {
    denom = denoms[Math.floor(Math.random() * denoms.length)];
    numer = Math.floor(Math.random() * (denom - 1)) + 1;
    attempts++;
  } while (prev && numer === prev.numer && denom === prev.denom && attempts < 10);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { numer, denom, color };
}

export default function FractionFactory() {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => generateRound(1));
  const [slices, setSlices] = useState(0); // how many cuts (0 = whole bar)
  const [selected, setSelected] = useState(new Set());
  const [phase, setPhase] = useState("slice"); // slice | pick
  const [celebrated, setCelebrated] = useState(false);

  const totalParts = slices + 1;
  const selectedCount = selected.size;
  const correct = phase === "pick" && totalParts === round.denom && selectedCount === round.numer;

  useEffect(() => {
    if (correct && !celebrated) {
      setCelebrated(true);
      setTimeout(() => {
        const next = level + 1;
        setLevel(next);
        setRound(currentRound => generateRound(next, currentRound));
        setSlices(0);
        setSelected(new Set());
        setPhase("slice");
        setCelebrated(false);
      }, 1800);
    }
  }, [correct, celebrated, level]);

  const handleSlice = () => {
    if (phase !== "slice" || celebrated) return;
    setSlices(s => s + 1);
  };

  const handleDone = () => {
    if (phase === "slice") {
      setPhase("pick");
    }
  };

  const handlePickSlice = (i) => {
    if (phase !== "pick" || celebrated) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleReset = () => {
    setSlices(0);
    setSelected(new Set());
    setPhase("slice");
  };

  const wrongParts = phase === "pick" && totalParts !== round.denom;

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#DBEAFE", color: "#1D4ED8" }}>
          Fractions
        </span>
      </div>

      {/* Order */}
      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
        {phase === "slice" ? "Slice the bar into equal parts" : "Now tap to select the right amount"}
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, color: round.color, marginBottom: 20 }}>
        <sup style={{ fontSize: 24 }}>{round.numer}</sup>
        <span style={{ fontSize: 28 }}>/</span>
        <sub style={{ fontSize: 24 }}>{round.denom}</sub>
      </div>

      {/* The bar */}
      <div style={{
        display: "flex", gap: 3, justifyContent: "center", marginBottom: 16,
        padding: "0 20px",
      }}>
        {Array.from({ length: totalParts }, (_, i) => {
          const isSelected = selected.has(i);
          return (
            <div
              key={i}
              onClick={() => handlePickSlice(i)}
              style={{
                flex: 1, height: 64, maxWidth: 80,
                borderRadius: 8,
                background: isSelected ? round.color : "#E5E7EB",
                border: correct && isSelected ? "3px solid #22C55E" : "2px solid #D1D5DB",
                cursor: phase === "pick" ? "pointer" : "default",
                transition: "all 0.2s ease",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                opacity: phase === "slice" ? 0.6 : 1,
              }}
            />
          );
        })}
      </div>

      {/* Feedback */}
      {wrongParts && phase === "pick" && (
        <div style={{ fontSize: 13, color: "#EF4444", fontWeight: 600, marginBottom: 8 }}>
          You need {round.denom} equal parts — you have {totalParts}. Try again!
        </div>
      )}

      {phase === "pick" && !wrongParts && selectedCount > 0 && !correct && (
        <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
          You selected {selectedCount}/{totalParts}
          {selectedCount === round.numer && totalParts === round.denom ? "" : ` — need ${round.numer}/${round.denom}`}
        </div>
      )}

      {celebrated && (
        <div style={{ fontSize: 20, fontWeight: 800, color: "#22C55E", marginBottom: 8, animation: "popIn 0.3s ease" }}>
          {"\u2728"} {round.numer}/{round.denom} — perfect!
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {phase === "slice" && (
          <>
            <button onClick={handleSlice} style={{
              padding: "12px 24px", fontSize: 16, fontWeight: 700,
              border: "none", borderRadius: 12,
              background: "#F59E0B", color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {"\u{1F52A}"} Slice ({totalParts} parts)
            </button>
            {slices > 0 && (
              <button onClick={handleDone} style={{
                padding: "12px 24px", fontSize: 16, fontWeight: 700,
                border: "none", borderRadius: 12,
                background: "#22C55E", color: "#fff", cursor: "pointer",
              }}>
                Done slicing
              </button>
            )}
          </>
        )}
        <button onClick={handleReset} style={{
          padding: "10px 20px", fontSize: 14, fontWeight: 600,
          border: "1px solid #E5E7EB", borderRadius: 10,
          background: "#fff", color: "#6B7280", cursor: "pointer",
        }}>
          Reset
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
