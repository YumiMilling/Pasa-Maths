/**
 * OddOneOut — tap the shape that doesn't belong.
 *
 * 5 shapes shown, 4 share a property, 1 is different.
 */
import { useState } from "react";

const COLORS = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6"];

function generateRound() {
  const ruleType = ["shape", "color", "sides", "fill"][Math.floor(Math.random() * 4)];

  if (ruleType === "color") {
    const mainColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    let oddColor;
    do { oddColor = COLORS[Math.floor(Math.random() * COLORS.length)]; } while (oddColor === mainColor);
    const oddIdx = Math.floor(Math.random() * 5);
    const items = Array.from({ length: 5 }, (_, i) => ({
      color: i === oddIdx ? oddColor : mainColor,
      shape: "circle", size: 36, filled: true,
    }));
    return { items, oddIdx };
  }

  if (ruleType === "shape") {
    const shapes = ["circle", "square", "triangle", "diamond"];
    const mainShape = shapes[Math.floor(Math.random() * shapes.length)];
    let oddShape;
    do { oddShape = shapes[Math.floor(Math.random() * shapes.length)]; } while (oddShape === mainShape);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const oddIdx = Math.floor(Math.random() * 5);
    const items = Array.from({ length: 5 }, (_, i) => ({
      shape: i === oddIdx ? oddShape : mainShape,
      color, size: 36, filled: true,
    }));
    return { items, oddIdx };
  }

  if (ruleType === "sides") {
    // 4 triangles + 1 square, or 4 squares + 1 circle
    const mainSides = Math.random() > 0.5 ? 3 : 4;
    const oddSides = mainSides === 3 ? 4 : 3;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const oddIdx = Math.floor(Math.random() * 5);
    const items = Array.from({ length: 5 }, (_, i) => ({
      shape: (i === oddIdx ? oddSides : mainSides) === 3 ? "triangle" : "square",
      color, size: 36, filled: true,
    }));
    return { items, oddIdx };
  }

  // fill: 4 filled + 1 outline
  const shape = ["circle", "square"][Math.floor(Math.random() * 2)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const oddIdx = Math.floor(Math.random() * 5);
  const items = Array.from({ length: 5 }, (_, i) => ({
    shape, color, size: 36, filled: i !== oddIdx,
  }));
  return { items, oddIdx };
}

function ShapeIcon({ shape, color, size, filled }) {
  const s = size || 36;
  if (shape === "circle") return (
    <div style={{
      width: s, height: s, borderRadius: "50%",
      background: filled ? color : "transparent",
      border: filled ? "none" : `3px solid ${color}`,
    }} />
  );
  if (shape === "square") return (
    <div style={{
      width: s, height: s, borderRadius: 4,
      background: filled ? color : "transparent",
      border: filled ? "none" : `3px solid ${color}`,
    }} />
  );
  if (shape === "triangle") return (
    <div style={{
      width: 0, height: 0,
      borderLeft: `${s/2}px solid transparent`, borderRight: `${s/2}px solid transparent`,
      borderBottom: `${s}px solid ${color}`,
      opacity: filled ? 1 : 0.5,
    }} />
  );
  if (shape === "diamond") return (
    <div style={{
      width: s * 0.7, height: s * 0.7, borderRadius: 3,
      background: filled ? color : "transparent",
      border: filled ? "none" : `3px solid ${color}`,
      transform: "rotate(45deg)",
    }} />
  );
  return null;
}

export default function OddOneOut({ params, onComplete }) {
  const [round, setRound] = useState(() => generateRound());
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handlePick = (i) => {
    if (feedback) return;
    setSelected(i);
    const correct = i === round.oddIdx;
    setFeedback(correct ? "correct" : "wrong");
    if (onComplete) {
      setTimeout(() => onComplete({ correct, answer: i }), correct ? 1200 : 800);
    } else {
      setTimeout(() => {
        if (correct) setRound(generateRound());
        setSelected(null);
        setFeedback(null);
      }, correct ? 1200 : 800);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
        Which one is different?
      </div>
      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>
        Tap the odd one out
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {round.items.map((item, i) => {
          const isSelected = selected === i;
          const isCorrect = feedback === "correct" && isSelected;
          const isWrong = feedback === "wrong" && isSelected;
          return (
            <button key={i} onClick={() => handlePick(i)} style={{
              width: 64, height: 64, borderRadius: 16,
              border: `3px solid ${isCorrect ? "#22C55E" : isWrong ? "#EF4444" : "#E5E7EB"}`,
              background: isCorrect ? "#DCFCE7" : isWrong ? "#FEE2E2" : "#fff",
              cursor: feedback ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s ease",
            }}>
              <ShapeIcon {...item} />
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
