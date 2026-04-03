/**
 * MathStrandMap — visual progress across all 5 strands.
 *
 * Shows colored progress bars with current skill name.
 * Tap a strand to start a session focused on that strand.
 */
import { STRANDS } from "../data/mathStrands";
import { getStrandProgress } from "../data/mathMastery";

export default function MathStrandMap({ onStartSession, onStartStrand }) {
  const progress = STRANDS.map(s => ({ ...s, ...getStrandProgress(s) }));
  const totalMastered = progress.reduce((s, p) => s + p.mastered, 0);
  const totalSkills = progress.reduce((s, p) => s + p.total, 0);
  const overallPct = Math.round((totalMastered / totalSkills) * 100);

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Overall */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600, marginBottom: 4 }}>
          Overall progress
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#22C55E" }}>{overallPct}%</div>
        <div style={{ fontSize: 12, color: "#D1D5DB" }}>
          {totalMastered} of {totalSkills} skills mastered
        </div>
      </div>

      {/* Start session button */}
      <button onClick={onStartSession} style={{
        width: "100%", padding: "16px", fontSize: 18, fontWeight: 700,
        border: "none", borderRadius: 14,
        background: "#22C55E", color: "#fff", cursor: "pointer",
        boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
        marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {"\u{1F3AF}"} Start Session
      </button>

      {/* Strand cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {progress.map(strand => (
          <button
            key={strand.id}
            onClick={() => onStartStrand(strand.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", borderRadius: 12,
              border: "1px solid #F3F4F6", background: "#fff",
              cursor: "pointer", textAlign: "left",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>{strand.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>
                {strand.name}
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  background: strand.color,
                  width: `${strand.pct}%`,
                  transition: "width 0.5s ease",
                }} />
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>
                {strand.frontierSkill
                  ? `Next: ${strand.frontierSkill.name}`
                  : "\u2705 All mastered!"}
              </div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: strand.color }}>
              {strand.pct}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
