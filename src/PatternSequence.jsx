/**
 * PatternSequence — "What comes next?"
 *
 * Clear, solvable patterns with hint button.
 * Patterns: alternating shapes, growing sizes, repeating colors, rotating arrows.
 */
import { useState } from "react";

const COLORS = { blue: "#3B82F6", red: "#EF4444", green: "#22C55E", yellow: "#F59E0B", purple: "#8B5CF6" };

// Each pattern generator returns { sequence (4 items), answerIdx, options (4), hint }
const GENERATORS = [
  // Alternating shapes: A B A B
  () => {
    const cols = Object.values(COLORS);
    const c = cols[Math.floor(Math.random() * cols.length)];
    const seq = [
      { type: "circle", color: c },
      { type: "square", color: c },
      { type: "circle", color: c },
      { type: "square", color: c },
    ];
    const options = [
      { type: "square", color: c },
      { type: "circle", color: c },
      { type: "triangle", color: c },
      { type: "diamond", color: c },
    ];
    return { sequence: seq.slice(0, 3), answer: seq[3], options: shuffle(options), hint: "Look at the shapes — they go back and forth" };
  },

  // Alternating colors: A B A B
  () => {
    const keys = Object.keys(COLORS);
    const [a, b] = shuffle(keys).slice(0, 2);
    const seq = [
      { type: "circle", color: COLORS[a] },
      { type: "circle", color: COLORS[b] },
      { type: "circle", color: COLORS[a] },
      { type: "circle", color: COLORS[b] },
    ];
    const wrong = keys.filter(k => k !== b);
    const options = [
      { type: "circle", color: COLORS[b] },
      ...wrong.slice(0, 3).map(k => ({ type: "circle", color: COLORS[k] })),
    ];
    return { sequence: seq.slice(0, 3), answer: seq[3], options: shuffle(options), hint: "Look at the colors — they take turns" };
  },

  // Growing size: small → medium → large → ?
  () => {
    const c = Object.values(COLORS)[Math.floor(Math.random() * 5)];
    const sizes = [20, 28, 36, 44];
    const seq = sizes.map(s => ({ type: "square", color: c, size: s }));
    const options = [
      { type: "square", color: c, size: 44 },
      { type: "square", color: c, size: 20 },
      { type: "square", color: c, size: 36 },
      { type: "square", color: c, size: 52 },
    ];
    return { sequence: seq.slice(0, 3), answer: seq[3], options: shuffle(options), hint: "Each one is bigger than the last" };
  },

  // Shrinking size
  () => {
    const c = Object.values(COLORS)[Math.floor(Math.random() * 5)];
    const sizes = [44, 36, 28, 20];
    const seq = sizes.map(s => ({ type: "circle", color: c, size: s }));
    const options = [
      { type: "circle", color: c, size: 20 },
      { type: "circle", color: c, size: 36 },
      { type: "circle", color: c, size: 44 },
      { type: "circle", color: c, size: 12 },
    ];
    return { sequence: seq.slice(0, 3), answer: seq[3], options: shuffle(options), hint: "Each one is smaller than the last" };
  },

  // Arrows rotating: → ↓ ← ↑ (90° clockwise)
  () => {
    const rots = [0, 90, 180, 270];
    const c = Object.values(COLORS)[Math.floor(Math.random() * 5)];
    const seq = rots.map(r => ({ type: "arrow", color: c, rotation: r }));
    const options = [
      { type: "arrow", color: c, rotation: 270 },
      { type: "arrow", color: c, rotation: 0 },
      { type: "arrow", color: c, rotation: 90 },
      { type: "arrow", color: c, rotation: 180 },
    ];
    return { sequence: seq.slice(0, 3), answer: seq[3], options: shuffle(options), hint: "The arrow turns a quarter each time" };
  },

  // Shape count: 1, 2, 3, ?
  () => {
    const c = Object.values(COLORS)[Math.floor(Math.random() * 5)];
    const seq = [1, 2, 3, 4].map(n => ({ type: "dots", color: c, count: n }));
    const options = [
      { type: "dots", color: c, count: 4 },
      { type: "dots", color: c, count: 3 },
      { type: "dots", color: c, count: 5 },
      { type: "dots", color: c, count: 2 },
    ];
    return { sequence: seq.slice(0, 3), answer: seq[3], options: shuffle(options), hint: "Count how many dots there are each time" };
  },

  // ABC ABC pattern: triangle, circle, square, triangle, circle, square
  () => {
    const c = Object.values(COLORS)[Math.floor(Math.random() * 5)];
    const shapes = ["triangle", "circle", "square"];
    const seq = [0, 1, 2, 0].map(i => ({ type: shapes[i], color: c }));
    const options = [
      { type: "triangle", color: c },
      { type: "circle", color: c },
      { type: "square", color: c },
      { type: "diamond", color: c },
    ];
    return { sequence: seq.slice(0, 3), answer: seq[3], options: shuffle(options), hint: "The pattern repeats — what was first?" };
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function PatternItem({ item, size: boxSize = 56 }) {
  const s = item.size || 36;

  if (item.type === "circle") return (
    <div style={{ width: s, height: s, borderRadius: "50%", background: item.color }} />
  );
  if (item.type === "square") return (
    <div style={{ width: s, height: s, borderRadius: 4, background: item.color }} />
  );
  if (item.type === "triangle") return (
    <div style={{
      width: 0, height: 0,
      borderLeft: `${s/2}px solid transparent`, borderRight: `${s/2}px solid transparent`,
      borderBottom: `${s}px solid ${item.color}`,
    }} />
  );
  if (item.type === "diamond") return (
    <div style={{ width: s * 0.7, height: s * 0.7, borderRadius: 3, background: item.color, transform: "rotate(45deg)" }} />
  );
  if (item.type === "arrow") return (
    <div style={{ fontSize: 28, fontWeight: 800, color: item.color, transform: `rotate(${item.rotation}deg)`, transition: "transform 0.2s" }}>
      {"\u2192"}
    </div>
  );
  if (item.type === "dots") return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", alignItems: "center", width: 40, height: 40 }}>
      {Array.from({ length: item.count }, (_, i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: item.color }} />
      ))}
    </div>
  );
  return null;
}

function itemKey(item) {
  return `${item.type}_${item.color}_${item.size || 0}_${item.rotation || 0}_${item.count || 0}`;
}

export default function PatternSequence({ params, onComplete }) {
  const [round, setRound] = useState(() => GENERATORS[Math.floor(Math.random() * GENERATORS.length)]());
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const handlePick = (opt, i) => {
    if (feedback) return;
    setSelected(i);
    const correct = itemKey(opt) === itemKey(round.answer);
    setFeedback(correct ? "correct" : "wrong");
    if (onComplete) {
      setTimeout(() => onComplete({ correct, answer: itemKey(opt) }), correct ? 1200 : 800);
    } else {
      setTimeout(() => {
        if (correct) {
          setRound(GENERATORS[Math.floor(Math.random() * GENERATORS.length)]());
          setShowHint(false);
        }
        setSelected(null);
        setFeedback(null);
      }, correct ? 1200 : 800);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 20 }}>
        What comes next?
      </div>

      {/* Sequence */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
        {round.sequence.map((item, i) => (
          <div key={i} style={{
            width: 56, height: 56, borderRadius: 12, background: "#F3F4F6",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <PatternItem item={item} />
          </div>
        ))}
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          border: "3px dashed #D1D5DB", background: "#FAFAFA",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, color: "#D1D5DB", fontWeight: 800,
        }}>?</div>
      </div>

      {/* Options */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
        {round.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = feedback === "correct" && isSelected;
          const isWrong = feedback === "wrong" && isSelected;
          return (
            <button key={i} onClick={() => handlePick(opt, i)} style={{
              width: 64, height: 64, borderRadius: 14,
              border: `3px solid ${isCorrect ? "#22C55E" : isWrong ? "#EF4444" : "#E5E7EB"}`,
              background: isCorrect ? "#DCFCE7" : isWrong ? "#FEE2E2" : "#fff",
              cursor: feedback ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s ease",
            }}>
              <PatternItem item={opt} />
            </button>
          );
        })}
      </div>

      {/* Hint */}
      {!showHint && !feedback && (
        <button onClick={() => setShowHint(true)} style={{
          padding: "8px 16px", fontSize: 13, fontWeight: 600,
          border: "1px solid #FDE68A", borderRadius: 8,
          background: "#FFFBEB", color: "#92400E", cursor: "pointer",
        }}>
          {"\u{1F4A1}"} Hint
        </button>
      )}
      {showHint && !feedback && (
        <div style={{
          padding: "10px 16px", borderRadius: 10,
          background: "#FFFBEB", border: "1px solid #FDE68A",
          fontSize: 14, color: "#92400E", fontWeight: 600,
        }}>
          {"\u{1F4A1}"} {round.hint}
        </div>
      )}

      {feedback === "correct" && (
        <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700, color: "#22C55E" }}>{"\u2705"} Correct!</div>
      )}
    </div>
  );
}
