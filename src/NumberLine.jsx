/**
 * NumberLine — tap or drag to place a number on the line.
 *
 * "Where does 7 go?" → child taps/drags on the number line.
 */
import { useState, useRef } from "react";

function randomTarget(max) {
  return Math.floor(Math.random() * (max - 1)) + 1;
}

export default function NumberLine({ params, onComplete }) {
  const [max] = useState(params?.max || 10);
  const [target, setTarget] = useState(() => params?.target || randomTarget(params?.max || 10));
  const [placed, setPlaced] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const lineRef = useRef(null);

  const handlePointerDown = (e) => {
    e.preventDefault();
    placeAt(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (e.buttons > 0 || e.pressure > 0) placeAt(e.clientX);
  };

  const placeAt = (clientX) => {
    if (!lineRef.current || feedback) return;
    const rect = lineRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const val = Math.round(pct * max);
    setPlaced(val);
  };

  const handleCheck = () => {
    if (placed === null) return;
    const correct = placed === target;
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      if (onComplete) {
        onComplete({ correct, answer: placed });
      } else {
        setFeedback(null);
        setPlaced(null);
        if (correct) setTarget(randomTarget(max));
      }
    }, correct ? 1200 : 1000);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
        Where does <span style={{ fontSize: 36, fontWeight: 800, color: "#2563EB" }}>{target}</span> go?
      </div>
      <div style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 28 }}>
        Tap or drag on the number line
      </div>

      {/* Number line */}
      <div style={{ padding: "0 20px", marginBottom: 24 }}>
        <div
          ref={lineRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          style={{
            position: "relative", height: 60, cursor: "pointer", touchAction: "none",
          }}
        >
          {/* Line */}
          <div style={{
            position: "absolute", top: 28, left: 0, right: 0, height: 4,
            background: "#D1D5DB", borderRadius: 2,
          }} />

          {/* Ticks + labels */}
          {Array.from({ length: max + 1 }, (_, i) => {
            const pct = (i / max) * 100;
            return (
              <div key={i} style={{
                position: "absolute", left: `${pct}%`, top: 18,
                transform: "translateX(-50%)", textAlign: "center",
              }}>
                <div style={{
                  width: 2, height: i % 5 === 0 ? 24 : 14,
                  background: "#9CA3AF", margin: "0 auto",
                }} />
                <div style={{
                  fontSize: 12, fontWeight: 600, color: "#6B7280", marginTop: 4,
                }}>
                  {i}
                </div>
              </div>
            );
          })}

          {/* Placed marker */}
          {placed !== null && (
            <div style={{
              position: "absolute", left: `${(placed / max) * 100}%`, top: 0,
              transform: "translateX(-50%)",
              transition: "left 0.1s ease",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: feedback === "correct" ? "#22C55E" : feedback === "wrong" ? "#EF4444" : "#2563EB",
                boxShadow: `0 4px 12px ${feedback === "correct" ? "rgba(34,197,94,0.4)" : feedback === "wrong" ? "rgba(239,68,68,0.4)" : "rgba(37,99,235,0.4)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 14, fontWeight: 800,
                animation: "popIn 0.15s ease",
              }}>
                {placed}
              </div>
            </div>
          )}
        </div>
      </div>

      {placed !== null && (
        <button
          onClick={handleCheck}
          style={{
            padding: "14px 32px", fontSize: 17, fontWeight: 700,
            border: "none", borderRadius: 12,
            background: feedback === "correct" ? "#22C55E" : feedback === "wrong" ? "#EF4444" : "#2563EB",
            color: "#fff", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          }}
        >
          {feedback === "correct" ? "\u2705 Correct!" : feedback === "wrong" ? `\u274C It was ${target}` : "Check"}
        </button>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: translateX(-50%) scale(0); }
          70% { transform: translateX(-50%) scale(1.15); }
          100% { transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
