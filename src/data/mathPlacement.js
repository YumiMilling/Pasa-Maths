/**
 * Placement Check — 3 diagnostic questions per strand.
 *
 * Each question probes a different difficulty level (early, mid, late).
 * Correct answer → child placed above that level.
 * Wrong answer → stop and place at that level.
 *
 * Total: 15 questions across 5 strands (~3-5 minutes).
 */

import { STRANDS } from "./mathStrands";
import { generateActivity } from "./mathSkillGenerator";

/**
 * Generate placement questions for all strands.
 * Returns array of { strand, skill, activity, props, probeLevel }
 */
export function generatePlacement() {
  const questions = [];

  for (const strand of STRANDS) {
    const skillCount = strand.skills.length;
    // Probe at 3 levels: 25%, 50%, 75% of strand
    const probeIndices = [
      Math.floor(skillCount * 0.25),
      Math.floor(skillCount * 0.50),
      Math.floor(skillCount * 0.75),
    ];

    for (const idx of probeIndices) {
      const skill = strand.skills[Math.min(idx, skillCount - 1)];
      const { activity, props } = generateActivity(skill);
      questions.push({
        strandId: strand.id,
        strandName: strand.name,
        strandEmoji: strand.emoji,
        strandColor: strand.color,
        skill,
        skillIndex: idx,
        activity,
        props,
      });
    }
  }

  return questions;
}

/**
 * Process placement results.
 * Returns per-strand placement level (index to start from).
 *
 * Logic per strand (3 questions, from easy to hard):
 *   - All 3 correct → start at 75% of strand
 *   - First 2 correct, last wrong → start at 50%
 *   - First correct, second wrong → start at 25%
 *   - First wrong → start at beginning
 */
export function processPlacement(results) {
  // results is array of { strandId, skillIndex, correct }
  const byStrand = {};
  for (const r of results) {
    if (!byStrand[r.strandId]) byStrand[r.strandId] = [];
    byStrand[r.strandId].push(r);
  }

  const placements = {};

  for (const strand of STRANDS) {
    const strandResults = byStrand[strand.id] || [];
    // Sort by skillIndex (easy to hard)
    strandResults.sort((a, b) => a.skillIndex - b.skillIndex);

    let placementLevel = 0;
    for (const r of strandResults) {
      if (r.correct) {
        placementLevel = r.skillIndex;
      } else {
        break; // stop at first wrong answer
      }
    }

    placements[strand.id] = placementLevel;
  }

  return placements;
}
