/**
 * Maths Curriculum — Strand-Based Skill Map
 *
 * 5 strands, each with micro-skills ordered by difficulty.
 * Every skill maps to an activity type and has parameters
 * that the skill generator uses to create specific problems.
 *
 * Aligned to Zambian primary curriculum (Gr 1-6, old Gr 1-7).
 * Difficulty roughly maps: levels 1-8 = Gr1, 9-16 = Gr2, 17-24 = Gr3, 25+ = Gr4
 */

// Activity types available
// tensFrame, numberLine, coinMaker, balanceScale, skipCount,
// fairShare, fractionFactory, shapeExplorer, mirrorReflection,
// areaPerimeter, measureUp, clockTime, kwachaMoney,
// patternSequence, oddOneOut

export const STRANDS = [
  {
    id: "number",
    name: "Number Sense",
    color: "#22C55E",
    emoji: "\u{1F7E2}",
    skills: [
      // Gr 1 — Counting & recognition
      { id: "n01", name: "Count to 5", activity: "tensFrame", params: { max: 5 } },
      { id: "n02", name: "Count to 10", activity: "tensFrame", params: { max: 10 } },
      { id: "n03", name: "Place numbers to 5", activity: "numberLine", params: { max: 5 } },
      { id: "n04", name: "Place numbers to 10", activity: "numberLine", params: { max: 10 } },
      { id: "n05", name: "Compare: more or less (to 10)", activity: "numberLine", params: { max: 10, mode: "compare" } },
      { id: "n06", name: "Order numbers to 10", activity: "numberLine", params: { max: 10, mode: "order" } },
      { id: "n07", name: "Count to 20", activity: "tensFrame", params: { max: 20 } },
      { id: "n08", name: "Place numbers to 20", activity: "numberLine", params: { max: 20 } },

      // Gr 2 — Place value
      { id: "n09", name: "Tens and ones (to 50)", activity: "coinMaker", params: { max: 50 } },
      { id: "n10", name: "Place numbers to 50", activity: "numberLine", params: { max: 50 } },
      { id: "n11", name: "Tens and ones (to 100)", activity: "coinMaker", params: { max: 100 } },
      { id: "n12", name: "Place numbers to 100", activity: "numberLine", params: { max: 100 } },
      { id: "n13", name: "Compare numbers to 100", activity: "numberLine", params: { max: 100, mode: "compare" } },
      { id: "n14", name: "Even and odd", activity: "oddOneOut", params: { mode: "evenOdd", max: 20 } },

      // Gr 3 — Larger numbers
      { id: "n15", name: "Hundreds, tens, ones (to 500)", activity: "coinMaker", params: { max: 500 } },
      { id: "n16", name: "Place numbers to 500", activity: "numberLine", params: { max: 500 } },
      { id: "n17", name: "Hundreds, tens, ones (to 1000)", activity: "coinMaker", params: { max: 1000 } },
      { id: "n18", name: "Compare numbers to 1000", activity: "numberLine", params: { max: 1000, mode: "compare" } },
      { id: "n19", name: "Round to nearest 10", activity: "numberLine", params: { max: 100, mode: "round10" } },
      { id: "n20", name: "Round to nearest 100", activity: "numberLine", params: { max: 1000, mode: "round100" } },

      // Gr 4 — Thousands
      { id: "n21", name: "Thousands (to 5000)", activity: "coinMaker", params: { max: 5000 } },
      { id: "n22", name: "Thousands (to 10000)", activity: "coinMaker", params: { max: 10000 } },
      { id: "n23", name: "Compare numbers to 10000", activity: "numberLine", params: { max: 10000, mode: "compare" } },
      { id: "n24", name: "Order large numbers", activity: "numberLine", params: { max: 10000, mode: "order" } },
    ],
  },

  {
    id: "operations",
    name: "Operations",
    color: "#3B82F6",
    emoji: "\u2796",
    skills: [
      // Gr 1 — Addition & subtraction basics
      { id: "o01", name: "Add within 5", activity: "balanceScale", params: { max: 5, op: "add" } },
      { id: "o02", name: "Add within 10", activity: "balanceScale", params: { max: 10, op: "add" } },
      { id: "o03", name: "Subtract within 5", activity: "balanceScale", params: { max: 5, op: "subtract" } },
      { id: "o04", name: "Subtract within 10", activity: "balanceScale", params: { max: 10, op: "subtract" } },
      { id: "o05", name: "Number bonds to 5", activity: "balanceScale", params: { max: 5, op: "bonds" } },
      { id: "o06", name: "Number bonds to 10", activity: "balanceScale", params: { max: 10, op: "bonds" } },
      { id: "o07", name: "Add within 20", activity: "balanceScale", params: { max: 20, op: "add" } },
      { id: "o08", name: "Subtract within 20", activity: "balanceScale", params: { max: 20, op: "subtract" } },

      // Gr 2 — Two-digit, intro multiplication
      { id: "o09", name: "Add within 100 (no carry)", activity: "balanceScale", params: { max: 100, op: "add", noCarry: true } },
      { id: "o10", name: "Subtract within 100 (no borrow)", activity: "balanceScale", params: { max: 100, op: "subtract", noBorrow: true } },
      { id: "o11", name: "Add within 100 (with carry)", activity: "balanceScale", params: { max: 100, op: "add" } },
      { id: "o12", name: "Subtract within 100 (with borrow)", activity: "balanceScale", params: { max: 100, op: "subtract" } },
      { id: "o13", name: "Skip count by 2", activity: "skipCount", params: { hop: 2, maxTarget: 20 } },
      { id: "o14", name: "Skip count by 5", activity: "skipCount", params: { hop: 5, maxTarget: 50 } },
      { id: "o15", name: "Skip count by 10", activity: "skipCount", params: { hop: 10, maxTarget: 100 } },
      { id: "o16", name: "Multiply by 2 (groups)", activity: "fairShare", params: { mode: "multiply", factor: 2 } },

      // Gr 3 — Times tables, division
      { id: "o17", name: "Times table: 2", activity: "skipCount", params: { hop: 2, maxTarget: 24 } },
      { id: "o18", name: "Times table: 3", activity: "skipCount", params: { hop: 3, maxTarget: 30 } },
      { id: "o19", name: "Times table: 4", activity: "skipCount", params: { hop: 4, maxTarget: 40 } },
      { id: "o20", name: "Times table: 5", activity: "skipCount", params: { hop: 5, maxTarget: 50 } },
      { id: "o21", name: "Times table: 10", activity: "skipCount", params: { hop: 10, maxTarget: 100 } },
      { id: "o22", name: "Divide by 2 (sharing)", activity: "fairShare", params: { divisor: 2, maxTotal: 20 } },
      { id: "o23", name: "Divide by 3 (sharing)", activity: "fairShare", params: { divisor: 3, maxTotal: 18 } },
      { id: "o24", name: "Divide by 5 (sharing)", activity: "fairShare", params: { divisor: 5, maxTotal: 25 } },
      { id: "o25", name: "Divide with remainder", activity: "fairShare", params: { divisor: 3, maxTotal: 20, withRemainder: true } },

      // Gr 3-4 — Fractions
      { id: "o26", name: "Fractions: halves", activity: "fractionFactory", params: { denoms: [2] } },
      { id: "o27", name: "Fractions: quarters", activity: "fractionFactory", params: { denoms: [4] } },
      { id: "o28", name: "Fractions: thirds", activity: "fractionFactory", params: { denoms: [3] } },
      { id: "o29", name: "Fractions: mixed", activity: "fractionFactory", params: { denoms: [2, 3, 4, 5] } },
      { id: "o30", name: "Fractions: sixths and eighths", activity: "fractionFactory", params: { denoms: [3, 4, 6, 8] } },

      // Gr 4 — Larger operations
      { id: "o31", name: "Add within 1000", activity: "balanceScale", params: { max: 1000, op: "add" } },
      { id: "o32", name: "Subtract within 1000", activity: "balanceScale", params: { max: 1000, op: "subtract" } },
      { id: "o33", name: "Times table: 6", activity: "skipCount", params: { hop: 6, maxTarget: 60 } },
      { id: "o34", name: "Times table: 7", activity: "skipCount", params: { hop: 7, maxTarget: 70 } },
      { id: "o35", name: "Times table: 8", activity: "skipCount", params: { hop: 8, maxTarget: 80 } },
      { id: "o36", name: "Times table: 9", activity: "skipCount", params: { hop: 9, maxTarget: 90 } },
    ],
  },

  {
    id: "shape",
    name: "Shape & Space",
    color: "#F59E0B",
    emoji: "\u{1F534}",
    skills: [
      // Gr 1 — Basic shapes
      { id: "s01", name: "Name: circle, square, triangle", activity: "shapeExplorer", params: { shapes: ["circle", "square", "triangle"] } },
      { id: "s02", name: "Name: rectangle, diamond", activity: "shapeExplorer", params: { shapes: ["circle", "square", "triangle", "rectangle", "diamond"] } },
      { id: "s03", name: "Sort shapes", activity: "oddOneOut", params: { mode: "shapes" } },

      // Gr 2 — Properties
      { id: "s04", name: "Count sides (3-4)", activity: "shapeExplorer", params: { mode: "sides", shapes: ["triangle", "square", "rectangle"] } },
      { id: "s05", name: "Count sides (5-6)", activity: "shapeExplorer", params: { mode: "sides", shapes: ["triangle", "square", "pentagon", "hexagon"] } },
      { id: "s06", name: "Symmetry basics", activity: "mirrorReflection", params: { grid: 3 } },

      // Gr 3 — Reflection, perimeter
      { id: "s07", name: "Mirror image (3x3)", activity: "mirrorReflection", params: { grid: 3 } },
      { id: "s08", name: "Mirror image (4x4)", activity: "mirrorReflection", params: { grid: 4 } },
      { id: "s09", name: "Perimeter of rectangles", activity: "areaPerimeter", params: { mode: "perimeter", shapeType: "rectangle" } },
      { id: "s10", name: "Area of rectangles", activity: "areaPerimeter", params: { mode: "area", shapeType: "rectangle" } },

      // Gr 4 — Complex shapes
      { id: "s11", name: "Mirror image (5x5)", activity: "mirrorReflection", params: { grid: 5 } },
      { id: "s12", name: "Area of L-shapes", activity: "areaPerimeter", params: { mode: "area", shapeType: "L" } },
      { id: "s13", name: "Perimeter of complex shapes", activity: "areaPerimeter", params: { mode: "perimeter", shapeType: "complex" } },
      { id: "s14", name: "All shapes: name + properties", activity: "shapeExplorer", params: { shapes: "all", mode: "mixed" } },
    ],
  },

  {
    id: "measure",
    name: "Measurement",
    color: "#8B5CF6",
    emoji: "\u{1F4CF}",
    skills: [
      // Gr 1 — Comparison
      { id: "m01", name: "Compare lengths (short bars)", activity: "measureUp", params: { maxUnits: 6, mode: "compare" } },
      { id: "m02", name: "Measure in blocks (to 6)", activity: "measureUp", params: { maxUnits: 6, mode: "measure" } },

      // Gr 2 — Standard units, time, money
      { id: "m03", name: "Measure in units (to 10)", activity: "measureUp", params: { maxUnits: 10, mode: "measure" } },
      { id: "m04", name: "Compare lengths (longer bars)", activity: "measureUp", params: { maxUnits: 10, mode: "compare" } },
      { id: "m05", name: "Clock: read hours", activity: "clockTime", params: { mode: "hours" } },
      { id: "m06", name: "Clock: half past", activity: "clockTime", params: { mode: "halfHour" } },
      { id: "m07", name: "Count Kwacha coins", activity: "kwachaMoney", params: { mode: "count", coins: "simple" } },

      // Gr 3 — More precise
      { id: "m08", name: "Clock: quarter hours", activity: "clockTime", params: { mode: "quarter" } },
      { id: "m09", name: "Clock: 5-minute intervals", activity: "clockTime", params: { mode: "fiveMin" } },
      { id: "m10", name: "Count mixed Kwacha", activity: "kwachaMoney", params: { mode: "count", coins: "mixed" } },
      { id: "m11", name: "Make change (Kwacha)", activity: "kwachaMoney", params: { mode: "make", maxTarget: 10 } },
      { id: "m12", name: "Difference in length", activity: "measureUp", params: { maxUnits: 10, mode: "difference" } },

      // Gr 4 — Elapsed time, larger money
      { id: "m13", name: "Clock: any time", activity: "clockTime", params: { mode: "any" } },
      { id: "m14", name: "Make change (larger amounts)", activity: "kwachaMoney", params: { mode: "make", maxTarget: 50 } },
      { id: "m15", name: "Elapsed time", activity: "clockTime", params: { mode: "elapsed" } },
    ],
  },

  {
    id: "pattern",
    name: "Pattern & Logic",
    color: "#EC4899",
    emoji: "\u{1F52E}",
    skills: [
      // Gr 1 — Simple patterns
      { id: "p01", name: "AB patterns (shapes)", activity: "patternSequence", params: { types: ["alternateShape"] } },
      { id: "p02", name: "AB patterns (colors)", activity: "patternSequence", params: { types: ["alternateColor"] } },
      { id: "p03", name: "Odd one out (color)", activity: "oddOneOut", params: { mode: "color" } },
      { id: "p04", name: "Odd one out (shape)", activity: "oddOneOut", params: { mode: "shape" } },

      // Gr 2 — Growing patterns
      { id: "p05", name: "Growing size", activity: "patternSequence", params: { types: ["growSize"] } },
      { id: "p06", name: "Shrinking size", activity: "patternSequence", params: { types: ["shrinkSize"] } },
      { id: "p07", name: "Counting dots", activity: "patternSequence", params: { types: ["dots"] } },
      { id: "p08", name: "Odd one out (sides)", activity: "oddOneOut", params: { mode: "sides" } },

      // Gr 3 — Rotation, ABC
      { id: "p09", name: "Rotating arrows", activity: "patternSequence", params: { types: ["arrows"] } },
      { id: "p10", name: "ABC repeat", activity: "patternSequence", params: { types: ["abcRepeat"] } },
      { id: "p11", name: "Mixed patterns", activity: "patternSequence", params: { types: "all" } },
      { id: "p12", name: "Odd one out (fill)", activity: "oddOneOut", params: { mode: "fill" } },

      // Gr 4 — Complex
      { id: "p13", name: "Two-attribute patterns", activity: "patternSequence", params: { types: ["twoAttribute"] } },
      { id: "p14", name: "Number patterns", activity: "patternSequence", params: { types: ["numberPattern"] } },
      { id: "p15", name: "Mixed challenges", activity: "patternSequence", params: { types: "all" } },
      { id: "p16", name: "Odd one out (mixed)", activity: "oddOneOut", params: { mode: "mixed" } },
    ],
  },
];

// Quick lookups
export const STRAND_MAP = Object.fromEntries(STRANDS.map(s => [s.id, s]));
export const SKILL_MAP = {};
for (const strand of STRANDS) {
  for (const skill of strand.skills) {
    SKILL_MAP[skill.id] = { ...skill, strandId: strand.id };
  }
}
export const TOTAL_SKILLS = STRANDS.reduce((s, st) => s + st.skills.length, 0);
