/**
 * ShapeExplorer — identify and learn shape properties.
 *
 * Shows a shape, child picks its name from options.
 * Progresses: basic shapes → properties (sides, corners) → 3D shapes.
 */
import { useState, useEffect } from "react";

const SHAPES_2D = [
  { name: "circle", sides: 0, svg: (s, c) => `<circle cx="${s/2}" cy="${s/2}" r="${s/2-4}" fill="${c}" stroke="#374151" stroke-width="2"/>` },
  { name: "triangle", sides: 3, svg: (s, c) => `<polygon points="${s/2},4 ${s-4},${s-4} 4,${s-4}" fill="${c}" stroke="#374151" stroke-width="2"/>` },
  { name: "square", sides: 4, svg: (s, c) => `<rect x="4" y="4" width="${s-8}" height="${s-8}" fill="${c}" stroke="#374151" stroke-width="2"/>` },
  { name: "rectangle", sides: 4, svg: (s, c) => `<rect x="4" y="${s*0.2}" width="${s-8}" height="${s*0.6}" fill="${c}" stroke="#374151" stroke-width="2" rx="1"/>` },
  { name: "pentagon", sides: 5, svg: (s, c) => { const pts = polygon(5, s); return `<polygon points="${pts}" fill="${c}" stroke="#374151" stroke-width="2"/>`; }},
  { name: "hexagon", sides: 6, svg: (s, c) => { const pts = polygon(6, s); return `<polygon points="${pts}" fill="${c}" stroke="#374151" stroke-width="2"/>`; }},
  { name: "star", sides: 10, svg: (s, c) => { const pts = star(5, s); return `<polygon points="${pts}" fill="${c}" stroke="#374151" stroke-width="2"/>`; }},
  { name: "diamond", sides: 4, svg: (s, c) => `<polygon points="${s/2},4 ${s-4},${s/2} ${s/2},${s-4} 4,${s/2}" fill="${c}" stroke="#374151" stroke-width="2"/>` },
];

function polygon(n, s) {
  const cx = s / 2, cy = s / 2, r = s / 2 - 6;
  return Array.from({ length: n }, (_, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

function star(points, s) {
  const cx = s / 2, cy = s / 2, outer = s / 2 - 6, inner = outer * 0.4;
  return Array.from({ length: points * 2 }, (_, i) => {
    const angle = (i * Math.PI / points) - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

const COLORS = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899"];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateRound(level) {
  const pool = level <= 3 ? SHAPES_2D.slice(0, 4) : level <= 6 ? SHAPES_2D.slice(0, 6) : SHAPES_2D;
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  if (level > 4 && Math.random() > 0.5) {
    // Ask about sides
    return {
      type: "sides",
      shape: correct,
      color,
      question: `How many sides does this shape have?`,
      answer: String(correct.sides),
      options: shuffle([correct.sides, correct.sides + 1, Math.max(0, correct.sides - 1), correct.sides + 2].map(String).filter((v, i, a) => a.indexOf(v) === i)).slice(0, 4),
    };
  }

  // Name the shape
  const wrongNames = pool.filter(s => s.name !== correct.name).sort(() => Math.random() - 0.5).slice(0, 3);
  return {
    type: "name",
    shape: correct,
    color,
    question: "What shape is this?",
    answer: correct.name,
    options: shuffle([correct.name, ...wrongNames.map(s => s.name)]),
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ShapeExplorer({ params, onComplete }) {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => generateRound(1));
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handlePick = (opt, i) => {
    if (feedback) return;
    setSelected(i);
    const correct = opt === round.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (onComplete) {
      setTimeout(() => onComplete({ correct, answer: opt }), correct ? 1200 : 800);
    } else {
      setTimeout(() => {
        if (correct) {
          const next = level + 1;
          setLevel(next);
          setRound(generateRound(next));
        }
        setSelected(null);
        setFeedback(null);
      }, correct ? 1200 : 800);
    }
  };

  const svgSize = 100;

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#FCE7F3", color: "#9D174D" }}>
          Shapes
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 16 }}>
        {round.question}
      </div>

      {/* Shape display */}
      <div style={{
        width: 120, height: 120, margin: "0 auto 20px",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#F9FAFB", borderRadius: 16, border: "2px solid #E5E7EB",
      }}>
        <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}
          dangerouslySetInnerHTML={{ __html: round.shape.svg(svgSize, round.color) }} />
      </div>

      {/* Options */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {round.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = feedback === "correct" && isSelected;
          const isWrong = feedback === "wrong" && isSelected;
          return (
            <button key={i} onClick={() => handlePick(opt, i)} style={{
              padding: "12px 20px", fontSize: 15, fontWeight: 700,
              borderRadius: 12, textTransform: "capitalize",
              border: `3px solid ${isCorrect ? "#22C55E" : isWrong ? "#EF4444" : "#E5E7EB"}`,
              background: isCorrect ? "#DCFCE7" : isWrong ? "#FEE2E2" : "#fff",
              color: isCorrect ? "#166534" : isWrong ? "#991B1B" : "#374151",
              cursor: feedback ? "default" : "pointer",
              transition: "all 0.15s ease",
            }}>
              {opt}
            </button>
          );
        })}
      </div>

      {feedback === "correct" && (
        <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: "#22C55E" }}>{"\u2705"} Correct!</div>
      )}
    </div>
  );
}
