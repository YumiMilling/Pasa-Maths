/**
 * Pasa Icon Set — warm, friendly, rounded SVG icons.
 *
 * Brand: Yumi-sponsored, family values, smart but approachable.
 * Style: rounded strokes, soft fills, consistent 24x24 viewbox.
 */

const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = "currentColor";

function Svg({ children, size = DEFAULT_SIZE, color = DEFAULT_COLOR, style, ...props }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      {...props}
    >
      {children}
    </svg>
  );
}

// ── Navigation ──

export function IconBack(props) {
  return <Svg {...props}><polyline points="15 18 9 12 15 6" /></Svg>;
}

export function IconForward(props) {
  return <Svg {...props}><polyline points="9 18 15 12 9 6" /></Svg>;
}

export function IconClose(props) {
  return <Svg {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>;
}

// ── Subjects ──

export function IconBook(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Book cover */}
      <path d="M6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5v-13A2.5 2.5 0 0 1 6.5 2z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
      {/* Spine */}
      <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20v5H6.5A2.5 2.5 0 0 1 4 17.5z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5" />
      {/* Text lines */}
      <line x1="8" y1="7" x2="16" y2="7" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="10.5" x2="13" y2="10.5" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconMaths(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Abacus / counting frame — warm, recognisable as maths */}
      {/* Frame */}
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="1.5" />
      {/* Rods with beads */}
      <line x1="3" y1="8" x2="21" y2="8" stroke="#C4B5FD" strokeWidth="1" />
      <line x1="3" y1="13" x2="21" y2="13" stroke="#C4B5FD" strokeWidth="1" />
      <line x1="3" y1="18" x2="21" y2="18" stroke="#C4B5FD" strokeWidth="1" />
      {/* Top row: 3 beads */}
      <circle cx="7" cy="8" r="2.2" fill="#EF4444" />
      <circle cx="11.5" cy="8" r="2.2" fill="#EF4444" />
      <circle cx="16" cy="8" r="2.2" fill="#EF4444" />
      {/* Middle row: 2 beads */}
      <circle cx="7" cy="13" r="2.2" fill="#3B82F6" />
      <circle cx="11.5" cy="13" r="2.2" fill="#3B82F6" />
      {/* Bottom row: 4 beads */}
      <circle cx="6" cy="18" r="2" fill="#22C55E" />
      <circle cx="10" cy="18" r="2" fill="#22C55E" />
      <circle cx="14" cy="18" r="2" fill="#22C55E" />
      <circle cx="18" cy="18" r="2" fill="#22C55E" />
    </svg>
  );
}

export function IconScience(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Flask */}
      <path d="M9 3h6v5l4 9a2 2 0 0 1-1.8 2.8H6.8A2 2 0 0 1 5 17l4-9V3z" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
      {/* Rim */}
      <line x1="8" y1="3" x2="16" y2="3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      {/* Liquid */}
      <path d="M7 14h10l2 4a1.5 1.5 0 0 1-1.3 2.2H6.3A1.5 1.5 0 0 1 5 18z" fill="#6EE7B7" opacity="0.6" />
      {/* Bubbles */}
      <circle cx="10" cy="15" r="1.2" fill="#34D399" />
      <circle cx="14" cy="16.5" r="0.8" fill="#34D399" />
      <circle cx="11.5" cy="17.5" r="0.6" fill="#34D399" />
    </svg>
  );
}

// ── Games & Activities ──

export function IconTrophy(props) {
  const s = props.size || DEFAULT_SIZE;
  const c = props.color || "#F59E0B";
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Cup */}
      <path d="M6 4h12v5a6 6 0 0 1-12 0V4z" fill="#FCD34D" stroke={c} strokeWidth="1.5" />
      {/* Handles */}
      <path d="M6 6H4a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h1" stroke={c} strokeWidth="1.5" />
      <path d="M18 6h2a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2h-1" stroke={c} strokeWidth="1.5" />
      {/* Stem */}
      <line x1="12" y1="15" x2="12" y2="18" stroke={c} strokeWidth="1.5" />
      {/* Base */}
      <path d="M8 21h8" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M9 18h6" stroke={c} strokeWidth="1.5" />
      {/* Star on cup */}
      <path d="M12 6.5l.8 1.6 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3z" fill="#F97316" />
    </svg>
  );
}

export function IconStar(props) {
  return (
    <Svg {...props} fill={props.filled ? (props.color || "#F59E0B") : "none"} stroke={props.color || "#F59E0B"}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

export function IconFire(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Outer flame — orange */}
      <path d="M12 23c-3.87 0-7-3.13-7-7 0-2.38 1.37-4.84 3.2-6.53.6-.55 1.49-.14 1.49.68v.64c0 .69.56 1.21 1.13.96C13.66 10.4 16 7.99 16 5c0-.55.47-.98.97-.76C19.5 5.4 21 8.46 21 11.5 21 17.85 17.87 23 12 23z" fill="#F97316" />
      {/* Inner flame — yellow */}
      <path d="M12 23c-2 0-4-1.8-4-4.5 0-1.5.8-3 2-4 .4-.3.9-.1.9.4v.3c0 .4.4.7.7.5C13.2 14.8 14.5 13 14.5 11c0-.3.3-.6.6-.5 1.3.5 2.4 2 2.4 3.8 0 4.5-2.5 8.7-5.5 8.7z" fill="#FBBF24" />
      {/* Core — bright */}
      <ellipse cx="12" cy="20" rx="1.5" ry="2" fill="#FEF3C7" />
    </svg>
  );
}

export function IconTarget(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <circle cx="12" cy="12" r="10" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6.5" fill="#fff" stroke="#EF4444" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" fill="#EF4444" />
    </svg>
  );
}

export function IconSparkle(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z" fill="#FBBF24" />
      <path d="M18 14l.9 2.7 2.7.9-2.7.9L18 21.2l-.9-2.7-2.7-.9 2.7-.9L18 14z" fill="#F97316" opacity="0.7" />
      <path d="M4 18l.5 1.5 1.5.5-1.5.5L4 22l-.5-1.5L2 20l1.5-.5L4 18z" fill="#FCD34D" opacity="0.5" />
    </svg>
  );
}

export function IconBee(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Wings */}
      <ellipse cx="7" cy="9" rx="3" ry="2" fill="#BFDBFE" opacity="0.7" />
      <ellipse cx="17" cy="9" rx="3" ry="2" fill="#BFDBFE" opacity="0.7" />
      {/* Body — yellow with brown stripes */}
      <ellipse cx="12" cy="13" rx="5" ry="6" fill="#FCD34D" />
      <rect x="7" y="11" width="10" height="2" rx="1" fill="#92400E" />
      <rect x="7" y="14.5" width="10" height="2" rx="1" fill="#92400E" />
      {/* Head */}
      <circle cx="12" cy="7" r="3" fill="#FCD34D" />
      {/* Eyes */}
      <circle cx="10.5" cy="6.5" r="1" fill="#111" />
      <circle cx="13.5" cy="6.5" r="1" fill="#111" />
      {/* Antennae */}
      <path d="M10 5c-1-2-2-3-3-2.5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 5c1-2 2-3 3-2.5" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
      {/* Stinger */}
      <path d="M12 19l-1-1.5h2z" fill="#92400E" />
    </svg>
  );
}

// ── Progress & Feedback ──

export function IconCheck(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <circle cx="12" cy="12" r="10" fill="#DCFCE7" />
      <polyline points="8 12 11 15 17 9" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconWrong(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <circle cx="12" cy="12" r="10" fill="#FEE2E2" />
      <line x1="15" y1="9" x2="9" y2="15" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="9" y1="9" x2="15" y2="15" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconHint(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Bulb */}
      <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
      {/* Glow center */}
      <circle cx="12" cy="9" r="2.5" fill="#FBBF24" opacity="0.5" />
      {/* Base rings */}
      <line x1="9" y1="19" x2="15" y2="19" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="21" x2="14" y2="21" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      {/* Rays */}
      <line x1="12" y1="0" x2="12" y2="0" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="4" x2="5" y2="5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="4" x2="19" y2="5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="2" y1="10" x2="3" y2="10" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="22" y1="10" x2="21" y2="10" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function IconPlay(props) {
  return (
    <Svg {...props} fill={props.color || DEFAULT_COLOR} stroke="none">
      <polygon points="6,3 20,12 6,21" />
    </Svg>
  );
}

export function IconHeart(props) {
  return (
    <Svg {...props} fill={props.filled ? (props.color || "#EF4444") : "none"} stroke={props.color || "#EF4444"}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  );
}

export function IconLock(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <rect x="4" y="11" width="16" height="11" rx="3" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="#6B7280" />
    </svg>
  );
}

export function IconStreak(props) {
  const count = props.count || 0;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...props.style }}>
      <IconFire size={props.size || 18} color="#F59E0B" />
      <span style={{ fontSize: props.fontSize || 13, fontWeight: 800, color: "#F59E0B" }}>{count}</span>
    </span>
  );
}

// ── Mastery dots (1/3, 2/3, 3/3) ──

export function MasteryDots({ streak = 0, size = 8, color = "#22C55E", style }) {
  return (
    <span style={{ display: "inline-flex", gap: 3, ...style }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: size, height: size, borderRadius: "50%",
          background: i < streak ? color : "#E5E7EB",
          transition: "background 0.3s ease",
        }} />
      ))}
    </span>
  );
}

// ── Warning / Report ──

export function IconFlag(props) {
  return (
    <Svg {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </Svg>
  );
}

export function IconRefresh(props) {
  return (
    <Svg {...props}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </Svg>
  );
}

// ── Activity-specific ──

export function IconFrog(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Body */}
      <ellipse cx="12" cy="14" rx="8" ry="6" fill="#22C55E" />
      {/* Eyes */}
      <circle cx="8" cy="8" r="3" fill="#22C55E" stroke="#166534" strokeWidth="1.5" />
      <circle cx="16" cy="8" r="3" fill="#22C55E" stroke="#166534" strokeWidth="1.5" />
      <circle cx="8" cy="7.5" r="1.2" fill="#111" />
      <circle cx="16" cy="7.5" r="1.2" fill="#111" />
      <circle cx="8.5" cy="7" r="0.4" fill="#fff" />
      <circle cx="16.5" cy="7" r="0.4" fill="#fff" />
      {/* Smile */}
      <path d="M9 15c1.5 1.5 4.5 1.5 6 0" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function IconApple(props) {
  const s = props.size || DEFAULT_SIZE;
  const c = props.color || "#EF4444";
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Stem */}
      <path d="M12 2c0 0-.5 3-1.5 4" stroke="#5C4033" strokeWidth="1.8" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M12 4c1.5-.5 3.5-.5 4 1" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" fill="#22C55E" opacity="0.8" />
      {/* Left half */}
      <path d="M12 7C8 7 5 10 5 14.5S8 22 10.5 22c1 0 1.2-.5 1.5-.5s.5.5 1.5.5c2.5 0 5.5-3.5 5.5-7.5S16 7 12 7z" fill={c} />
      {/* Highlight */}
      <ellipse cx="9" cy="13" rx="1.5" ry="2.5" fill="#fff" opacity="0.2" />
      {/* Dip at top */}
      <path d="M10.5 7.5c.5-.5 2.5-.5 3 0" stroke={c} strokeWidth="0.5" />
    </svg>
  );
}

export function IconCookie(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <circle cx="12" cy="12" r="9" fill="#D97706" />
      <circle cx="12" cy="12" r="9" stroke="#92400E" strokeWidth="1.5" fill="none" />
      {/* Chocolate chips */}
      <circle cx="9" cy="9" r="1.2" fill="#78350F" />
      <circle cx="14" cy="8" r="1" fill="#78350F" />
      <circle cx="8" cy="14" r="1" fill="#78350F" />
      <circle cx="15" cy="13" r="1.3" fill="#78350F" />
      <circle cx="11" cy="16" r="1" fill="#78350F" />
    </svg>
  );
}

export function IconSlice(props) {
  return (
    <Svg {...props}>
      <path d="M14.5 3L9.5 21" strokeWidth="2.5" />
      <path d="M6 8h12" />
      <path d="M7 16h10" />
    </Svg>
  );
}

export function IconRuler(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="8" width="18" height="8" rx="1" />
      <line x1="6" y1="8" x2="6" y2="12" />
      <line x1="9" y1="8" x2="9" y2="11" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="15" y1="8" x2="15" y2="11" />
      <line x1="18" y1="8" x2="18" y2="12" />
    </Svg>
  );
}

export function IconClock(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Svg>
  );
}

export function IconCoins(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <circle cx="10" cy="14" r="6" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5" />
      <text x="10" y="16" textAnchor="middle" fontSize="7" fontWeight="800" fill="#92400E">K</text>
      <circle cx="16" cy="10" r="5" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5" />
      <text x="16" y="12" textAnchor="middle" fontSize="6" fontWeight="800" fill="#92400E">K</text>
    </svg>
  );
}

// ── Zambian Kwacha money icons ──

function KwachaCoin({ value, label, size = 40, color, borderColor }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill={color} stroke={borderColor} strokeWidth="2" />
      <circle cx="20" cy="20" r="14" fill="none" stroke={borderColor} strokeWidth="1" opacity="0.3" />
      <text x="20" y="23" textAnchor="middle" fontSize="10" fontWeight="800" fill={borderColor} fontFamily="system-ui">{label}</text>
    </svg>
  );
}

function KwachaNote({ value, label, size = 56, color, darkColor, width }) {
  const w = width || size * 1.6;
  const h = size;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="4" fill={color} stroke={darkColor} strokeWidth="1.5" />
      <rect x="4" y="4" width={w - 8} height={h - 8} rx="2" fill="none" stroke={darkColor} strokeWidth="0.5" opacity="0.3" />
      <text x={w / 2} y={h / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={darkColor} fontFamily="system-ui">{label}</text>
      {/* Eagle watermark hint */}
      <circle cx={w - 14} cy={14} r="6" fill={darkColor} opacity="0.08" />
    </svg>
  );
}

// Coins
export function Coin10n(props) { return <KwachaCoin value={0.10} label="10n" size={props.size || 30} color="#D4D4D8" borderColor="#71717A" />; }
export function Coin20n(props) { return <KwachaCoin value={0.20} label="20n" size={props.size || 32} color="#D4D4D8" borderColor="#71717A" />; }
export function Coin50n(props) { return <KwachaCoin value={0.50} label="50n" size={props.size || 34} color="#E5E7EB" borderColor="#6B7280" />; }
export function CoinK1(props) { return <KwachaCoin value={1} label="K1" size={props.size || 38} color="#FDE68A" borderColor="#92400E" />; }
export function CoinK2(props) { return <KwachaCoin value={2} label="K2" size={props.size || 40} color="#FCD34D" borderColor="#78350F" />; }
export function CoinK5(props) { return <KwachaCoin value={5} label="K5" size={props.size || 42} color="#FBBF24" borderColor="#78350F" />; }

// Notes — each has a distinct colour
export function NoteK10(props) {
  return <KwachaNote value={10} label="K10" size={props.size || 40} color="#DBEAFE" darkColor="#1D4ED8" />;
}
export function NoteK20(props) {
  return <KwachaNote value={20} label="K20" size={props.size || 40} color="#D1FAE5" darkColor="#065F46" />;
}
export function NoteK50(props) {
  return <KwachaNote value={50} label="K50" size={props.size || 40} color="#FEF3C7" darkColor="#92400E" />;
}
export function NoteK100(props) {
  return <KwachaNote value={100} label="K100" size={props.size || 40} color="#FCE7F3" darkColor="#9D174D" />;
}
export function NoteK200(props) {
  return <KwachaNote value={200} label="K200" size={props.size || 40} color="#EDE9FE" darkColor="#5B21B6" />;
}
export function NoteK500(props) {
  return <KwachaNote value={500} label="K500" size={props.size || 40} color="#FEE2E2" darkColor="#991B1B" />;
}

export function IconMedal({ rank = 1, size = DEFAULT_SIZE, style }) {
  const colors = { 1: "#F59E0B", 2: "#9CA3AF", 3: "#CD7F32" };
  const color = colors[rank] || "#9CA3AF";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...style }}>
      <circle cx="12" cy="14" r="7" fill={color} stroke={color} strokeWidth="1" />
      <circle cx="12" cy="14" r="5" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff">{rank}</text>
      <path d="M9 3l3 5 3-5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function IconWave(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Open hand waving */}
      <path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V10" stroke={props.color || "#F59E0B"} strokeWidth="2" strokeLinecap="round" />
      <path d="M10 5.5V4a1.5 1.5 0 0 1 3 0v6" stroke={props.color || "#F59E0B"} strokeWidth="2" strokeLinecap="round" />
      <path d="M13 4.5V3.5a1.5 1.5 0 0 1 3 0v7" stroke={props.color || "#F59E0B"} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 6v-.5a1.5 1.5 0 0 1 3 0v6" stroke={props.color || "#F59E0B"} strokeWidth="2" strokeLinecap="round" />
      <path d="M19 11.5c0 4-2 7-6.5 8.5H10c-3 0-5-2.5-5-5.5V11" stroke={props.color || "#F59E0B"} strokeWidth="2" strokeLinecap="round" />
      {/* Motion lines */}
      <path d="M4 8l-1.5-1" stroke={props.color || "#F59E0B"} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M4.5 5l-1-1.5" stroke={props.color || "#F59E0B"} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function IconEraser(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Eraser body — pink rectangle with rounded top */}
      <rect x="6" y="4" width="12" height="16" rx="2" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5" />
      {/* Metal band */}
      <rect x="6" y="14" width="12" height="3" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
      {/* Rubber bottom */}
      <rect x="6" y="17" width="12" height="3" rx="1" fill="#FDA4AF" stroke="#EC4899" strokeWidth="1" />
      {/* Eraser marks / texture */}
      <line x1="9" y1="7" x2="9" y2="12" stroke="#F472B6" strokeWidth="0.8" opacity="0.4" />
      <line x1="12" y1="6" x2="12" y2="12" stroke="#F472B6" strokeWidth="0.8" opacity="0.4" />
      <line x1="15" y1="7" x2="15" y2="12" stroke="#F472B6" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

// ── Homepage / Course icons ──

export function IconLetters(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <text x="3" y="16" fontSize="14" fontWeight="800" fill={props.color || "#3B82F6"} fontFamily="system-ui">A</text>
      <text x="13" y="20" fontSize="11" fontWeight="800" fill={props.color || "#22C55E"} fontFamily="system-ui">b</text>
      <text x="17" y="11" fontSize="9" fontWeight="800" fill={props.color || "#F59E0B"} fontFamily="system-ui">c</text>
    </svg>
  );
}

export function IconPuzzle(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Top-left piece — blue */}
      <path d="M3 3h6v3a2 2 0 0 0 4 0V3h6v6h-3a2 2 0 0 0 0 4h3v6h-6v-3a2 2 0 0 0-4 0v3H3v-6h3a2 2 0 0 0 0-4H3V3z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Knob highlights */}
      <circle cx="11" cy="5" r="1" fill="#93C5FD" />
      <circle cx="18" cy="11" r="1" fill="#93C5FD" />
      <circle cx="11" cy="19" r="1" fill="#93C5FD" />
      <circle cx="4.5" cy="11" r="1" fill="#93C5FD" />
    </svg>
  );
}

export function IconLink(props) {
  return (
    <Svg {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Svg>
  );
}

export function IconMagic(props) {
  return (
    <Svg {...props}>
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9h2" />
      <path d="M20 9h2" />
      <path d="M17.8 11.8L19 13" />
      <path d="M15 9h.01" />
      <path d="M17.8 6.2L19 5" />
      <path d="M11 6.2L9.7 5" />
      <path d="M11 11.8L9.7 13" />
      <line x1="2" y1="22" x2="13" y2="11" strokeWidth="2.5" />
    </Svg>
  );
}

export function IconStory(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Open book */}
      <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Text lines left */}
      <line x1="5" y1="8" x2="9" y2="8" stroke="#FCD34D" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="11" x2="8" y2="11" stroke="#FCD34D" strokeWidth="1.2" strokeLinecap="round" />
      {/* Text lines right */}
      <line x1="15" y1="8" x2="19" y2="8" stroke="#FCD34D" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="11" x2="18" y2="11" stroke="#FCD34D" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconSound(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#60A5FA" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconSteps(props) {
  const s = props.size || DEFAULT_SIZE;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, ...props.style }}>
      {/* Staircase going up — filled blocks */}
      <rect x="2" y="18" width="6" height="4" rx="1" fill="#22C55E" />
      <rect x="8" y="13" width="6" height="9" rx="1" fill="#3B82F6" />
      <rect x="14" y="8" width="6" height="14" rx="1" fill="#8B5CF6" />
      {/* Flag at top */}
      <line x1="19" y1="3" x2="19" y2="8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 3l-4 2 4 2" fill="#EF4444" />
    </svg>
  );
}

export function IconGamepad(props) {
  return (
    <Svg {...props}>
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <line x1="6" y1="10" x2="6" y2="14" />
      <line x1="4" y1="12" x2="8" y2="12" />
      <circle cx="16" cy="10" r="1" fill={props.color || DEFAULT_COLOR} stroke="none" />
      <circle cx="19" cy="12" r="1" fill={props.color || DEFAULT_COLOR} stroke="none" />
    </Svg>
  );
}

// ── Bigger illustrated bee for Spelling Bee ──

export function BeeLogo({ size = 64, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0, ...style }}>
      {/* Wings */}
      <ellipse cx="20" cy="22" rx="12" ry="8" fill="#BFDBFE" opacity="0.7" transform="rotate(-20 20 22)" />
      <ellipse cx="44" cy="22" rx="12" ry="8" fill="#BFDBFE" opacity="0.7" transform="rotate(20 44 22)" />
      {/* Body */}
      <ellipse cx="32" cy="38" rx="14" ry="16" fill="#FCD34D" />
      {/* Stripes */}
      <rect x="18" y="32" width="28" height="4" rx="2" fill="#92400E" />
      <rect x="18" y="40" width="28" height="4" rx="2" fill="#92400E" />
      {/* Head */}
      <circle cx="32" cy="22" r="10" fill="#FCD34D" />
      {/* Eyes */}
      <circle cx="28" cy="20" r="3" fill="#fff" />
      <circle cx="36" cy="20" r="3" fill="#fff" />
      <circle cx="28.5" cy="20" r="1.5" fill="#111" />
      <circle cx="36.5" cy="20" r="1.5" fill="#111" />
      <circle cx="29" cy="19" r="0.5" fill="#fff" />
      <circle cx="37" cy="19" r="0.5" fill="#fff" />
      {/* Smile */}
      <path d="M28 25c2 2 4 2 8 0" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      {/* Antennae */}
      <path d="M28 13c-3-5-6-7-8-6" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 13c3-5 6-7 8-6" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="7" r="2" fill="#92400E" />
      <circle cx="44" cy="7" r="2" fill="#92400E" />
      {/* Stinger */}
      <path d="M32 54l-2-3h4l-2 3z" fill="#92400E" />
    </svg>
  );
}

