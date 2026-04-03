/**
 * MirrorReflection — build the mirror image by tapping cells.
 *
 * Progressive difficulty:
 *   Level 1: 2x2 grid, 1 cell, 1 color
 *   Level 2: 2x2 grid, 2 cells, 1 color
 *   Level 3: 3x3 grid, 2 cells, 1 color
 *   Level 4: 3x3 grid, 3 cells, 1 color
 *   Level 5: 3x3 grid, 3 cells, 2 colors
 *   Level 6: 4x4 grid, 3 cells, 2 colors
 *   Level 7: 4x4 grid, 4 cells, 2 colors
 *   Level 8: 4x4 grid, 5 cells, 3 colors
 *   Level 9+: 5x5 grid, 5-6 cells, 3-4 colors
 */
import { useState, useEffect } from "react";

const ALL_COLORS = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B"];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function getLevelConfig(level) {
  if (level <= 2) return { grid: 2, cells: level, colors: 1 };
  if (level <= 4) return { grid: 3, cells: level <= 3 ? 2 : 3, colors: 1 };
  if (level <= 5) return { grid: 3, cells: 3, colors: 2 };
  if (level <= 6) return { grid: 4, cells: 3, colors: 2 };
  if (level <= 7) return { grid: 4, cells: 4, colors: 2 };
  if (level <= 8) return { grid: 4, cells: 5, colors: 3 };
  return { grid: 5, cells: rand(5, 6), colors: rand(3, 4) };
}

function generatePattern(config) {
  const { grid, cells: count, colors: colorCount } = config;
  const palette = ALL_COLORS.slice(0, colorCount);
  const cellMap = {};
  let placed = 0;
  while (placed < count) {
    const r = rand(0, grid - 1);
    const c = rand(0, grid - 1);
    const key = `${r},${c}`;
    if (!cellMap[key]) {
      cellMap[key] = palette[placed % palette.length];
      placed++;
    }
  }
  return cellMap;
}

function getMirror(cells, grid) {
  const mirrored = {};
  for (const [key, color] of Object.entries(cells)) {
    const [r, c] = key.split(",").map(Number);
    mirrored[`${r},${grid - 1 - c}`] = color;
  }
  return mirrored;
}

function generateRound(level) {
  const config = getLevelConfig(level);
  const original = generatePattern(config);
  const answer = getMirror(original, config.grid);
  const palette = [...new Set(Object.values(original))];
  return { original, answer, palette, grid: config.grid };
}

export default function MirrorReflection({ params, onComplete }) {
  const startGrid = params?.grid || null;
  const [level, setLevel] = useState(() => {
    // If params specify grid size, find matching level
    if (startGrid === 2) return 1;
    if (startGrid === 3) return 3;
    if (startGrid === 5) return 9;
    return 1;
  });
  const [round, setRound] = useState(() => generateRound(level));
  const [placed, setPlaced] = useState({});
  const [activeColor, setActiveColor] = useState(null);
  const [celebrated, setCelebrated] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const grid = round.grid;

  // Auto-select first (or only) color
  useEffect(() => {
    if (round.palette.length === 1) {
      setActiveColor(round.palette[0]);
    } else if (!activeColor || !round.palette.includes(activeColor)) {
      setActiveColor(round.palette[0]);
    }
  }, [round.palette]);

  // Check completion
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
          const next = level + 1;
          setLevel(next);
          setRound(generateRound(next));
          setPlaced({});
          setCelebrated(false);
          setShowHint(false);
        }, 1500);
      }
    }
  }, [placed, round.answer, celebrated]);

  const handleCellTap = (r, c) => {
    if (celebrated) return;
    const key = `${r},${c}`;

    if (placed[key]) {
      setPlaced(prev => { const next = { ...prev }; delete next[key]; return next; });
    } else if (activeColor) {
      setPlaced(prev => ({ ...prev, [key]: activeColor }));
    }
  };

  const handleReset = () => { setPlaced({}); setShowHint(false); };

  const totalNeeded = Object.keys(round.answer).length;
  const correctCount = Object.keys(placed).filter(key => placed[key] === round.answer[key]).length;

  // Cell size based on grid
  const cellSize = grid <= 2 ? 48 : grid <= 3 ? 40 : grid <= 4 ? 36 : 30;

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Level {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#EDE9FE", color: "#7C3AED" }}>
          {grid}x{grid} grid
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
        Build the mirror image
      </div>
      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 14 }}>
        {round.palette.length === 1
          ? "Tap cells on the right to fill them in"
          : "Pick a color, then tap cells on the right"}
      </div>

      {/* Color palette — only show if multiple colors */}
      {round.palette.length > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
          {round.palette.map(color => (
            <button key={color} onClick={() => setActiveColor(color)} style={{
              width: 36, height: 36, borderRadius: 8, background: color,
              border: activeColor === color ? "3px solid #111" : "3px solid transparent",
              cursor: "pointer", transform: activeColor === color ? "scale(1.15)" : "scale(1)",
              transition: "all 0.15s ease",
            }} />
          ))}
          <button onClick={() => setActiveColor(null)} style={{
            width: 36, height: 36, borderRadius: 8, background: "#F3F4F6",
            border: activeColor === null ? "3px solid #111" : "3px solid #E5E7EB",
            cursor: "pointer", fontSize: 16,
            transform: activeColor === null ? "scale(1.15)" : "scale(1)",
          }}>{"\u{1F9F9}"}</button>
        </div>
      )}

      {/* Grids */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 8 }}>
        {/* Original */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", marginBottom: 4 }}>ORIGINAL</div>
          <div style={{
            display: "grid", gridTemplateColumns: `repeat(${grid}, ${cellSize}px)`, gap: 2,
            padding: 4, borderRadius: 8, background: "#F3F4F6", border: "2px solid #E5E7EB",
          }}>
            {Array.from({ length: grid * grid }, (_, idx) => {
              const r = Math.floor(idx / grid);
              const c = idx % grid;
              const color = round.original[`${r},${c}`];
              return (
                <div key={idx} style={{
                  width: cellSize, height: cellSize, borderRadius: 3,
                  background: color || "#fff", border: "1px solid #E5E7EB",
                }} />
              );
            })}
          </div>
        </div>

        {/* Mirror line */}
        <div style={{
          width: 3, alignSelf: "stretch", marginTop: 18,
          background: "repeating-linear-gradient(180deg, #9CA3AF 0px, #9CA3AF 5px, transparent 5px, transparent 10px)",
          borderRadius: 2,
        }} />

        {/* Reflection */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", marginBottom: 4 }}>REFLECTION</div>
          <div style={{
            display: "grid", gridTemplateColumns: `repeat(${grid}, ${cellSize}px)`, gap: 2,
            padding: 4, borderRadius: 8,
            background: celebrated ? "#F0FDF4" : "#FFFBEB",
            border: `2px solid ${celebrated ? "#86EFAC" : "#FDE68A"}`,
            transition: "all 0.3s ease",
          }}>
            {Array.from({ length: grid * grid }, (_, idx) => {
              const r = Math.floor(idx / grid);
              const c = idx % grid;
              const key = `${r},${c}`;
              const placedColor = placed[key];
              const isTarget = !!round.answer[key];
              const isCorrect = placedColor && placedColor === round.answer[key];
              const isWrong = placedColor && placedColor !== round.answer[key];
              const showHintDot = showHint && isTarget && !placedColor;

              return (
                <div key={idx} onClick={() => handleCellTap(r, c)} style={{
                  width: cellSize, height: cellSize, borderRadius: 3,
                  background: placedColor || "#fff",
                  border: isCorrect ? "2px solid #22C55E" : isWrong ? "2px solid #EF4444" : "1px solid #E5E7EB",
                  cursor: celebrated ? "default" : "pointer",
                  position: "relative",
                  transition: "all 0.15s ease",
                  animation: isWrong ? "shake 0.3s ease" : placedColor ? "popIn 0.15s ease" : "none",
                }}>
                  {showHintDot && (
                    <div style={{
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                      width: 6, height: 6, borderRadius: "50%", background: "#FCD34D",
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress + controls */}
      <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#9CA3AF" }}>{correctCount}/{totalNeeded}</span>
        <button onClick={handleReset} style={{
          padding: "5px 12px", fontSize: 12, fontWeight: 600,
          border: "1px solid #E5E7EB", borderRadius: 6,
          background: "#fff", color: "#6B7280", cursor: "pointer",
        }}>Reset</button>
        {!showHint && !celebrated && (
          <button onClick={() => setShowHint(true)} style={{
            padding: "5px 12px", fontSize: 12, fontWeight: 600,
            border: "1px solid #FDE68A", borderRadius: 6,
            background: "#FFFBEB", color: "#92400E", cursor: "pointer",
          }}>{"\u{1F4A1}"} Hint</button>
        )}
      </div>

      {celebrated && (
        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800, color: "#22C55E", animation: "popIn 0.3s ease" }}>
          {"\u2728"} Perfect!
        </div>
      )}

      <style>{`
        @keyframes popIn { 0% { transform: scale(0); } 70% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
      `}</style>
    </div>
  );
}
