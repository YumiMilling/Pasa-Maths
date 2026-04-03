/**
 * TensFrame — drag counters into a 2x5 grid to build numbers.
 *
 * "Make 7" → child drags 7 counters into the frame.
 * Touch + mouse support via pointer events.
 */
import { useState, useRef, useCallback } from "react";

function randomTarget(max = 10) {
  return Math.floor(Math.random() * max) + 1;
}

export default function TensFrame({ params, onComplete }) {
  const max = params?.max || 10;
  const [target, setTarget] = useState(() => params?.target || randomTarget(max));
  const [cells, setCells] = useState(Array(10).fill(false));
  const [feedback, setFeedback] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cellRefs = useRef([]);

  const filled = cells.filter(Boolean).length;

  const handlePointerDown = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left - 20, y: e.clientY - rect.top - 20 });
    setDragPos({ x: e.clientX, y: e.clientY });
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = useCallback((e) => {
    if (!dragging) return;
    setDragging(false);

    // Find which cell we're over
    for (let i = 0; i < 10; i++) {
      const el = cellRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      ) {
        if (!cells[i]) {
          setCells(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }
        return;
      }
    }
  }, [dragging, cells]);

  const handleCellTap = (i) => {
    // Tap to toggle (remove counter)
    if (cells[i]) {
      setCells(prev => {
        const next = [...prev];
        next[i] = false;
        return next;
      });
    }
  };

  const handleCheck = () => {
    if (filled === target) {
      setFeedback("correct");
      setTimeout(() => {
        if (onComplete) {
          onComplete({ correct: true, answer: filled });
        } else {
          setFeedback(null);
          setTarget(randomTarget(max));
          setCells(Array(10).fill(false));
        }
      }, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => {
        if (onComplete) {
          onComplete({ correct: false, answer: filled });
        } else {
          setFeedback(null);
        }
      }, 1000);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 8, marginTop: 16 }}>
        Make <span style={{ fontSize: 36, fontWeight: 800, color: "#22C55E" }}>{target}</span>
      </div>
      <div style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 20 }}>
        Drag counters into the frame, or tap cells
      </div>

      {/* Tens frame grid: 2 rows x 5 cols */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(5, 56px)", gridTemplateRows: "repeat(2, 56px)",
        gap: 4, justifyContent: "center", marginBottom: 20,
        background: "#fff", padding: 12, borderRadius: 16,
        border: "2px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        {cells.map((filled, i) => (
          <div
            key={i}
            ref={el => cellRefs.current[i] = el}
            onClick={() => handleCellTap(i)}
            style={{
              width: 56, height: 56, borderRadius: 12,
              border: `2px dashed ${filled ? "#22C55E" : "#D1D5DB"}`,
              background: filled ? "#DCFCE7" : "#F9FAFB",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.15s ease",
            }}
          >
            {filled && (
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                boxShadow: "0 2px 6px rgba(34,197,94,0.3)",
                animation: "popIn 0.2s ease",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Counter source — drag from here */}
      <div style={{ marginBottom: 20, position: "relative" }}>
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            width: 60, height: 60, borderRadius: "50%", margin: "0 auto",
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
            cursor: "grab", touchAction: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "3px solid #fff",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>DRAG</span>
        </div>

        {/* Ghost while dragging */}
        {dragging && (
          <div style={{
            position: "fixed", left: dragPos.x - 20, top: dragPos.y - 20,
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            opacity: 0.8, pointerEvents: "none", zIndex: 100,
            boxShadow: "0 4px 16px rgba(34,197,94,0.4)",
          }} />
        )}
      </div>

      {/* Count + check */}
      <div style={{ fontSize: 16, fontWeight: 700, color: "#6B7280", marginBottom: 12 }}>
        You placed: <span style={{ color: "#22C55E", fontSize: 20 }}>{cells.filter(Boolean).length}</span>
      </div>

      <button
        onClick={handleCheck}
        style={{
          padding: "14px 32px", fontSize: 17, fontWeight: 700,
          border: "none", borderRadius: 12,
          background: feedback === "correct" ? "#22C55E" : feedback === "wrong" ? "#EF4444" : "#22C55E",
          color: "#fff", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
        }}
      >
        {feedback === "correct" ? "\u2705 Correct!" : feedback === "wrong" ? "\u274C Try again" : "Check"}
      </button>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
