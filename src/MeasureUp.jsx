/**
 * MeasureUp — measurement with progressive difficulty.
 *
 * Level 1-2: Which of 2 bars is longer?
 * Level 3-4: How long is this bar?
 * Level 5-6: Which of 3-4 bars is longest/shortest?
 * Level 7-8: How much longer is A than B?
 * Level 9+:  Mixed challenges with vertical + horizontal bars
 */
import { useState } from "react";

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const BAR_COLORS = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899"];
const LABELS = ["A", "B", "C", "D", "E"];
const UNIT = 28;

function pickColors(n) {
  const shuffled = [...BAR_COLORS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateRound(level) {
  const maxUnits = level <= 4 ? 8 : 10;

  // Level 1-2: Which of 2 is longer?
  if (level <= 2) {
    const colors = pickColors(2);
    const lenA = rand(2, maxUnits);
    let lenB; do { lenB = rand(2, maxUnits); } while (lenB === lenA);
    return {
      type: "compare2",
      question: "Which bar is longer?",
      bars: [
        { length: lenA, color: colors[0], label: "A" },
        { length: lenB, color: colors[1], label: "B" },
      ],
      answer: lenA > lenB ? "A" : "B",
      maxUnits,
    };
  }

  // Level 3-4: How long is this bar?
  if (level <= 4) {
    const len = rand(2, maxUnits);
    const color = BAR_COLORS[rand(0, BAR_COLORS.length - 1)];
    return {
      type: "measure",
      question: "How long is this bar?",
      bars: [{ length: len, color, label: "" }],
      answer: len,
      answerType: "number",
      maxUnits,
    };
  }

  // Level 5-6: Which of 3-4 bars is longest / shortest?
  if (level <= 6) {
    const count = level <= 5 ? 3 : 4;
    const colors = pickColors(count);
    const lengths = [];
    while (lengths.length < count) {
      const l = rand(2, maxUnits);
      if (!lengths.includes(l)) lengths.push(l);
    }
    const askLongest = Math.random() > 0.4;
    const target = askLongest ? Math.max(...lengths) : Math.min(...lengths);
    const answerLabel = LABELS[lengths.indexOf(target)];
    return {
      type: "compareN",
      question: askLongest ? "Which bar is the longest?" : "Which bar is the shortest?",
      bars: lengths.map((l, i) => ({ length: l, color: colors[i], label: LABELS[i] })),
      answer: answerLabel,
      maxUnits,
    };
  }

  // Level 7-8: How much longer is the longest than the shortest?
  if (level <= 8) {
    const colors = pickColors(2);
    const lenA = rand(4, maxUnits);
    let lenB; do { lenB = rand(2, lenA - 1); } while (lenB === lenA);
    const diff = lenA - lenB;
    return {
      type: "difference",
      question: "How much longer is A than B?",
      bars: [
        { length: lenA, color: colors[0], label: "A" },
        { length: lenB, color: colors[1], label: "B" },
      ],
      answer: diff,
      answerType: "number",
      maxUnits,
    };
  }

  // Level 9+: Mixed — 3 bars, what's the total / difference between longest and shortest
  const count = 3;
  const colors = pickColors(count);
  const lengths = [];
  while (lengths.length < count) {
    const l = rand(2, maxUnits);
    if (!lengths.includes(l)) lengths.push(l);
  }

  if (Math.random() > 0.5) {
    // Difference between longest and shortest
    const diff = Math.max(...lengths) - Math.min(...lengths);
    return {
      type: "diffN",
      question: "How much longer is the longest bar than the shortest?",
      bars: lengths.map((l, i) => ({ length: l, color: colors[i], label: LABELS[i] })),
      answer: diff,
      answerType: "number",
      maxUnits,
    };
  } else {
    // How long is a specific bar
    const targetIdx = rand(0, count - 1);
    return {
      type: "measureN",
      question: `How long is bar ${LABELS[targetIdx]}?`,
      bars: lengths.map((l, i) => ({ length: l, color: colors[i], label: LABELS[i] })),
      answer: lengths[targetIdx],
      answerType: "number",
      highlight: LABELS[targetIdx],
      maxUnits,
    };
  }
}

function Ruler({ maxUnits }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {Array.from({ length: maxUnits + 1 }, (_, i) => (
        <div key={i} style={{
          width: i === maxUnits ? 1 : UNIT,
          display: "flex", flexDirection: "column", alignItems: "flex-start",
        }}>
          <div style={{ width: 1, height: i % 5 === 0 ? 14 : 8, background: "#6B7280" }} />
          <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", marginLeft: -3, marginTop: 1 }}>{i}</span>
        </div>
      ))}
    </div>
  );
}

function Bar({ length, color, label, highlight }) {
  const isHighlight = highlight === label;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
      {label && (
        <span style={{
          fontSize: 13, fontWeight: 800, width: 16,
          color: isHighlight ? color : "#6B7280",
        }}>{label}</span>
      )}
      <div style={{
        width: length * UNIT, height: 22, borderRadius: 5,
        background: color, transition: "width 0.3s ease",
        boxShadow: `0 2px 6px ${color}44`,
        border: isHighlight ? "2px solid #111" : "none",
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

  const handleSelect = (label) => {
    if (feedback) return;
    setSelected(label);
    const correct = label === round.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (onComplete) {
      setTimeout(() => onComplete({ correct, answer: label }), correct ? 1200 : 800);
    } else {
      setTimeout(() => {
        if (correct) advance();
        else { setSelected(null); setFeedback(null); }
      }, correct ? 1200 : 800);
    }
  };

  const handleSubmit = (e) => {
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

  const isSelectMode = ["compare2", "compareN"].includes(round.type);
  const isNumberMode = round.answerType === "number";

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#DCFCE7", color: "#166534" }}>
          Measurement
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 16 }}>
        {round.question}
      </div>

      {/* Bars + ruler */}
      <div style={{
        display: "inline-block", textAlign: "left",
        padding: "14px 16px", background: "#fff",
        borderRadius: 12, border: "2px solid #E5E7EB",
        marginBottom: 16, overflowX: "auto",
      }}>
        {round.bars.map((bar, i) => (
          <div
            key={i}
            onClick={() => isSelectMode ? handleSelect(bar.label) : null}
            style={{
              padding: "4px 0", cursor: isSelectMode ? "pointer" : "default",
              borderRadius: 6,
              background: selected === bar.label
                ? (feedback === "correct" ? "#DCFCE7" : feedback === "wrong" ? "#FEE2E2" : "transparent")
                : "transparent",
            }}
          >
            <Bar {...bar} highlight={round.highlight} />
          </div>
        ))}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 4, marginLeft: round.bars[0]?.label ? 22 : 0 }}>
          <Ruler maxUnits={round.maxUnits} />
        </div>
      </div>

      {/* Number input for measure/difference modes */}
      {isNumberMode && (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="?"
            style={{
              width: 60, padding: "10px", fontSize: 22, fontWeight: 800, textAlign: "center",
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
        <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: "#22C55E" }}>
          {"\u2705"} {isNumberMode ? `${round.answer} units — correct!` : `Bar ${round.answer} is correct!`}
        </div>
      )}
      {feedback === "wrong" && !isSelectMode && (
        <div style={{ marginTop: 8, fontSize: 14, color: "#EF4444", fontWeight: 600 }}>
          Not quite — look at the ruler carefully
        </div>
      )}
    </div>
  );
}
