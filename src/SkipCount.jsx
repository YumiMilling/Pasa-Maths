/**
 * SkipCount — frog hops on a number line.
 *
 * Set the hop size, then tap to jump. Land on the target!
 * Teaches skip counting and multiplication readiness.
 */
import { useState, useEffect } from "react";
import { IconFrog, IconSparkle } from "./components/Icons";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRound(level) {
  const hops = level <= 2 ? [2] : level <= 4 ? [2, 5] : [2, 3, 5, 10];
  const hop = hops[Math.floor(Math.random() * hops.length)];
  const steps = rand(2, 5);
  const target = hop * steps;
  const max = Math.max(target + hop * 2, 30);
  return { hop, target, max, steps };
}

export default function SkipCount({ params, onComplete }) {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => {
    if (params) {
      const hop = params.hop ?? 2;
      const target = params.target ?? hop * 3;
      const max = params.max ?? Math.max(target + hop * 2, 30);
      return { hop, target, max, steps: target / hop };
    }
    return generateRound(1);
  });
  const [pos, setPos] = useState(0);
  const [trail, setTrail] = useState([0]);
  const [celebrated, setCelebrated] = useState(false);
  const [overshot, setOvershot] = useState(false);

  const atTarget = pos === round.target;

  useEffect(() => {
    if (atTarget && !celebrated) {
      setCelebrated(true);
      if (onComplete) {
        setTimeout(() => onComplete({ correct: true, answer: round.target }), 1200);
      } else {
        setTimeout(() => {
          const next = level + 1;
          setLevel(next);
          setRound(generateRound(next));
          setPos(0);
          setTrail([0]);
          setCelebrated(false);
          setOvershot(false);
        }, 1800);
      }
    }
  }, [atTarget, celebrated, level]);

  const handleHop = () => {
    if (celebrated) return;
    const newPos = pos + round.hop;
    if (newPos > round.max) return;
    if (newPos > round.target) {
      setOvershot(true);
      setTimeout(() => setOvershot(false), 1200);
      return;
    }
    setPos(newPos);
    setTrail(prev => [...prev, newPos]);
  };

  const handleUndo = () => {
    if (celebrated || trail.length <= 1) return;
    const newTrail = trail.slice(0, -1);
    setPos(newTrail[newTrail.length - 1]);
    setTrail(newTrail);
    setOvershot(false);
  };

  const handleReset = () => {
    setPos(0);
    setTrail([0]);
    setOvershot(false);
  };

  // Number line ticks
  const ticks = [];
  for (let i = 0; i <= round.max; i += round.hop <= 5 ? 1 : 5) {
    ticks.push(i);
  }

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#DCFCE7", color: "#166534" }}>
          Skip counting by {round.hop}
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
        Hop to <span style={{ fontSize: 28, color: "#2563EB" }}>{round.target}</span>
      </div>
      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>
        Each hop = +{round.hop}
      </div>

      {/* Number line with frog */}
      <div style={{ padding: "0 12px", marginBottom: 20, overflowX: "auto" }}>
        <div style={{ position: "relative", height: 80, minWidth: 300 }}>
          {/* Line */}
          <div style={{
            position: "absolute", top: 44, left: 0, right: 0, height: 3,
            background: "#D1D5DB", borderRadius: 2,
          }} />

          {/* Target marker */}
          <div style={{
            position: "absolute", left: `${(round.target / round.max) * 100}%`, top: 30,
            transform: "translateX(-50%)",
          }}>
            <div style={{
              width: 4, height: 32, background: "#2563EB", borderRadius: 2, margin: "0 auto",
            }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: "#2563EB", marginTop: 2 }}>
              {round.target}
            </div>
          </div>

          {/* Trail arcs */}
          {trail.map((t, i) => {
            if (i === 0) return null;
            const fromPct = (trail[i - 1] / round.max) * 100;
            const toPct = (t / round.max) * 100;
            const midPct = (fromPct + toPct) / 2;
            const width = toPct - fromPct;
            return (
              <div key={i} style={{
                position: "absolute",
                left: `${fromPct}%`, top: 14,
                width: `${width}%`, height: 30,
                borderBottom: "2px dashed #22C55E",
                borderLeft: "none", borderRight: "none",
                borderRadius: "50% 50% 0 0",
                borderTop: "2px dashed #22C55E",
              }} />
            );
          })}

          {/* Tick marks */}
          {ticks.map(t => (
            <div key={t} style={{
              position: "absolute", left: `${(t / round.max) * 100}%`, top: 38,
              transform: "translateX(-50%)",
            }}>
              <div style={{
                width: 1, height: t % round.hop === 0 ? 16 : 8,
                background: "#9CA3AF", margin: "0 auto",
              }} />
              {(t % (round.hop <= 3 ? round.hop : 5) === 0) && (
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{t}</div>
              )}
            </div>
          ))}

          {/* Frog */}
          <div style={{
            position: "absolute",
            left: `${(pos / round.max) * 100}%`,
            top: 4,
            transform: "translateX(-50%)",
            transition: "left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <IconFrog size={28} />
          </div>
        </div>
      </div>

      {/* Status */}
      {overshot && (
        <div style={{ fontSize: 14, color: "#EF4444", fontWeight: 600, marginBottom: 8 }}>
          Too far! You'd land on {pos + round.hop}
        </div>
      )}

      {celebrated && (
        <div style={{ fontSize: 20, fontWeight: 800, color: "#22C55E", marginBottom: 8, animation: "popIn 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <IconSparkle size={20} /> {trail.length - 1} hops of {round.hop} = {round.target}
        </div>
      )}

      {/* Hop trail display */}
      {trail.length > 1 && (
        <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>
          {trail.join(` +${round.hop} → `)}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={handleHop} disabled={celebrated} style={{
          padding: "14px 28px", fontSize: 18, fontWeight: 800,
          border: "none", borderRadius: 14,
          background: "#22C55E", color: "#fff", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <IconFrog size={28} /> +{round.hop}
        </button>
        <button onClick={handleUndo} disabled={trail.length <= 1 || celebrated} style={{
          padding: "12px 20px", fontSize: 14, fontWeight: 600,
          border: "1px solid #E5E7EB", borderRadius: 12,
          background: "#fff", color: "#6B7280", cursor: "pointer",
          opacity: trail.length > 1 ? 1 : 0.3,
        }}>Undo</button>
        <button onClick={handleReset} style={{
          padding: "12px 20px", fontSize: 14, fontWeight: 600,
          border: "1px solid #E5E7EB", borderRadius: 12,
          background: "#fff", color: "#6B7280", cursor: "pointer",
        }}>Reset</button>
      </div>

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
