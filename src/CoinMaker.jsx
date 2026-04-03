/**
 * CoinMaker — build numbers with place value blocks.
 *
 * Tap to add ones. When you hit 10, they fuse into a ten-bar.
 * 10 ten-bars fuse into a hundred-block. Build the target number.
 */
import { useState, useEffect } from "react";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTarget(level) {
  if (level <= 3) return rand(5, 20);
  if (level <= 6) return rand(15, 50);
  return rand(30, 150);
}

export default function CoinMaker({ params, onComplete }) {
  const [level, setLevel] = useState(1);
  const [target, setTarget] = useState(() => params?.target ?? generateTarget(1));
  const [hundreds, setHundreds] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [celebrated, setCelebrated] = useState(false);
  const [fusionFlash, setFusionFlash] = useState(null); // "tens" | "hundreds"

  const total = hundreds * 100 + tens * 10 + ones;
  const balanced = total === target;

  // Auto-fuse: 10 ones → 1 ten
  useEffect(() => {
    if (ones >= 10) {
      setFusionFlash("tens");
      setTimeout(() => {
        setOnes(o => o - 10);
        setTens(t => t + 1);
        setFusionFlash(null);
      }, 400);
    }
  }, [ones]);

  // Auto-fuse: 10 tens → 1 hundred
  useEffect(() => {
    if (tens >= 10) {
      setFusionFlash("hundreds");
      setTimeout(() => {
        setTens(t => t - 10);
        setHundreds(h => h + 1);
        setFusionFlash(null);
      }, 400);
    }
  }, [tens]);

  // Celebrate
  useEffect(() => {
    if (balanced && !celebrated && total > 0) {
      setCelebrated(true);
      if (onComplete) {
        setTimeout(() => onComplete({ correct: true, answer: target }), 1200);
      } else {
        setTimeout(() => {
          const next = level + 1;
          setLevel(next);
          setTarget(generateTarget(next));
          setHundreds(0);
          setTens(0);
          setOnes(0);
          setCelebrated(false);
        }, 1800);
      }
    }
  }, [balanced, celebrated, total, level]);

  const addOne = () => { if (!celebrated) setOnes(o => o + 1); };
  const addTen = () => { if (!celebrated) setTens(t => t + 1); };
  const removeOne = () => { if (!celebrated && ones > 0) setOnes(o => o - 1); };
  const removeTen = () => { if (!celebrated && tens > 0) setTens(t => t - 1); };
  const removeHundred = () => { if (!celebrated && hundreds > 0) setHundreds(h => h - 1); };

  const handleReset = () => {
    setHundreds(0); setTens(0); setOnes(0);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#FEE2E2", color: "#991B1B" }}>
          Place Value
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
        Build this number
      </div>
      <div style={{ fontSize: 48, fontWeight: 800, color: "#1D4ED8", marginBottom: 4 }}>
        {target}
      </div>
      <div style={{ fontSize: 16, color: total === target ? "#22C55E" : "#9CA3AF", fontWeight: 700, marginBottom: 16 }}>
        You have: {total}
      </div>

      {/* Visual blocks */}
      <div style={{
        display: "flex", gap: 16, justifyContent: "center", alignItems: "flex-end",
        minHeight: 100, marginBottom: 20, padding: "0 12px",
      }}>
        {/* Hundreds */}
        {hundreds > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", maxWidth: 60 }}>
              {Array.from({ length: hundreds }, (_, i) => (
                <div key={i} onClick={removeHundred} style={{
                  width: 48, height: 48, borderRadius: 6, background: "#EF4444",
                  border: "2px solid #DC2626", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 800, color: "#fff",
                  animation: fusionFlash === "hundreds" ? "popIn 0.3s ease" : "none",
                }}>100</div>
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>hundreds</span>
          </div>
        )}

        {/* Tens */}
        {tens > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", maxWidth: 80 }}>
              {Array.from({ length: tens }, (_, i) => (
                <div key={i} onClick={removeTen} style={{
                  width: 16, height: 48, borderRadius: 4, background: "#3B82F6",
                  border: "1px solid #2563EB", cursor: "pointer",
                  animation: fusionFlash === "tens" ? "popIn 0.3s ease" : "none",
                }} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>tens</span>
          </div>
        )}

        {/* Ones */}
        {ones > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", maxWidth: 60 }}>
              {Array.from({ length: ones }, (_, i) => (
                <div key={i} onClick={removeOne} style={{
                  width: 16, height: 16, borderRadius: 3, background: "#22C55E",
                  border: "1px solid #16A34A", cursor: "pointer",
                }} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>ones</span>
          </div>
        )}

        {total === 0 && (
          <div style={{ fontSize: 14, color: "#D1D5DB", padding: 20 }}>
            Tap buttons below to add blocks
          </div>
        )}
      </div>

      {/* Hint about fusion */}
      {fusionFlash && (
        <div style={{
          fontSize: 14, fontWeight: 700, color: "#F59E0B", marginBottom: 8,
          animation: "popIn 0.3s ease",
        }}>
          {fusionFlash === "tens" ? "\u2728 10 ones made a ten!" : "\u2728 10 tens made a hundred!"}
        </div>
      )}

      {celebrated && (
        <div style={{ fontSize: 20, fontWeight: 800, color: "#22C55E", marginBottom: 8, animation: "popIn 0.3s ease" }}>
          {"\u2728"} {target} = {hundreds > 0 ? `${hundreds} hundreds ` : ""}{tens > 0 ? `${tens} tens ` : ""}{ones > 0 ? `${ones} ones` : ""}
        </div>
      )}

      {/* Add buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        <button onClick={addOne} disabled={celebrated} style={{
          padding: "12px 20px", fontSize: 15, fontWeight: 700,
          border: "none", borderRadius: 12,
          background: "#22C55E", color: "#fff", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
        }}>+1</button>
        <button onClick={addTen} disabled={celebrated} style={{
          padding: "12px 20px", fontSize: 15, fontWeight: 700,
          border: "none", borderRadius: 12,
          background: "#3B82F6", color: "#fff", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
        }}>+10</button>
        {target >= 100 && (
          <button onClick={() => { if (!celebrated) setHundreds(h => h + 1); }} style={{
            padding: "12px 20px", fontSize: 15, fontWeight: 700,
            border: "none", borderRadius: 12,
            background: "#EF4444", color: "#fff", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
          }}>+100</button>
        )}
        <button onClick={handleReset} style={{
          padding: "10px 16px", fontSize: 13, fontWeight: 600,
          border: "1px solid #E5E7EB", borderRadius: 10,
          background: "#fff", color: "#6B7280", cursor: "pointer",
        }}>Reset</button>
      </div>

      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
        Tap blocks to remove them. 10 ones auto-merge into a ten!
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
