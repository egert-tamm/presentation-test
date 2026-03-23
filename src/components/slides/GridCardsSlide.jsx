import { B, W, H } from "../../constants";
import { WaveDecor, Logo, Footer, OP } from "../Decorations";

export const GridCardsSlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.bg, position: "relative", overflow: "hidden" }}>
    <WaveDecor style={{ top: "-20%", left: "0%", width: "100%", height: "100%" }} opacity={0.08} />
    <Logo style={{ position: "absolute", top: 14, left: 18 }} />
    <div style={{ position: "absolute", left: 30, top: 78, width: 296 }}>
      <div style={{ fontFamily: B.hFont, fontSize: 36, fontWeight: 700, color: B.black, letterSpacing: "-2px", lineHeight: 0.92, marginBottom: 10 }}><OP text={s.headline} /></div>
      <div style={{ fontFamily: B.bFont, fontSize: 12, color: B.black, opacity: 0.5, lineHeight: 1.4 }}>{s.subtext}</div>
    </div>
    <div style={{ position: "absolute", top: 6, right: 6, width: 582, bottom: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 6 }}>
      {(s.cards || []).slice(0, 4).map((c, k) => (
        <div key={k} style={{ background: B.white, borderRadius: 18, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: B.hFont, fontSize: 22, fontWeight: 700, letterSpacing: "-1.2px", lineHeight: 1, color: B.black }}><OP text={c.title} /></div>
          <div style={{ fontFamily: B.bFont, fontSize: 11, color: B.black, opacity: 0.45, lineHeight: 1.4 }}>{c.body}</div>
        </div>
      ))}
    </div>
    <Footer page={i + 1} total={n} dark={false} />
  </div>
);
