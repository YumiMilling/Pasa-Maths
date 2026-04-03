/**
 * MirrorReflection — build the mirror image by tapping cells.
 *
 * Left grid has a colored pattern. Right grid is empty.
 * Child taps cells on the right to paint the correct reflection.
 * Real-time feedback: correct cells turn green border, wrong ones shake.
 */
import { useState, useEffect } from "react";

const GRID = 4;
const COLORS = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B"];

function generatePattern() {
  const cells = {};
  const count = 3 + Math.floor(Math.random() * 4); // 3-6 filled cells
  let placed = 0;
  while (placed < count) {
    const r = Math.floor(Math.random() * GRID);
    const c = Math.floor(Math.random() * GRID);
    const key = `${r},${c}`;
    if (!cells[key]) {
      cells[key] = COLORS[Math.floor(Math.random() * COLORS.length)];
      placed++;
    }
  }
  return cells;
}

function getMirror(cells) {
  const mirrored = {};
  for (const [key, color] of Object.entries(cells)) {
    const [r, c] = key.split(",").map(Number);
    mirrored[`${r},${GRID - 1 - c}`] = color;
  }
  return mirrored;
}

function generateRound() {
  const original = generatePattern();
  const answer = getMirror(original);
  // Build palette: colors used in the pattern
  const usedColors = [...new Set(Object.values(original))];
  return { original, answer, palette: usedColors };
}

export default function MirrorReflection({ params, onComplete }) {
  const [round, setRound] = useState(() => generateRound());
  const [placed, setPlaced] = useState({});
  const [activeColor, setActiveColor] = useState(null);
  const [celebrated, setCelebrated] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Auto-select first color
  useEffect(() => {
    if (!activeColor && round.palette.length > 0) {
      setActiveColor(round.palette[0]);
    }
  }, [round.palette]);

  // Check if complete
  useEffect(() => {
    if (celebrated) return;
    const answerKeys = Object.keys(round.answer);
    if (answerKeys.length === 0) return;

    const allCorrect = answerKeys.every(key => placed[key] === round.answer[key]);
    const noExtra = Object.keys(placed).every(key => round.answer[key] === placed[key]);

    if (allCorrect && noExtra && Object.keys(placed).length === answerKeys.length) {
      setCelebrated(true);
      if (onComplete) {
        setTimeout(() => onComplete({ correct: true }), 1200);
      } else {
        setTimeout(() => {
          setRound(generateRound());
          setPlaced({});
          setCelebrated(false);
          setShowHint(false);
        }, 1800);
      }
    }
  }, [placed, round.answer, celebrated]);

  const handleCellTap = (r, c) => {
    if (celebrated) return;
    const key = `${r},${c}`;

    if (placed[key]) {
      // Remove if tapped again
      setPlaced(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else if (activeColor) {
      // Place color
      setPlaced(prev => ({ ...prev, [key]: activeColor }));
    }
  };

  const handleReset = () => {
    setPlaced({});
    setShowHint(false);
  };

  const totalNeeded = Object.keys(round.answer).length;
  const correctCount = Object.keys(placed).filter(key => placed[key] === round.answer[key]).length;

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
        Build the mirror image
      </div>
      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>
        Tap cells on the right to paint the reflection
      </div>

      {/* Color palette */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        {round.palette.map(color => (
          <button
            key={color}
            onClick={() => setActiveColor(color)}
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: color,
              border: activeColor === color ? "3px solid #111" : "3px solid transparent",
              cursor: "pointer",
              transform: activeColor === color ? "scale(1.15)" : "scale(1)",
              transition: "all 0.15s ease",
              boxShadow: activeColor === color ? `0 4px 12px ${color}66` : "none",
            }}
          />
        ))}
        {/* Eraser */}
        <button
          onClick={() => setActiveColor(null)}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: "#F3F4F6", border: activeColor === null ? "3px solid #111" : "3px solid #E5E7EB",
            cursor: "pointer", fontSize: 18,
            transform: activeColor === null ? "scale(1.15)" : "scale(1)",
            transition: "all 0.15s ease",
          }}
        >
          {"\u{1F9F9}"}
        </button>
      </div>

      {/* Grids side by side */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 8 }}>

        {/* Left grid — the original (read-only) */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6 }}>ORIGINAL</div>
          <div style={{
            display: "grid", gridTemplateColumns: `repeat(${GRID}, 36px)`, gap: 2,
            padding: 6, borderRadius: 10, background: "#F3F4F6", border: "2px solid #E5E7EB",
          }}>
            {Array.from({ length: GRID * GRID }, (_, idx) => {
              const r = Math.floor(idx / GRID);
              const c = idx % GRID;
              const color = round.original[`${r},${c}`];
              return (
                <div key={idx} style={{
                  width: 36, height: 36, borderRadius: 4,
                  background: color || "#fff",
                  border: "1px solid #E5E7EB",
                }} />
              );
            })}
          </div>
        </div>

        {/* Mirror line */}
        <div style={{
          width: 4, alignSelf: "stretch", marginTop: 22,
          background: "repeating-linear-gradient(180deg, #9CA3AF 0px, #9CA3AF 6px, transparent 6px, transparent 12px)",
          borderRadius: 2,
        }} />

        {/* Right grid — child builds the reflection */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6 }}>REFLECTION</div>
          <div style={{
            display: "grid", gridTemplateColumns: `repeat(${GRID}, 36px)`, gap: 2,
            padding: 6, borderRadius: 10,
            background: celebrated ? "#F0FDF4" : "#FFFBEB",
            border: `2px solid ${celebrated ? "#86EFAC" : "#FDE68A"}`,
            transition: "all 0.3s ease",
          }}>
            {Array.from({ length: GRID * GRID }, (_, idx) => {
              const r = Math.floor(idx / GRID);
              const c = idx % GRID;
              const key = `${r},${c}`;
              const placedColor = placed[key];
              const isTarget = !!round.answer[key];
              const isCorrect = placedColor && placedColor === round.answer[key];
              const isWrong = placedColor && placedColor !== round.answer[key];

              // Hint: show which cells need filling
              const showHintDot = showHint && isTarget && !placedColor;

              return (
                <div
                  key={idx}
                  onClick={() => handleCellTap(r, c)}
                  style={{
                    width: 36, height: 36, borderRadius: 4,
                    background: placedColor || "#fff",
                    border: isCorrect ? "2px solid #22C55E" : isWrong ? "2px solid #EF4444" : "1px solid #E5E7EB",
                    cursor: celebrated ? "default" : "pointer",
                    position: "relative",
                    transition: "all 0.15s ease",
                    animation: isWrong ? "shake 0.3s ease" : placedColor ? "popIn 0.15s ease" : "none",
                  }}
                >
                  {showHintDot && (
                    <div style={{
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                      width: 8, height: 8, borderRadius: "50%", background: "#FCD34D",
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress + controls */}
      <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#9CA3AF" }}>
          {correctCount}/{totalNeeded} correct
        </span>
        <button onClick={handleReset} style={{
          padding: "6px 14px", fontSize: 12, fontWeight: 600,
          border: "1px solid #E5E7EB", borderRadius: 8,
          background: "#fff", color: "#6B7280", cursor: "pointer",
        }}>Reset</button>
        {!showHint && !celebrated && (
          <button onClick={() => setShowHint(true)} style={{
            padding: "6px 14px", fontSize: 12, fontWeight: 600,
            border: "1px solid #FDE68A", borderRadius: 8,
            background: "#FFFBEB", color: "#92400E", cursor: "pointer",
          }}>
            {"\u{1F4A1}"} Hint
          </button>
        )}
      </div>

      {celebrated && (
        <div style={{ marginTop: 12, fontSize: 20, fontWeight: 800, color: "#22C55E", animation: "popIn 0.3s ease" }}>
          {"\u2728"} Perfect reflection!
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
