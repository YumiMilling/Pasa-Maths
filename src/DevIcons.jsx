/**
 * DevIcons — preview all custom icons.
 */
import * as Icons from "./components/Icons";

const ICON_LIST = [
  { name: "IconBack", comp: Icons.IconBack },
  { name: "IconForward", comp: Icons.IconForward },
  { name: "IconClose", comp: Icons.IconClose },
  { name: "IconBook", comp: Icons.IconBook },
  { name: "IconMaths", comp: Icons.IconMaths },
  { name: "IconScience", comp: Icons.IconScience },
  { name: "IconTrophy", comp: Icons.IconTrophy },
  { name: "IconStar", comp: Icons.IconStar },
  { name: "IconStar (filled)", comp: (p) => <Icons.IconStar filled {...p} /> },
  { name: "IconFire", comp: Icons.IconFire },
  { name: "IconTarget", comp: Icons.IconTarget },
  { name: "IconSparkle", comp: Icons.IconSparkle },
  { name: "IconBee", comp: Icons.IconBee },
  { name: "IconCheck", comp: Icons.IconCheck },
  { name: "IconWrong", comp: Icons.IconWrong },
  { name: "IconHint", comp: Icons.IconHint },
  { name: "IconPlay", comp: Icons.IconPlay },
  { name: "IconHeart", comp: Icons.IconHeart },
  { name: "IconHeart (filled)", comp: (p) => <Icons.IconHeart filled {...p} /> },
  { name: "IconLock", comp: Icons.IconLock },
  { name: "IconFlag", comp: Icons.IconFlag },
  { name: "IconRefresh", comp: Icons.IconRefresh },
  { name: "MasteryDots 0/3", comp: () => <Icons.MasteryDots streak={0} /> },
  { name: "MasteryDots 1/3", comp: () => <Icons.MasteryDots streak={1} /> },
  { name: "MasteryDots 2/3", comp: () => <Icons.MasteryDots streak={2} /> },
  { name: "MasteryDots 3/3", comp: () => <Icons.MasteryDots streak={3} /> },
  { name: "IconStreak 5", comp: () => <Icons.IconStreak count={5} /> },
  { name: "IconFrog", comp: Icons.IconFrog },
  { name: "IconApple", comp: Icons.IconApple },
  { name: "IconCookie", comp: Icons.IconCookie },
  { name: "IconSlice", comp: Icons.IconSlice },
  { name: "IconRuler", comp: Icons.IconRuler },
  { name: "IconClock", comp: Icons.IconClock },
  { name: "IconCoins", comp: Icons.IconCoins },
  { name: "Medal 1st", comp: () => <Icons.IconMedal rank={1} size={32} /> },
  { name: "Medal 2nd", comp: () => <Icons.IconMedal rank={2} size={32} /> },
  { name: "Medal 3rd", comp: () => <Icons.IconMedal rank={3} size={32} /> },
  { name: "IconWave", comp: Icons.IconWave },
  { name: "IconEraser", comp: Icons.IconEraser },
  { name: "BeeLogo", comp: () => <Icons.BeeLogo size={48} /> },
  { name: "IconLetters", comp: Icons.IconLetters },
  { name: "IconPuzzle", comp: Icons.IconPuzzle },
  { name: "IconLink", comp: Icons.IconLink },
  { name: "IconMagic", comp: Icons.IconMagic },
  { name: "IconStory", comp: Icons.IconStory },
  { name: "IconSound", comp: Icons.IconSound },
  { name: "IconSteps", comp: Icons.IconSteps },
  { name: "IconGamepad", comp: Icons.IconGamepad },
  { name: "Coin 10n", comp: () => <Icons.Coin10n /> },
  { name: "Coin 50n", comp: () => <Icons.Coin50n /> },
  { name: "Coin K1", comp: () => <Icons.CoinK1 /> },
  { name: "Coin K2", comp: () => <Icons.CoinK2 /> },
  { name: "Coin K5", comp: () => <Icons.CoinK5 /> },
  { name: "Note K10", comp: () => <Icons.NoteK10 /> },
  { name: "Note K20", comp: () => <Icons.NoteK20 /> },
  { name: "Note K50", comp: () => <Icons.NoteK50 /> },
  { name: "Note K100", comp: () => <Icons.NoteK100 /> },
  { name: "Note K200", comp: () => <Icons.NoteK200 /> },
  { name: "Note K500", comp: () => <Icons.NoteK500 /> },
];

export default function DevIcons() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Pasa Icon Set</h1>
      <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>
        {ICON_LIST.length} icons — warm, rounded, Yumi brand style
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
        {ICON_LIST.map(({ name, comp: Comp }, i) => (
          <div key={i} style={{
            padding: 14, borderRadius: 10, background: "#fff",
            border: "1px solid #E5E7EB", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Comp size={24} color="#374151" />
              <Comp size={32} color="#22C55E" />
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
