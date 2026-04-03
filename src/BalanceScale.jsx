/**
 * BalanceScale — proper hanging scale.
 *
 * Layout (top to bottom):
 *   - Beam: horizontal bar that tilts around center fulcrum
 *   - Strings: hang from each end of the beam
 *   - Pans: dangle from strings
 *   - Stand: vertical post from fulcrum down to base
 *   - Base: flat rectangle at bottom
 *
 * Concrete mode: add apples to match.
 * Numbers mode: pick 2 cards that sum to target.
 */
import { useState, useEffect } from "react";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRound(level) {
  if (level <= 3) {
    return { target: rand(2, 7), type: "concrete" };
  }
  const target = rand(4, 12);
  const a = rand(1, target - 1);
  const b = target - a;
  const distractors = [];
  while (distractors.length < 3) {
    const d = rand(1, 9);
    if (d !== a && d !== b && !distractors.includes(d)) distractors.push(d);
  }
  const cards = [a, b, ...distractors].sort(() => Math.random() - 0.5);
  return { target, type: "numbers", cards };
}

// Scale dimensions
const W = 320;          // total width
const BEAM_Y = 24;      // beam top — pushed down for breathing room
const BEAM_H = 6;
const BEAM_LEFT = 20;
const BEAM_RIGHT = W - 20;
const BEAM_CX = W / 2;
const STRING_LEN = 28;
const PAN_W = 120;
const PAN_H = 76;
const STAND_TOP = BEAM_Y + BEAM_H;
const STAND_H = STRING_LEN + PAN_H + 20;
const BASE_W = 80;
const BASE_H = 8;
const TOTAL_H = BEAM_Y + BEAM_H + STRING_LEN + PAN_H + 24;

export default function BalanceScale({ params, onComplete }) {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => generateRound(1));
  const [rightItems, setRightItems] = useState([]);
  const [celebrated, setCelebrated] = useState(false);
  const [usedCards, setUsedCards] = useState(new Set());

  const rightTotal = round.type === "concrete"
    ? rightItems.length
    : rightItems.reduce((s, n) => s + n, 0);

  const diff = round.target - rightTotal;
  // Left heavier → negative angle (left drops), right heavier → positive
  const angleDeg = diff === 0 ? 0 : diff > 0 ? -Math.min(diff * 3, 15) : Math.min(-diff * 3, 15);
  const angleRad = angleDeg * Math.PI / 180;
  const balanced = diff === 0 && rightItems.length > 0 && (round.type === "concrete" || rightItems.length >= 2);

  // Beam end positions after tilt (rotate around center)
  const halfBeam = (BEAM_RIGHT - BEAM_LEFT) / 2;
  // Y position at each beam end — bottom of the beam, so string connects flush
  const leftEndY = BEAM_Y + BEAM_H - Math.sin(angleRad) * halfBeam;
  const rightEndY = BEAM_Y + BEAM_H + Math.sin(angleRad) * halfBeam;

  useEffect(() => {
    if (balanced && !celebrated) {
      setCelebrated(true);
      if (onComplete) {
        setTimeout(() => onComplete({ correct: true, answer: rightTotal }), 1200);
      } else {
        setTimeout(() => {
          const next = level + 1;
          setLevel(next);
          setRound(generateRound(next));
          setRightItems([]);
          setUsedCards(new Set());
          setCelebrated(false);
        }, 2000);
      }
    }
  }, [balanced, celebrated, level]);

  const addItem = () => { if (!celebrated) setRightItems(prev => [...prev, 1]); };
  const removeItem = () => { if (!celebrated && rightItems.length > 0) setRightItems(prev => prev.slice(0, -1)); };
  const addCard = (value, index) => {
    if (celebrated || usedCards.has(index) || rightItems.length >= 2) return;
    setRightItems(prev => [...prev, value]);
    setUsedCards(prev => new Set([...prev, index]));
  };
  const resetRight = () => { setRightItems([]); setUsedCards(new Set()); };

  const trans = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{
          fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
          background: round.type === "concrete" ? "#DBEAFE" : "#EDE9FE",
          color: round.type === "concrete" ? "#1D4ED8" : "#7C3AED",
        }}>
          {round.type === "concrete" ? "Count" : "Add two numbers"}
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 16 }}>
        {round.type === "concrete"
          ? "Add apples to balance the scale"
          : "Pick 2 numbers that add up to balance"}
      </div>

      {/* Number cards — above scale */}
      {round.type === "numbers" && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {round.cards.map((val, i) => (
              <button key={i} onClick={() => addCard(val, i)}
                disabled={usedCards.has(i) || celebrated || rightItems.length >= 2}
                style={{
                  width: 52, height: 52, borderRadius: 14, fontSize: 22, fontWeight: 800,
                  border: usedCards.has(i) ? "2px solid #E5E7EB" : "2px solid #8B5CF6",
                  background: usedCards.has(i) ? "#F3F4F6" : "#EDE9FE",
                  color: usedCards.has(i) ? "#D1D5DB" : "#7C3AED",
                  cursor: usedCards.has(i) || rightItems.length >= 2 ? "default" : "pointer",
                  opacity: (!usedCards.has(i) && rightItems.length >= 2) ? 0.4 : 1,
                  transition: "all 0.15s ease",
                }}
              >{val}</button>
            ))}
          </div>
          {rightItems.length > 0 && !celebrated && (
            <button onClick={resetRight} style={{
              marginTop: 10, padding: "6px 16px", fontSize: 12, fontWeight: 600,
              border: "1px solid #E5E7EB", borderRadius: 8,
              background: "#fff", color: "#9CA3AF", cursor: "pointer",
            }}>Start over</button>
          )}
        </div>
      )}

      {/* ═══ THE SCALE ═══ */}
      <div style={{ position: "relative", width: W, height: TOTAL_H, margin: "0 auto" }}>

        {/* Beam */}
        <div style={{
          position: "absolute", top: BEAM_Y, left: BEAM_LEFT, width: BEAM_RIGHT - BEAM_LEFT, height: BEAM_H,
          background: balanced ? "#22C55E" : "#78716C", borderRadius: 3,
          transformOrigin: "center center",
          transform: `rotate(${angleDeg}deg)`,
          transition: trans, zIndex: 3,
        }} />

        {/* Fulcrum triangle — sits right under beam center */}
        <div style={{
          position: "absolute", top: BEAM_Y + BEAM_H - 1, left: BEAM_CX - 14,
          width: 0, height: 0,
          borderLeft: "14px solid transparent", borderRight: "14px solid transparent",
          borderTop: "16px solid #A8A29E",
          zIndex: 2,
        }} />

        {/* Stand */}
        <div style={{
          position: "absolute", top: BEAM_Y + BEAM_H + 14, left: BEAM_CX - 3,
          width: 6, height: STAND_H - 14, background: "#A8A29E", borderRadius: 3, zIndex: 1,
        }} />

        {/* Base */}
        <div style={{
          position: "absolute", bottom: 0, left: BEAM_CX - BASE_W / 2,
          width: BASE_W, height: BASE_H, background: "#A8A29E", borderRadius: 4, zIndex: 1,
        }} />

        {/* ── Left side: string + pan ── */}
        <div style={{
          position: "absolute",
          left: BEAM_LEFT - PAN_W / 2 + 2,
          top: leftEndY,
          width: PAN_W,
          display: "flex", flexDirection: "column", alignItems: "center",
          transition: trans, zIndex: 4,
        }}>
          {/* String */}
          <div style={{ width: 2, height: STRING_LEN, background: "#A8A29E" }} />
          {/* Pan */}
          <div style={{
            width: PAN_W, minHeight: PAN_H,
            borderRadius: "4px 4px 20px 20px",
            background: "#EFF6FF", border: "2px solid #93C5FD",
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
            gap: 3, padding: 8,
          }}>
            {round.type === "concrete" ? (
              Array.from({ length: round.target }, (_, i) => (
                <span key={i} style={{ fontSize: 18 }}>{"\u{1F34E}"}</span>
              ))
            ) : (
              <span style={{ fontSize: 30, fontWeight: 800, color: "#1D4ED8" }}>{round.target}</span>
            )}
          </div>
        </div>

        {/* ── Right side: string + pan ── */}
        <div style={{
          position: "absolute",
          right: W - BEAM_RIGHT - PAN_W / 2 + 2,
          top: rightEndY,
          width: PAN_W,
          display: "flex", flexDirection: "column", alignItems: "center",
          transition: trans, zIndex: 4,
        }}>
          {/* String */}
          <div style={{ width: 2, height: STRING_LEN, background: "#A8A29E" }} />
          {/* Pan */}
          <div style={{
            width: PAN_W, minHeight: PAN_H,
            borderRadius: "4px 4px 20px 20px",
            background: balanced ? "#DCFCE7" : "#FFFBEB",
            border: `2px solid ${balanced ? "#86EFAC" : "#FCD34D"}`,
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
            gap: 3, padding: 8,
            transition: "background 0.3s, border-color 0.3s",
          }}>
            {round.type === "concrete" ? (
              rightItems.length === 0
                ? <span style={{ fontSize: 13, color: "#D1D5DB" }}>tap +</span>
                : rightItems.map((_, i) => (
                  <span key={i} style={{ fontSize: 18, animation: "popIn 0.2s ease" }}>{"\u{1F34E}"}</span>
                ))
            ) : (
              rightItems.length === 0
                ? <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, border: "2px dashed #D1D5DB" }} />
                    <span style={{ fontSize: 16, color: "#D1D5DB", fontWeight: 800 }}>+</span>
                    <div style={{ width: 30, height: 30, borderRadius: 8, border: "2px dashed #D1D5DB" }} />
                  </div>
                : <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {rightItems.map((n, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        {i > 0 && <span style={{ fontSize: 16, fontWeight: 800, color: "#9CA3AF" }}>+</span>}
                        <span style={{
                          fontSize: 20, fontWeight: 800, color: "#7C3AED",
                          background: "#EDE9FE", padding: "2px 6px", borderRadius: 6,
                        }}>{n}</span>
                      </span>
                    ))}
                    {rightItems.length === 2 && (
                      <>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>=</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: balanced ? "#166534" : "#92400E" }}>{rightTotal}</span>
                      </>
                    )}
                  </div>
            )}
          </div>
        </div>

        {/* Celebration */}
        {balanced && (
          <div style={{
            position: "absolute", top: BEAM_Y - 30, left: BEAM_CX - 20,
            fontSize: 36, animation: "popIn 0.4s ease", zIndex: 10,
          }}>
            {"\u2728"}
          </div>
        )}
      </div>

      {/* Apple controls — below scale */}
      {round.type === "concrete" && (
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
          <button onClick={removeItem} disabled={rightItems.length === 0 || celebrated} style={{
            width: 60, height: 60, borderRadius: 16, fontSize: 26,
            border: "2px solid #E5E7EB", background: "#fff", color: "#6B7280",
            cursor: rightItems.length > 0 ? "pointer" : "default",
            opacity: rightItems.length > 0 ? 1 : 0.3,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>-</button>
          <button onClick={addItem} disabled={celebrated} style={{
            width: 76, height: 60, borderRadius: 16, fontSize: 22,
            border: "none", background: "#22C55E", color: "#fff",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
          }}>{"\u{1F34E}"} +</button>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
