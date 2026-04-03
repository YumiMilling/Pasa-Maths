/**
 * AreaPerimeter — count squares for area, edges for perimeter.
 *
 * Shows a shape on a grid. Child counts area or perimeter.
 */
import { useState } from "react";

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const GRID = 6;

function generateShape() {
  // Generate an L-shape or rectangle
  const type = Math.random();
  const cells = new Set();

  if (type < 0.4) {
    // Rectangle
    const w = rand(2, 4), h = rand(2, 3);
    const x0 = rand(0, GRID - w), y0 = rand(0, GRID - h);
    for (let r = y0; r < y0 + h; r++)
      for (let c = x0; c < x0 + w; c++)
        cells.add(`${r},${c}`);
  } else if (type < 0.7) {
    // L-shape
    const w = rand(2, 3), h = rand(3, 4);
    const x0 = rand(0, GRID - w), y0 = rand(0, GRID - h);
    for (let r = y0; r < y0 + h; r++)
      cells.add(`${r},${x0}`);
    for (let c = x0; c < x0 + w; c++)
      cells.add(`${y0 + h - 1},${c}`);
  } else {
    // T-shape or plus
    const cx = rand(2, GRID - 3), cy = rand(2, GRID - 3);
    // Cross
    for (let d = -1; d <= 1; d++) {
      cells.add(`${cy + d},${cx}`);
      cells.add(`${cy},${cx + d}`);
    }
    // Extend one arm
    cells.add(`${cy - 2},${cx}`);
    cells.add(`${cy + 2},${cx}`);
  }

  return cells;
}

function calcArea(cells) {
  return cells.size;
}

function calcPerimeter(cells) {
  let p = 0;
  for (const key of cells) {
    const [r, c] = key.split(",").map(Number);
    // Check 4 neighbors
    if (!cells.has(`${r - 1},${c}`)) p++;
    if (!cells.has(`${r + 1},${c}`)) p++;
    if (!cells.has(`${r},${c - 1}`)) p++;
    if (!cells.has(`${r},${c + 1}`)) p++;
  }
  return p;
}

function generateRound(level) {
  const cells = generateShape();
  const area = calcArea(cells);
  const perimeter = calcPerimeter(cells);
  const askArea = level <= 3 || Math.random() > 0.5;
  return {
    cells,
    question: askArea ? "area" : "perimeter",
    answer: askArea ? area : perimeter,
    area, perimeter,
  };
}

export default function AreaPerimeter({ params, onComplete }) {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => generateRound(1));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback || !input) return;
    const correct = parseInt(input) === round.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (onComplete) {
      setTimeout(() => onComplete({ correct, answer: parseInt(input) }), correct ? 1200 : 800);
    } else {
      setTimeout(() => {
        if (correct) {
          const next = level + 1;
          setLevel(next);
          setRound(generateRound(next));
          setInput("");
        }
        setFeedback(null);
      }, correct ? 1200 : 800);
    }
  };

  const CELL = 40;

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#DBEAFE", color: "#1D4ED8" }}>
          {round.question === "area" ? "Area" : "Perimeter"}
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
        {round.question === "area"
          ? "Count the squares (area)"
          : "Count the edges around the outside (perimeter)"}
      </div>
      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>
        {round.question === "area" ? "How many squares are filled?" : "How many edges touch the outside?"}
      </div>

      {/* Grid */}
      <div style={{
        display: "inline-grid",
        gridTemplateColumns: `repeat(${GRID}, ${CELL}px)`,
        gridTemplateRows: `repeat(${GRID}, ${CELL}px)`,
        gap: 1, padding: 4, borderRadius: 8,
        background: "#E5E7EB", marginBottom: 20,
      }}>
        {Array.from({ length: GRID * GRID }, (_, idx) => {
          const r = Math.floor(idx / GRID);
          const c = idx % GRID;
          const filled = round.cells.has(`${r},${c}`);

          // Highlight perimeter edges
          let borderStyle = {};
          if (filled && round.question === "perimeter") {
            if (!round.cells.has(`${r - 1},${c}`)) borderStyle.borderTop = "3px solid #EF4444";
            if (!round.cells.has(`${r + 1},${c}`)) borderStyle.borderBottom = "3px solid #EF4444";
            if (!round.cells.has(`${r},${c - 1}`)) borderStyle.borderLeft = "3px solid #EF4444";
            if (!round.cells.has(`${r},${c + 1}`)) borderStyle.borderRight = "3px solid #EF4444";
          }

          return (
            <div key={idx} style={{
              width: CELL, height: CELL,
              background: filled ? "#93C5FD" : "#fff",
              border: filled ? "1px solid #60A5FA" : "1px solid #F3F4F6",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, color: "#6B7280",
              ...borderStyle,
            }}>
              {filled && round.question === "area" ? "\u25A0" : ""}
            </div>
          );
        })}
      </div>

      {/* Answer */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <input
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="?"
          style={{
            width: 70, padding: "10px", fontSize: 22, fontWeight: 800,
            textAlign: "center",
            border: `2px solid ${feedback === "wrong" ? "#EF4444" : "#E5E7EB"}`,
            borderRadius: 10, outline: "none",
          }}
        />
        <span style={{ fontSize: 14, color: "#9CA3AF", alignSelf: "center" }}>
          {round.question === "area" ? "squares" : "edges"}
        </span>
        <button type="submit" disabled={!input} style={{
          padding: "10px 20px", fontSize: 16, fontWeight: 700,
          border: "none", borderRadius: 10,
          background: input ? "#22C55E" : "#E5E7EB",
          color: input ? "#fff" : "#9CA3AF", cursor: input ? "pointer" : "default",
        }}>Check</button>
      </form>

      {feedback === "correct" && (
        <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: "#22C55E" }}>
          {"\u2705"} {round.question === "area" ? `Area = ${round.area} squares` : `Perimeter = ${round.perimeter} edges`}
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ marginTop: 8, fontSize: 14, color: "#EF4444", fontWeight: 600 }}>
          Not quite — count again carefully
        </div>
      )}
    </div>
  );
}
