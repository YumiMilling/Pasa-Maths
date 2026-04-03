/**
 * FairShare — division as equal sharing.
 *
 * N cookies, M plates. Tap to give one cookie to each plate.
 * Leftovers show remainder visually.
 */
import { useState, useEffect } from "react";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRound(level) {
  const plates = level <= 2 ? 2 : level <= 4 ? rand(2, 3) : rand(2, 5);
  const hasRemainder = level > 2 && Math.random() > 0.5;
  const perPlate = rand(1, 4);
  const total = perPlate * plates + (hasRemainder ? rand(1, plates - 1) : 0);
  return { total, plates };
}

export default function FairShare({ params, onComplete }) {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => {
    if (params) {
      return { total: params.total ?? 10, plates: params.plates ?? 2 };
    }
    return generateRound(1);
  });
  const [distribution, setDistribution] = useState([]); // array of plate counts
  const [remaining, setRemaining] = useState(0);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    setDistribution(Array(round.plates).fill(0));
    setRemaining(round.total);
  }, [round]);

  const perPlate = Math.floor(round.total / round.plates);
  const remainder = round.total % round.plates;
  const allCorrect = distribution.every(d => d === perPlate) && remaining === remainder;

  useEffect(() => {
    if (allCorrect && !celebrated && distribution.length > 0 && distribution[0] > 0) {
      setCelebrated(true);
      if (onComplete) {
        setTimeout(() => onComplete({ correct: true, answer: perPlate }), 1200);
      } else {
        setTimeout(() => {
          const next = level + 1;
          setLevel(next);
          setRound(generateRound(next));
          setCelebrated(false);
        }, 2000);
      }
    }
  }, [allCorrect, celebrated, distribution, level]);

  const giveToPlate = (plateIdx) => {
    if (celebrated || remaining <= 0) return;
    setDistribution(prev => {
      const next = [...prev];
      next[plateIdx]++;
      return next;
    });
    setRemaining(r => r - 1);
  };

  const takeFromPlate = (plateIdx) => {
    if (celebrated || distribution[plateIdx] <= 0) return;
    setDistribution(prev => {
      const next = [...prev];
      next[plateIdx]--;
      return next;
    });
    setRemaining(r => r + 1);
  };

  const handleReset = () => {
    setDistribution(Array(round.plates).fill(0));
    setRemaining(round.total);
  };

  const isEqual = distribution.length > 0 && new Set(distribution).size === 1 && distribution[0] > 0;

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#FEF3C7", color: "#92400E" }}>
          Division
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
        Share equally!
      </div>
      <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
        {round.total} cookies for {round.plates} friends — tap a plate to give it a cookie
      </div>

      {/* Remaining cookies */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center",
        padding: 12, minHeight: 44, marginBottom: 16,
        background: "#FFFBEB", borderRadius: 12, border: "1px solid #FDE68A",
      }}>
        {remaining > 0 ? (
          Array.from({ length: remaining }, (_, i) => (
            <span key={i} style={{ fontSize: 22 }}>{"\u{1F36A}"}</span>
          ))
        ) : (
          <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>
            {isEqual ? "All shared!" : "None left" + (remainder > 0 ? "" : "")}
          </span>
        )}
      </div>

      {/* Plates */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
        {distribution.map((count, i) => {
          const isRight = count === perPlate && remaining <= remainder;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div
                onClick={() => giveToPlate(i)}
                style={{
                  width: 72, minHeight: 72, borderRadius: "50%",
                  background: isRight && allCorrect ? "#DCFCE7" : "#F3F4F6",
                  border: `3px solid ${isRight && allCorrect ? "#22C55E" : "#D1D5DB"}`,
                  display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
                  gap: 2, padding: 8, cursor: remaining > 0 ? "pointer" : "default",
                  transition: "all 0.2s ease",
                }}
              >
                {count > 0 ? (
                  Array.from({ length: count }, (_, j) => (
                    <span key={j} style={{ fontSize: 16, animation: "popIn 0.15s ease" }}>{"\u{1F36A}"}</span>
                  ))
                ) : (
                  <span style={{ fontSize: 11, color: "#D1D5DB" }}>tap</span>
                )}
              </div>
              <button
                onClick={() => takeFromPlate(i)}
                disabled={count === 0 || celebrated}
                style={{
                  fontSize: 11, color: "#9CA3AF", border: "none", background: "none",
                  cursor: count > 0 ? "pointer" : "default", textDecoration: "underline",
                  opacity: count > 0 ? 1 : 0,
                }}
              >undo</button>
            </div>
          );
        })}
      </div>

      {/* Status */}
      {!celebrated && distribution.some(d => d > 0) && !allCorrect && remaining === 0 && !isEqual && (
        <div style={{ fontSize: 14, color: "#EF4444", fontWeight: 600, marginBottom: 8 }}>
          Not equal! Some plates have more than others. Tap undo to fix.
        </div>
      )}

      {celebrated && (
        <div style={{ fontSize: 18, fontWeight: 800, color: "#22C55E", marginBottom: 8, animation: "popIn 0.3s ease" }}>
          {"\u2728"} {round.total} {"\u00F7"} {round.plates} = {perPlate}{remainder > 0 ? ` remainder ${remainder}` : ""}
        </div>
      )}

      <button onClick={handleReset} style={{
        padding: "8px 20px", fontSize: 13, fontWeight: 600,
        border: "1px solid #E5E7EB", borderRadius: 8,
        background: "#fff", color: "#6B7280", cursor: "pointer",
      }}>Start over</button>

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
