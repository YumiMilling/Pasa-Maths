/**
 * MeasureUp — compare and measure real bar lengths.
 *
 * Bars are drawn at actual proportional lengths.
 * A ruler with unit marks sits underneath.
 * Child counts units to measure, or picks the longer one.
 */
import { useState } from "react";

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const BAR_COLORS = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899"];
const UNIT = 32; // pixels per unit

function generateRound(level) {
  const maxUnits = level <= 3 ? 6 : 10;

  if (level <= 4) {
    // Compare: which bar is longer?
    const lenA = rand(2, maxUnits);
    let lenB;
    do { lenB = rand(2, maxUnits); } while (lenB === lenA);
    const colA = BAR_COLORS[rand(0, BAR_COLORS.length - 1)];
    let colB;
    do { colB = BAR_COLORS[rand(0, BAR_COLORS.length - 1)]; } while (colB === colA);
    return {
      type: "compare",
      bars: [
        { length: lenA, color: colA, label: "A" },
        { length: lenB, color: colB, label: "B" },
      ],
      answer: lenA > lenB ? "A" : "B",
      maxUnits,
    };
  }

  // Measure: how long is this bar?
  const len = rand(2, maxUnits);
  const col = BAR_COLORS[rand(0, BAR_COLORS.length - 1)];
  return {
    type: "measure",
    bars: [{ length: len, color: col, label: "" }],
    answer: len,
    maxUnits,
  };
}

function Ruler({ maxUnits }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginLeft: 0 }}>
      {Array.from({ length: maxUnits + 1 }, (_, i) => (
        <div key={i} style={{
          width: i === maxUnits ? 1 : UNIT, display: "flex", flexDirection: "column", alignItems: "flex-start",
        }}>
          <div style={{
            width: 1, height: i % 5 === 0 ? 16 : 10,
            background: "#6B7280",
          }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", marginLeft: -4, marginTop: 2 }}>
            {i}
          </span>
        </div>
      ))}
    </div>
  );
}

function Bar({ length, color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      {label && (
        <span style={{ fontSize: 14, fontWeight: 800, color: "#6B7280", width: 18 }}>{label}</span>
      )}
      <div style={{
        width: length * UNIT, height: 24, borderRadius: 6,
        background: color, transition: "width 0.3s ease",
        boxShadow: `0 2px 8px ${color}44`,
      }} />
    </div>
  );
}

export default function MeasureUp({ params, onComplete }) {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => generateRound(1));
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);

  const advance = () => {
    const next = level + 1;
    setLevel(next);
    setRound(generateRound(next));
    setSelected(null);
    setInput("");
    setFeedback(null);
  };

  const handleCompare = (choice) => {
    if (feedback) return;
    setSelected(choice);
    const correct = choice === round.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (onComplete) {
      setTimeout(() => onComplete({ correct, answer: choice }), correct ? 1200 : 800);
    } else {
      setTimeout(() => {
        if (correct) advance();
        else { setSelected(null); setFeedback(null); }
      }, correct ? 1200 : 800);
    }
  };

  const handleMeasure = (e) => {
    e.preventDefault();
    if (feedback || !input) return;
    const correct = parseInt(input) === round.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (onComplete) {
      setTimeout(() => onComplete({ correct, answer: parseInt(input) }), correct ? 1200 : 800);
    } else {
      setTimeout(() => {
        if (correct) advance();
        else setFeedback(null);
      }, correct ? 1200 : 800);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#DCFCE7", color: "#166534" }}>
          Measurement
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 16 }}>
        {round.type === "compare" ? "Which bar is longer?" : "How long is this bar?"}
      </div>

      {/* Bars + ruler */}
      <div style={{
        display: "inline-block", textAlign: "left",
        padding: "16px 20px", background: "#fff",
        borderRadius: 12, border: "2px solid #E5E7EB",
        marginBottom: 20, overflowX: "auto",
      }}>
        {round.bars.map((bar, i) => (
          <div
            key={i}
            onClick={() => round.type === "compare" ? handleCompare(bar.label) : null}
            style={{
              marginBottom: 12, cursor: round.type === "compare" ? "pointer" : "default",
              padding: "6px 0",
              borderRadius: 8,
              background: selected === bar.label
                ? (feedback === "correct" ? "#DCFCE7" : feedback === "wrong" ? "#FEE2E2" : "transparent")
                : "transparent",
              transition: "background 0.15s ease",
            }}
          >
            <Bar {...bar} />
          </div>
        ))}

        {/* Ruler underneath */}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 4, marginLeft: round.type === "compare" ? 26 : 0 }}>
          <Ruler maxUnits={round.maxUnits} />
        </div>
      </div>

      {/* Measure mode: input */}
      {round.type === "measure" && (
        <form onSubmit={handleMeasure} style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="?"
            style={{
              width: 60, padding: "10px", fontSize: 22, fontWeight: 800,
              textAlign: "center",
              border: `2px solid ${feedback === "wrong" ? "#EF4444" : "#E5E7EB"}`,
              borderRadius: 10, outline: "none",
            }}
          />
          <span style={{ fontSize: 14, color: "#9CA3AF", alignSelf: "center" }}>units</span>
          <button type="submit" disabled={!input} style={{
            padding: "10px 20px", fontSize: 16, fontWeight: 700,
            border: "none", borderRadius: 10,
            background: input ? "#22C55E" : "#E5E7EB",
            color: input ? "#fff" : "#9CA3AF", cursor: input ? "pointer" : "default",
          }}>Check</button>
        </form>
      )}

      {feedback === "correct" && (
        <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: "#22C55E" }}>
          {"\u2705"} {round.type === "compare"
            ? `Bar ${round.answer} is longer!`
            : `${round.answer} units — correct!`}
        </div>
      )}
    </div>
  );
}
