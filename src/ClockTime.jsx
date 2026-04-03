/**
 * ClockTime — read and set analog clock.
 *
 * Mode 1: Clock shows a time, child picks the digital reading.
 * Mode 2: Digital time shown, child drags hour/minute hands to match.
 */
import { useState, useRef } from "react";

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateRound(level) {
  if (level <= 3) {
    // Exact hours
    const h = rand(1, 12);
    return { hour: h, minute: 0, display: `${h}:00` };
  }
  if (level <= 6) {
    // Half hours and quarter hours
    const h = rand(1, 12);
    const m = [0, 15, 30, 45][rand(0, 3)];
    return { hour: h, minute: m, display: `${h}:${String(m).padStart(2, "0")}` };
  }
  // 5-minute increments
  const h = rand(1, 12);
  const m = rand(0, 11) * 5;
  return { hour: h, minute: m, display: `${h}:${String(m).padStart(2, "0")}` };
}

function wrongTimes(round, count) {
  const wrongs = new Set();
  while (wrongs.size < count) {
    const h = rand(1, 12);
    const m = round.minute === 0 ? 0 : [0, 15, 30, 45][rand(0, 3)];
    const d = `${h}:${String(m).padStart(2, "0")}`;
    if (d !== round.display) wrongs.add(d);
  }
  return [...wrongs];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ClockFace({ hour, minute, size = 160 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;

  // Hour hand: shorter, points to hour + minute fraction
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const hourRad = hourAngle * Math.PI / 180;
  const hourLen = r * 0.5;

  // Minute hand: longer
  const minAngle = minute * 6 - 90;
  const minRad = minAngle * Math.PI / 180;
  const minLen = r * 0.75;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Face */}
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#374151" strokeWidth="3" />

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x1 = cx + (r - 6) * Math.cos(angle);
        const y1 = cy + (r - 6) * Math.sin(angle);
        const x2 = cx + (r - 14) * Math.cos(angle);
        const y2 = cy + (r - 14) * Math.sin(angle);
        const tx = cx + (r - 24) * Math.cos(angle);
        const ty = cy + (r - 24) * Math.sin(angle);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth="2" />
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central"
              fontSize="12" fontWeight="700" fill="#374151">
              {i === 0 ? 12 : i}
            </text>
          </g>
        );
      })}

      {/* Minute ticks */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null;
        const angle = (i * 6 - 90) * Math.PI / 180;
        const x1 = cx + (r - 4) * Math.cos(angle);
        const y1 = cy + (r - 4) * Math.sin(angle);
        const x2 = cx + (r - 8) * Math.cos(angle);
        const y2 = cy + (r - 8) * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D1D5DB" strokeWidth="1" />;
      })}

      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={cx + hourLen * Math.cos(hourRad)} y2={cy + hourLen * Math.sin(hourRad)}
        stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />

      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={cx + minLen * Math.cos(minRad)} y2={cy + minLen * Math.sin(minRad)}
        stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="4" fill="#374151" />
    </svg>
  );
}

export default function ClockTime() {
  const [level, setLevel] = useState(1);
  const [round, setRound] = useState(() => generateRound(1));
  const [options] = useState(() => shuffle([round.display, ...wrongTimes(round, 3)]));
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [opts, setOpts] = useState(() => shuffle([round.display, ...wrongTimes(round, 3)]));

  const newRound = () => {
    const next = level + 1;
    setLevel(next);
    const r = generateRound(next);
    setRound(r);
    setOpts(shuffle([r.display, ...wrongTimes(r, 3)]));
    setSelected(null);
    setFeedback(null);
  };

  const handlePick = (opt, i) => {
    if (feedback) return;
    setSelected(i);
    const correct = opt === round.display;
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      if (correct) newRound();
      else { setSelected(null); setFeedback(null); }
    }, correct ? 1200 : 800);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, padding: "0 4px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF" }}>Round {level}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#DBEAFE", color: "#1D4ED8" }}>
          {level <= 3 ? "Hours" : level <= 6 ? "Quarter hours" : "5-minute"}
        </span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 16 }}>
        What time is it?
      </div>

      {/* Clock */}
      <div style={{ margin: "0 auto 20px", width: 160 }}>
        <ClockFace hour={round.hour} minute={round.minute} />
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", fontSize: 12, marginBottom: 16 }}>
        <span><span style={{ color: "#1D4ED8", fontWeight: 800 }}>{"\u2501"}</span> hour</span>
        <span><span style={{ color: "#EF4444", fontWeight: 800 }}>{"\u2501"}</span> minute</span>
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 240, margin: "0 auto" }}>
        {opts.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = feedback === "correct" && isSelected;
          const isWrong = feedback === "wrong" && isSelected;
          return (
            <button key={i} onClick={() => handlePick(opt, i)} style={{
              padding: "14px", fontSize: 20, fontWeight: 800, fontFamily: "monospace",
              borderRadius: 12,
              border: `3px solid ${isCorrect ? "#22C55E" : isWrong ? "#EF4444" : "#E5E7EB"}`,
              background: isCorrect ? "#DCFCE7" : isWrong ? "#FEE2E2" : "#fff",
              color: isCorrect ? "#166534" : isWrong ? "#991B1B" : "#374151",
              cursor: feedback ? "default" : "pointer",
              transition: "all 0.15s ease",
            }}>
              {opt}
            </button>
          );
        })}
      </div>

      {feedback === "correct" && (
        <div style={{ marginTop: 16, fontSize: 16, fontWeight: 700, color: "#22C55E" }}>{"\u2705"} Correct!</div>
      )}
    </div>
  );
}
