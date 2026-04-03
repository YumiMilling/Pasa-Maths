/**
 * KwachaMoney — count coins and make change.
 *
 * Shows Kwacha coins/notes. Child counts the total or
 * selects coins to make a target amount.
 */
import { useState, useEffect } from "react";

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const COINS = [
  { value: 0.05, label: "5n", color: "#A8A29E", size: 28 },
  { value: 0.10, label: "10n", color: "#A8A29E", size: 32 },
  { value: 0.50, label: "50n", color: "#D4D4D4", size: 36 },
  { value: 1, label: "K1", color: "#FCD34D", size: 40 },
  { value: 5, label: "K5", color: "#FCD34D", size: 44 },
  { value: 10, label: "K10", color: "#86EFAC", size: 48 },
];

function generateRound(level) {
  if (level <= 3) {
    // Count coins: only K1 and K5
    const pool = COINS.filter(c => c.value >= 1 && c.value <= 5);
    const count = rand(2, 4);
    const given = Array.from({ length: count }, () => pool[rand(0, pool.length - 1)]);
    const total = given.reduce((s, c) => s + c.value, 0);
    return { type: "count", given, total };
  }
  if (level <= 6) {
    // Count mixed coins
    const pool = COINS.filter(c => c.value >= 0.50);
    const count = rand(3, 5);
    const given = Array.from({ length: count }, () => pool[rand(0, pool.length - 1)]);
    const total = Math.round(given.reduce((s, c) => s + c.value, 0) * 100) / 100;
    return { type: "count", given, total };
  }
  // Make change: pick coins to reach target
  const target = [2, 3, 5, 6, 7, 8, 11, 12, 15][rand(0, 8)];
  const available = [];
  for (const coin of COINS.filter(c => c.value >= 1)) {
    const n = rand(1, 3);
    for (let i = 0; i < n; i++) available.push(coin);
  }
  return { type: "make", target, available: available.sort(() => Math.random() - 0.5) };
}

function formatK(v) {
  if (v >= 1) return `K${v}`;
  return `${Math.round(v * 100)}n`;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function KwachaMoney() {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => generateRound(1));
  const [answer, setAnswer] = useState("");
  const [selectedCoins, setSelectedCoins] = useState(new Set());
  const [feedback, setFeedback] = useState(null);

  const advance = () => {
    const next = level + 1;
    setLevel(next);
    setRound(generateRound(next));
    setAnswer("");
    setSelectedCoins(new Set());
    setFeedback(null);
  };

  // Count mode
  const handleCountSubmit = (e) => {
    e.preventDefault();
    if (feedback) return;
    const parsed = parseFloat(answer);
    const correct = Math.abs(parsed - round.total) < 0.01;
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      if (correct) advance();
      else setFeedback(null);
    }, correct ? 1200 : 800);
  };

  // Make mode
  const toggleCoin = (i) => {
    if (feedback) return;
    setSelectedCoins(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const selectedTotal = round.type === "make"
    ? Math.round([...selectedCoins].reduce((s, i) => s + round.available[i].value, 0) * 100) / 100
    : 0;

  const makeCorrect = round.type === "make" && Math.abs(selectedTotal - round.target) < 0.01;

  useEffect(() => {
    if (makeCorrect && !feedback) {
      setFeedback("correct");
      setTimeout(advance, 1500);
    }
  }, [makeCorrect]);

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#FEF3C7", color: "#92400E" }}>
          Kwacha
        </span>
      </div>

      {round.type === "count" ? (
        <>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 16 }}>
            How much money is here?
          </div>

          {/* Coins display */}
          <div style={{
            display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap",
            padding: 16, marginBottom: 20, background: "#FFFBEB",
            borderRadius: 16, border: "1px solid #FDE68A",
          }}>
            {round.given.map((coin, i) => (
              <div key={i} style={{
                width: coin.size + 8, height: coin.size + 8,
                borderRadius: "50%", background: coin.color,
                border: "2px solid #92400E",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: coin.size < 36 ? 10 : 13, fontWeight: 800, color: "#374151",
              }}>
                {coin.label}
              </div>
            ))}
          </div>

          {/* Answer input */}
          <form onSubmit={handleCountSubmit} style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>K</span>
              <input
                type="number"
                step="0.01"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="0"
                style={{
                  width: 80, padding: "10px 12px", fontSize: 20, fontWeight: 700,
                  textAlign: "center", border: `2px solid ${feedback === "wrong" ? "#EF4444" : "#E5E7EB"}`,
                  borderRadius: 10, outline: "none",
                }}
              />
            </div>
            <button type="submit" disabled={!answer} style={{
              padding: "10px 20px", fontSize: 16, fontWeight: 700,
              border: "none", borderRadius: 10,
              background: answer ? "#22C55E" : "#E5E7EB",
              color: answer ? "#fff" : "#9CA3AF", cursor: answer ? "pointer" : "default",
            }}>Check</button>
          </form>
        </>
      ) : (
        <>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
            Make <span style={{ fontSize: 28, color: "#166534" }}>K{round.target}</span>
          </div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>
            Tap coins to select them — total: <span style={{ fontWeight: 700, color: makeCorrect ? "#22C55E" : "#374151" }}>K{selectedTotal}</span>
          </div>

          {/* Available coins */}
          <div style={{
            display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap",
            padding: 16, marginBottom: 16, background: "#FFFBEB",
            borderRadius: 16, border: "1px solid #FDE68A",
          }}>
            {round.available.map((coin, i) => {
              const isSel = selectedCoins.has(i);
              return (
                <button key={i} onClick={() => toggleCoin(i)} style={{
                  width: coin.size + 8, height: coin.size + 8,
                  borderRadius: "50%",
                  background: isSel ? "#22C55E" : coin.color,
                  border: `3px solid ${isSel ? "#166534" : "#92400E"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: coin.size < 36 ? 10 : 13, fontWeight: 800,
                  color: isSel ? "#fff" : "#374151",
                  cursor: "pointer", transition: "all 0.15s ease",
                  transform: isSel ? "scale(1.1)" : "scale(1)",
                }}>
                  {coin.label}
                </button>
              );
            })}
          </div>

          {selectedCoins.size > 0 && !makeCorrect && (
            <button onClick={() => setSelectedCoins(new Set())} style={{
              padding: "6px 16px", fontSize: 12, fontWeight: 600,
              border: "1px solid #E5E7EB", borderRadius: 8,
              background: "#fff", color: "#9CA3AF", cursor: "pointer",
            }}>Reset</button>
          )}
        </>
      )}

      {feedback === "correct" && (
        <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: "#22C55E" }}>
          {"\u2705"} {round.type === "count" ? `K${round.total}` : `K${round.target}`} — correct!
        </div>
      )}
      {feedback === "wrong" && round.type === "count" && (
        <div style={{ marginTop: 8, fontSize: 14, color: "#EF4444", fontWeight: 600 }}>
          Not quite — try counting again
        </div>
      )}
    </div>
  );
}
