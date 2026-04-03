/**
 * DevSkillMap — visual overview of all strands and skills.
 */
import { STRANDS, TOTAL_SKILLS } from "./data/mathStrands";

export default function DevSkillMap() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Pasa Maths — Skill Map</h1>
      <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>
        {TOTAL_SKILLS} skills across {STRANDS.length} strands. Gr 1 ≈ levels 1-8, Gr 2 ≈ 9-16, Gr 3 ≈ 17-24, Gr 4 ≈ 25+
      </p>

      {STRANDS.map(strand => (
        <div key={strand.id} style={{ marginBottom: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
            padding: "10px 14px", borderRadius: 10,
            background: `${strand.color}15`, border: `2px solid ${strand.color}40`,
          }}>
            <span style={{ fontSize: 24 }}>{strand.emoji}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: strand.color }}>{strand.name}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{strand.skills.length} skills</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 8 }}>
            {strand.skills.map((skill, i) => {
              // Color-code by approximate grade
              const grade = i < 8 ? 1 : i < 16 ? 2 : i < 24 ? 3 : 4;
              const gradeColor = { 1: "#22C55E", 2: "#3B82F6", 3: "#F59E0B", 4: "#EF4444" }[grade];
              const gradeBg = { 1: "#F0FDF4", 2: "#EFF6FF", 3: "#FFFBEB", 4: "#FEF2F2" }[grade];

              return (
                <div key={skill.id} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px", borderRadius: 6,
                  background: gradeBg,
                  fontSize: 13,
                }}>
                  <span style={{
                    width: 28, fontSize: 11, fontWeight: 800, color: gradeColor,
                    textAlign: "center",
                  }}>
                    {i + 1}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#fff", padding: "2px 6px",
                    borderRadius: 4, background: gradeColor, flexShrink: 0,
                  }}>
                    Gr{grade}
                  </span>
                  <span style={{ fontWeight: 600, color: "#374151", flex: 1 }}>
                    {skill.name}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: "#9CA3AF",
                    padding: "2px 6px", borderRadius: 4, background: "#F3F4F6",
                  }}>
                    {skill.activities
                      ? skill.activities.map(a => a.activity).join(" / ")
                      : skill.activity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
