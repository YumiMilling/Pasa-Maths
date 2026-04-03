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

  // 1. Frontier items — focus on 2-3 skills so mastery (3 in a row) is achievable
  const strandsByProgress = STRANDS
    .map(s => ({ strand: s, ...getStrandProgress(s) }))
    .filter(s => s.frontierSkill)
    .sort((a, b) => a.pct - b.pct); // weakest first

  // Pick 2 focus skills from weakest strands, give each 3 attempts
  const focusSkills = [];
  for (let i = 0; i < Math.min(2, strandsByProgress.length); i++) {
    focusSkills.push(strandsByProgress[i].frontierSkill);
  }

  for (const skill of focusSkills) {
    // 3 attempts per focus skill — enough to master if all correct
    for (let rep = 0; rep < 3 && items.length < frontierCount; rep++) {
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

  // Interleave: spread same-skill items apart so it's not A,A,A,B,B,B
  // but A,B,review,A,B,review,A,B,review...
  const interleaved = [];
  const buckets = {};
  for (const item of items) {
    const key = item.skill.id;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(item);
  }
  const keys = Object.keys(buckets);
  let maxLen = Math.max(...keys.map(k => buckets[k].length));
  for (let round = 0; round < maxLen; round++) {
    for (const key of keys) {
      if (round < buckets[key].length) {
        interleaved.push(buckets[key][round]);
      }
    }
  }
  items.length = 0;
  items.push(...interleaved);

  // Light shuffle: swap adjacent pairs occasionally for variety
  for (let i = 0; i < items.length - 1; i++) {
    if (Math.random() > 0.7) {
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
