/**
 * PasaMaths — main orchestrator for the maths course.
 *
 * State machine: map → session (activities) → complete → map
 * First visit: placement → map
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { STRANDS, STRAND_MAP } from "../data/mathStrands";
import { planSession } from "../data/mathSessionPlanner";
import { recordResult, getMastery, setPlacement, loadFromSupabase } from "../data/mathMastery";
import { generatePlacement, processPlacement } from "../data/mathPlacement";
import { generateActivity } from "../data/mathSkillGenerator";
import MathStrandMap from "./MathStrandMap";
import MathSessionComplete from "./MathSessionComplete";

// Import all activities
import TensFrame from "../TensFrame";
import NumberLine from "../NumberLine";
import CoinMaker from "../CoinMaker";
import BalanceScale from "../BalanceScale";
import SkipCount from "../SkipCount";
import FairShare from "../FairShare";
import FractionFactory from "../FractionFactory";
import ShapeExplorer from "../ShapeExplorer";
import MirrorReflection from "../MirrorReflection";
import AreaPerimeter from "../AreaPerimeter";
import MeasureUp from "../MeasureUp";
import ClockTime from "../ClockTime";
import KwachaMoney from "../KwachaMoney";
import PatternSequence from "../PatternSequence";
import OddOneOut from "../OddOneOut";

const ACTIVITY_COMPONENTS = {
  tensFrame: TensFrame,
  numberLine: NumberLine,
  coinMaker: CoinMaker,
  balanceScale: BalanceScale,
  skipCount: SkipCount,
  fairShare: FairShare,
  fractionFactory: FractionFactory,
  shapeExplorer: ShapeExplorer,
  mirrorReflection: MirrorReflection,
  areaPerimeter: AreaPerimeter,
  measureUp: MeasureUp,
  clockTime: ClockTime,
  kwachaMoney: KwachaMoney,
  patternSequence: PatternSequence,
  oddOneOut: OddOneOut,
};

export default function PasaMaths({ onExit }) {
  const [loaded, setLoaded] = useState(false);

  // On mount: load math mastery from Supabase learner profile
  useEffect(() => {
    try {
      const learner = JSON.parse(localStorage.getItem("pasa_current_learner") || "null");
      if (learner?.math_mastery) {
        loadFromSupabase(learner.math_mastery);
      }
    } catch {}
    setLoaded(true);
  }, []);

  const hasPlaced = Object.keys(getMastery()).length > 0;
  const [screen, setScreen] = useState(hasPlaced ? "map" : "placement");
  const [session, setSession] = useState([]);
  const [activityIndex, setActivityIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({ total: 0, correct: 0, newMastered: 0, strandsWorked: [] });

  // Placement state
  const [placementQs, setPlacementQs] = useState(() => generatePlacement());
  const [placementIdx, setPlacementIdx] = useState(0);
  const [placementResults, setPlacementResults] = useState([]);

  // ── Placement ──

  const handlePlacementAnswer = useCallback(({ correct }) => {
    const q = placementQs[placementIdx];
    const result = { strandId: q.strandId, skillIndex: q.skillIndex, correct };
    const newResults = [...placementResults, result];
    setPlacementResults(newResults);

    const nextIdx = placementIdx + 1;
    if (nextIdx >= placementQs.length) {
      // All done — process placement
      const placements = processPlacement(newResults);
      for (const strand of STRANDS) {
        const level = placements[strand.id] || 0;
        if (level > 0) setPlacement(strand, level);
      }
      setScreen("map");
    } else {
      setPlacementIdx(nextIdx);
    }
  }, [placementIdx, placementQs, placementResults]);

  // ── Session ──

  const startSession = useCallback(() => {
    const items = planSession(10);
    setSession(items);
    setActivityIndex(0);
    setSessionStats({ total: 0, correct: 0, newMastered: 0, strandsWorked: [] });
    setScreen("session");
  }, []);

  const startStrandSession = useCallback((strandId) => {
    // Generate a focused session for one strand
    const strand = STRAND_MAP[strandId];
    if (!strand) return;
    const items = [];
    for (let i = 0; i < 8; i++) {
      // Pick frontier or random skill from this strand
      const skills = strand.skills;
      const skill = skills[Math.floor(Math.random() * skills.length)];
      const { activity, props } = generateActivity(skill);
      items.push({ skill, activity, props, type: "strand" });
    }
    setSession(items);
    setActivityIndex(0);
    setSessionStats({ total: 0, correct: 0, newMastered: 0, strandsWorked: [strand.name] });
    setScreen("session");
  }, []);

  const handleActivityComplete = useCallback(({ correct }) => {
    const item = session[activityIndex];
    if (!item) return;

    // Record result
    const result = recordResult(item.skill.id, correct);

    setSessionStats(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (correct ? 1 : 0),
      newMastered: prev.newMastered + (result.justMastered ? 1 : 0),
      strandsWorked: [...new Set([...prev.strandsWorked, STRAND_MAP[item.skill.strandId || ""]?.name || item.skill.name])],
    }));

    const nextIdx = activityIndex + 1;
    if (nextIdx >= session.length) {
      setScreen("complete");
    } else {
      setActivityIndex(nextIdx);
    }
  }, [activityIndex, session]);

  // ── Render ──

  if (!loaded) return null;

  if (screen === "placement") {
    const q = placementQs[placementIdx];
    const Component = ACTIVITY_COMPONENTS[q.activity];

    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#F9FAFB" }}>
        {/* Header */}
        <div style={{
          padding: "12px 16px", background: "#fff", borderBottom: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>Placement Check</div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>
              {placementIdx + 1} of {placementQs.length} — {q.strandName}
            </div>
          </div>
          <span style={{ fontSize: 20 }}>{q.strandEmoji}</span>
        </div>
        {/* Progress */}
        <div style={{ height: 4, background: "#E5E7EB" }}>
          <div style={{
            height: "100%", background: q.strandColor,
            width: `${((placementIdx + 1) / placementQs.length) * 100}%`,
            transition: "width 0.3s ease",
          }} />
        </div>
        {/* Activity */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
          {Component ? <Component key={`placement-${placementIdx}`} onComplete={handlePlacementAnswer} /> : <div>Unknown activity: {q.activity}</div>}
        </div>
      </div>
    );
  }

  if (screen === "map") {
    return (
      <div style={{ minHeight: "100dvh", background: "#F9FAFB" }}>
        <div style={{
          padding: "16px 20px", background: "#fff", borderBottom: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>Pasa Maths</span>
          {onExit && (
            <button onClick={onExit} style={{
              border: "1px solid #E5E7EB", background: "#fff", borderRadius: 20,
              padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#9CA3AF", cursor: "pointer",
            }}>Back</button>
          )}
        </div>
        <div style={{ padding: "0 20px", maxWidth: 480, margin: "0 auto" }}>
          <MathStrandMap onStartSession={startSession} onStartStrand={startStrandSession} />
        </div>
      </div>
    );
  }

  if (screen === "session") {
    const item = session[activityIndex];
    if (!item) { setScreen("complete"); return null; }

    const Component = ACTIVITY_COMPONENTS[item.activity];
    const strandInfo = STRAND_MAP[item.skill.strandId || ""];

    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#F9FAFB" }}>
        {/* Header */}
        <div style={{
          padding: "10px 16px", background: "#fff", borderBottom: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button onClick={() => setScreen("map")} style={{
            border: "none", background: "none", fontSize: 20, color: "#9CA3AF", cursor: "pointer", padding: "4px 8px",
          }}>{"\u2190"}</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>{item.skill.name}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#22C55E" }}>
            {activityIndex + 1}/{session.length}
          </div>
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 3, padding: "6px 16px", justifyContent: "center" }}>
          {session.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i < activityIndex ? "#22C55E" : i === activityIndex ? (strandInfo?.color || "#3B82F6") : "#E5E7EB",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
        {/* Activity */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
          {Component
            ? <Component key={`${item.skill.id}-${activityIndex}`} onComplete={handleActivityComplete} />
            : <div>Unknown activity: {item.activity}</div>
          }
        </div>
      </div>
    );
  }

  if (screen === "complete") {
    return (
      <MathSessionComplete
        stats={sessionStats}
        onContinue={startSession}
        onBack={() => setScreen("map")}
      />
    );
  }

  return null;
}
