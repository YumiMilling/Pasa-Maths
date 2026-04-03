/**
 * Session Planner — picks the next 10-12 activities for a session.
 *
 * 60% frontier (new skills from weakest strand)
 * 20% recent review (mastered in last 7 days)
 * 20% spaced review (older mastered skills)
 *
 * Interleaves strands naturally.
 */

import { STRANDS } from "./mathStrands";
import { generateActivity } from "./mathSkillGenerator";
import {
  getFrontierSkill,
  getStrandProgress,
  getRecentlyMastered,
  getOlderMastered,
} from "./mathMastery";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Plan a session of activities.
 * Returns array of { skill, activity, props }
 */
export function planSession(sessionSize = 10) {
  const frontierCount = Math.ceil(sessionSize * 0.6);   // 6
  const recentCount = Math.ceil(sessionSize * 0.2);      // 2
  const spacedCount = sessionSize - frontierCount - recentCount; // 2

  const items = [];

  // 1. Frontier items — from weakest strands
  const strandsByProgress = STRANDS
    .map(s => ({ strand: s, ...getStrandProgress(s) }))
    .filter(s => s.frontierSkill) // has unmastered skills
    .sort((a, b) => a.pct - b.pct); // weakest first

  for (let i = 0; i < frontierCount; i++) {
    if (strandsByProgress.length === 0) break;
    // Round-robin through weakest strands
    const entry = strandsByProgress[i % strandsByProgress.length];
    const skill = entry.frontierSkill;
    if (skill) {
      const { activity, props } = generateActivity(skill);
      items.push({ skill, activity, props, type: "frontier" });
    }
  }

  // 2. Recent review — skills mastered in last 7 days
  const recent = shuffle(getRecentlyMastered(STRANDS, 7));
  for (let i = 0; i < recentCount && i < recent.length; i++) {
    const skill = recent[i];
    const { activity, props } = generateActivity(skill);
    items.push({ skill, activity, props, type: "recent" });
  }

  // 3. Spaced review — older mastered skills
  const older = shuffle(getOlderMastered(STRANDS, 7));
  for (let i = 0; i < spacedCount && i < older.length; i++) {
    const skill = older[i];
    const { activity, props } = generateActivity(skill);
    items.push({ skill, activity, props, type: "spaced" });
  }

  // If we don't have enough review items, fill with more frontier
  while (items.length < sessionSize && strandsByProgress.length > 0) {
    const entry = pick(strandsByProgress);
    if (entry.frontierSkill) {
      const { activity, props } = generateActivity(entry.frontierSkill);
      items.push({ skill: entry.frontierSkill, activity, props, type: "frontier" });
    } else {
      break;
    }
  }

  // Shuffle to interleave (but keep general order — frontier first, review mixed in)
  // Light shuffle: swap adjacent pairs randomly
  for (let i = 0; i < items.length - 1; i++) {
    if (Math.random() > 0.6) {
      [items[i], items[i + 1]] = [items[i + 1], items[i]];
    }
  }

  return items;
}

/**
 * Get overall progress across all strands.
 */
export function getOverallProgress() {
  return STRANDS.map(s => ({
    ...s,
    ...getStrandProgress(s),
  }));
}
