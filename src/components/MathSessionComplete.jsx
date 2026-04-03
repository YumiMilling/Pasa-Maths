/**
 * MathSessionComplete — celebration after finishing a session.
 */

export default function MathSessionComplete({ stats, onContinue, onBack }) {
  const { total, correct, newMastered, strandsWorked } = stats;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#F9FAFB", padding: "24px 20px", gap: 16,
    }}>
      {/* Stars */}
      <div style={{ display: "flex", gap: 8, fontSize: 40 }}>
        {[1, 2, 3].map(i => (
          <span key={i} style={{ opacity: i <= stars ? 1 : 0.2, transition: "opacity 0.4s ease" }}>
            {"\u2B50"}
          </span>
        ))}
      </div>

      <div style={{ fontSize: 24, fontWeight: 800, color: "#22C55E" }}>
        {pct >= 90 ? "Amazing!" : pct >= 60 ? "Well done!" : "Good effort!"}
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
        width: "100%", maxWidth: 260,
      }}>
        <div style={{
          padding: 14, borderRadius: 12, background: "#fff",
          border: "1px solid #E5E7EB", textAlign: "center",
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#22C55E" }}>{correct}/{total}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>correct</div>
        </div>
        <div style={{
          padding: 14, borderRadius: 12, background: "#fff",
          border: "1px solid #E5E7EB", textAlign: "center",
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#3B82F6" }}>{newMastered}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>skills mastered</div>
        </div>
      </div>

      {strandsWorked && strandsWorked.length > 0 && (
        <div style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
          Practised: {strandsWorked.join(", ")}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 260, marginTop: 8 }}>
        <button onClick={onContinue} style={{
          padding: "14px", fontSize: 17, fontWeight: 700,
          border: "none", borderRadius: 12,
          background: "#22C55E", color: "#fff", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
        }}>
          Another session
        </button>
        <button onClick={onBack} style={{
          padding: "12px", fontSize: 15, fontWeight: 600,
          border: "2px solid #E5E7EB", borderRadius: 12,
          background: "#fff", color: "#6B7280", cursor: "pointer",
        }}>
          Back to map
        </button>
      </div>
    </div>
  );
}
