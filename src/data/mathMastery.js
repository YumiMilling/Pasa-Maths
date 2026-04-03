/**
 * Mastery Model — tracks per-skill progress.
 *
 * Each skill has:
 *   - streak: consecutive correct (3 = mastered)
 *   - attempts: last 10 results
 *   - masteredAt: timestamp when mastered (null if not)
 *   - level: current skill index per strand
 */

const STORAGE_KEY = "pasa_math_mastery";
const MASTERY_STREAK = 3;  // correct in a row to master

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch { return {}; }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getMastery() {
  return load();
}

export function getSkillState(skillId) {
  const state = load();
  return state[skillId] || { streak: 0, attempts: [], masteredAt: null };
}

export function isMastered(skillId) {
  return !!getSkillState(skillId).masteredAt;
}

/**
 * Record a result for a skill.
 * Returns { mastered, streak, justMastered, droppedBack }
 */
export function recordResult(skillId, correct) {
  const state = load();
  const skill = state[skillId] || { streak: 0, attempts: [], masteredAt: null };

  // Update attempts (keep last 10)
  skill.attempts = [...skill.attempts.slice(-9), correct ? 1 : 0];

  if (correct) {
    skill.streak = (skill.streak || 0) + 1;
  } else {
    skill.streak = 0;
  }

  let justMastered = false;
  let droppedBack = false;

  // Mastery: 3 correct in a row
  if (skill.streak >= MASTERY_STREAK && !skill.masteredAt) {
    skill.masteredAt = Date.now();
    justMastered = true;
  }

  // Drop back: 2 wrong in a row on a non-mastered skill
  const lastTwo = skill.attempts.slice(-2);
  if (lastTwo.length === 2 && lastTwo[0] === 0 && lastTwo[1] === 0 && !skill.masteredAt) {
    droppedBack = true;
  }

  state[skillId] = skill;
  save(state);

  return {
    mastered: !!skill.masteredAt,
    streak: skill.streak,
    justMastered,
    droppedBack,
    accuracy: skill.attempts.length > 0
      ? Math.round(skill.attempts.reduce((a, b) => a + b, 0) / skill.attempts.length * 100)
      : 0,
  };
}

/**
 * Get the current frontier skill for a strand.
 * Returns the first non-mastered skill, or null if all mastered.
 */
export function getFrontierSkill(strand) {
  const state = load();
  for (const skill of strand.skills) {
    const s = state[skill.id];
    if (!s || !s.masteredAt) return skill;
  }
  return null; // all mastered
}

/**
 * Get recently mastered skills (for spaced review).
 */
export function getRecentlyMastered(strands, withinDays = 7) {
  const state = load();
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  const recent = [];
  for (const strand of strands) {
    for (const skill of strand.skills) {
      const s = state[skill.id];
      if (s && s.masteredAt && s.masteredAt > cutoff) {
        recent.push({ ...skill, strandId: strand.id });
      }
    }
  }
  return recent;
}

/**
 * Get older mastered skills (for spaced review).
 */
export function getOlderMastered(strands, olderThanDays = 7) {
  const state = load();
  const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  const older = [];
  for (const strand of strands) {
    for (const skill of strand.skills) {
      const s = state[skill.id];
      if (s && s.masteredAt && s.masteredAt < cutoff) {
        older.push({ ...skill, strandId: strand.id });
      }
    }
  }
  return older;
}

/**
 * Get strand progress: { total, mastered, pct, frontierSkill }
 */
export function getStrandProgress(strand) {
  const state = load();
  let mastered = 0;
  let frontierSkill = null;
  for (const skill of strand.skills) {
    const s = state[skill.id];
    if (s && s.masteredAt) {
      mastered++;
    } else if (!frontierSkill) {
      frontierSkill = skill;
    }
  }
  return {
    total: strand.skills.length,
    mastered,
    pct: Math.round((mastered / strand.skills.length) * 100),
    frontierSkill,
  };
}

/**
 * Set placement result — mark skills as mastered up to a level.
 */
export function setPlacement(strand, upToIndex) {
  const state = load();
  for (let i = 0; i < upToIndex && i < strand.skills.length; i++) {
    const id = strand.skills[i].id;
    if (!state[id] || !state[id].masteredAt) {
      state[id] = { streak: MASTERY_STREAK, attempts: [1, 1, 1], masteredAt: Date.now() };
    }
  }
  save(state);
}

export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
}
