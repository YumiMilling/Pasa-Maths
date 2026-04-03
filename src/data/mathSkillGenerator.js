/**
 * Skill Generator — creates specific activity params from skill definitions.
 *
 * Each skill has a type + params. This module generates the concrete
 * problem: target numbers, options, distractors, etc.
 */

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate activity params for a given skill.
 * Returns { activity, props } where props are passed to the component.
 */
export function generateActivity(skill) {
  const p = skill.params || {};

  switch (skill.activity) {
    case "tensFrame":
      return genTensFrame(p);
    case "numberLine":
      return genNumberLine(p);
    case "coinMaker":
      return genCoinMaker(p);
    case "balanceScale":
      return genBalanceScale(p);
    case "skipCount":
      return genSkipCount(p);
    case "fairShare":
      return genFairShare(p);
    case "fractionFactory":
      return genFractionFactory(p);
    case "shapeExplorer":
      return genShapeExplorer(p);
    case "mirrorReflection":
      return genMirrorReflection(p);
    case "areaPerimeter":
      return genAreaPerimeter(p);
    case "measureUp":
      return genMeasureUp(p);
    case "clockTime":
      return genClockTime(p);
    case "kwachaMoney":
      return genKwachaMoney(p);
    case "patternSequence":
      return genPatternSequence(p);
    case "oddOneOut":
      return genOddOneOut(p);
    default:
      console.warn("Unknown activity:", skill.activity);
      return { activity: skill.activity, props: {} };
  }
}

// ── Generators ──

function genTensFrame(p) {
  const target = rand(1, p.max || 10);
  return { activity: "tensFrame", props: { target, max: p.max || 10 } };
}

function genNumberLine(p) {
  const max = p.max || 10;
  const mode = p.mode || "place";

  if (mode === "compare") {
    const a = rand(1, max - 1);
    let b;
    do { b = rand(1, max - 1); } while (b === a);
    return { activity: "numberLine", props: { max, mode: "compare", a, b } };
  }
  if (mode === "round10") {
    const n = rand(1, max - 1);
    const answer = Math.round(n / 10) * 10;
    return { activity: "numberLine", props: { max, mode: "round", n, answer, roundTo: 10 } };
  }
  if (mode === "round100") {
    const n = rand(10, max - 10);
    const answer = Math.round(n / 100) * 100;
    return { activity: "numberLine", props: { max, mode: "round", n, answer, roundTo: 100 } };
  }

  const target = rand(1, max - 1);
  return { activity: "numberLine", props: { target, max } };
}

function genCoinMaker(p) {
  const max = p.max || 100;
  const min = max <= 50 ? 5 : max <= 100 ? 15 : max <= 500 ? 50 : max <= 1000 ? 100 : 500;
  const target = rand(min, max);
  return { activity: "coinMaker", props: { target } };
}

function genBalanceScale(p) {
  const max = p.max || 10;
  const op = p.op || "add";

  if (op === "bonds") {
    const target = max;
    const a = rand(1, target - 1);
    const b = target - a;
    const distractors = [];
    while (distractors.length < 3) {
      const d = rand(1, max);
      if (d !== b && !distractors.includes(d)) distractors.push(d);
    }
    return {
      activity: "balanceScale",
      props: { target, given: a, cards: shuffle([b, ...distractors]), mode: "bonds" },
    };
  }

  if (op === "add") {
    const a = rand(1, Math.floor(max / 2));
    const b = rand(1, Math.min(max - a, Math.floor(max / 2)));
    const target = a + b;
    const distractors = [];
    while (distractors.length < 3) {
      const d = rand(1, max);
      if (d !== b && d !== a && !distractors.includes(d)) distractors.push(d);
    }
    return {
      activity: "balanceScale",
      props: { target, given: a, cards: shuffle([b, ...distractors]), mode: "add" },
    };
  }

  if (op === "subtract") {
    const target = rand(1, Math.floor(max * 0.7));
    const subtrahend = rand(1, Math.min(target, Math.floor(max / 2)));
    const start = target + subtrahend;
    return {
      activity: "balanceScale",
      props: { target, start, subtrahend, mode: "subtract" },
    };
  }

  return { activity: "balanceScale", props: { target: rand(3, max) } };
}

function genSkipCount(p) {
  const hop = p.hop || 2;
  const maxTarget = p.maxTarget || 20;
  const steps = rand(2, Math.min(5, Math.floor(maxTarget / hop)));
  const target = hop * steps;
  return { activity: "skipCount", props: { hop, target, max: Math.max(target + hop * 2, 30) } };
}

function genFairShare(p) {
  const divisor = p.divisor || 2;
  const maxTotal = p.maxTotal || 12;
  const withRemainder = p.withRemainder || false;

  if (p.mode === "multiply") {
    const factor = p.factor || 2;
    const groups = rand(2, 5);
    const total = groups * factor;
    return { activity: "fairShare", props: { total, plates: groups, mode: "multiply" } };
  }

  const perPlate = rand(1, Math.floor(maxTotal / divisor));
  const remainder = withRemainder ? rand(1, divisor - 1) : 0;
  const total = perPlate * divisor + remainder;
  return { activity: "fairShare", props: { total, plates: divisor } };
}

function genFractionFactory(p) {
  const denoms = p.denoms || [2, 3, 4];
  const denom = denoms[rand(0, denoms.length - 1)];
  const numer = rand(1, denom - 1);
  const colors = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6"];
  return {
    activity: "fractionFactory",
    props: { numer, denom, color: colors[rand(0, colors.length - 1)] },
  };
}

function genShapeExplorer(p) {
  const shapes = p.shapes === "all"
    ? ["circle", "square", "triangle", "rectangle", "pentagon", "hexagon", "diamond", "star"]
    : p.shapes || ["circle", "square", "triangle"];
  const mode = p.mode || "name";
  const shape = shapes[rand(0, shapes.length - 1)];
  return { activity: "shapeExplorer", props: { shape, shapes, mode } };
}

function genMirrorReflection(p) {
  const grid = p.grid || 4;
  return { activity: "mirrorReflection", props: { grid } };
}

function genAreaPerimeter(p) {
  const mode = p.mode || "area";
  const shapeType = p.shapeType || "rectangle";
  return { activity: "areaPerimeter", props: { mode, shapeType } };
}

function genMeasureUp(p) {
  const maxUnits = p.maxUnits || 6;
  const mode = p.mode || "measure";

  if (mode === "compare") {
    const lenA = rand(2, maxUnits);
    let lenB;
    do { lenB = rand(2, maxUnits); } while (lenB === lenA);
    return { activity: "measureUp", props: { maxUnits, mode: "compare", lenA, lenB } };
  }

  if (mode === "difference") {
    const lenA = rand(3, maxUnits);
    const lenB = rand(1, lenA - 1);
    return { activity: "measureUp", props: { maxUnits, mode: "difference", lenA, lenB, answer: lenA - lenB } };
  }

  const length = rand(2, maxUnits);
  return { activity: "measureUp", props: { maxUnits, mode: "measure", length } };
}

function genClockTime(p) {
  const mode = p.mode || "hours";
  const h = rand(1, 12);

  if (mode === "hours") return { activity: "clockTime", props: { hour: h, minute: 0 } };
  if (mode === "halfHour") return { activity: "clockTime", props: { hour: h, minute: [0, 30][rand(0, 1)] } };
  if (mode === "quarter") return { activity: "clockTime", props: { hour: h, minute: [0, 15, 30, 45][rand(0, 3)] } };
  if (mode === "fiveMin") return { activity: "clockTime", props: { hour: h, minute: rand(0, 11) * 5 } };
  if (mode === "any") return { activity: "clockTime", props: { hour: h, minute: rand(0, 59) } };
  if (mode === "elapsed") {
    const startH = rand(1, 10);
    const startM = rand(0, 3) * 15;
    const elapsed = [15, 30, 45, 60, 90][rand(0, 4)];
    return { activity: "clockTime", props: { hour: startH, minute: startM, elapsed, mode: "elapsed" } };
  }

  return { activity: "clockTime", props: { hour: h, minute: 0 } };
}

function genKwachaMoney(p) {
  const mode = p.mode || "count";
  if (mode === "count") {
    const simple = p.coins === "simple";
    return { activity: "kwachaMoney", props: { mode: "count", simple } };
  }
  const maxTarget = p.maxTarget || 10;
  const target = rand(2, maxTarget);
  return { activity: "kwachaMoney", props: { mode: "make", target } };
}

function genPatternSequence(p) {
  const types = p.types === "all"
    ? ["alternateShape", "alternateColor", "growSize", "shrinkSize", "dots", "arrows", "abcRepeat"]
    : p.types || ["alternateShape"];
  const type = types[rand(0, types.length - 1)];
  return { activity: "patternSequence", props: { type } };
}

function genOddOneOut(p) {
  const mode = p.mode || "color";
  return { activity: "oddOneOut", props: { mode } };
}
