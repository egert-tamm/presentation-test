import { B, W, H } from "../../constants";
import { WaveDecor, CubeDecor, Logo, Footer, OP } from "../Decorations";

export const StatsSidebarSlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.bg, position: "relative", overflow: "hidden" }}>
    <WaveDecor style={{ top: "-20%", right: "-20%", width: "90%", height: "90%" }} opacity={0.07} />
    <CubeDecor style={{ top: -20, right: 140, width: 300, height: 300 }} />
    <Logo style={{ position: "absolute", top: 14, left: 18 }} />
    <div style={{ position: "absolute", top: 6, right: 6, width: 296, bottom: 40, display: "flex", flexDirection: "column", gap: 6 }}>
      {(s.stats || []).map((st, k) => (
        <div key={k} style={{ flex: 1, background: B.white, borderRadius: 18, padding: "14px 18px 10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: B.hFont, fontSize: 42, fontWeight: 600, letterSpacing: "-3px", lineHeight: 0.92, textAlign: "right", color: B.black }}>{st.value}</div>
          <div style={{ fontFamily: B.bFont, fontSize: 12, color: B.black, opacity: 0.48, lineHeight: 1.2 }}>{st.label}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 30, top: 90, width: 380 }}>
      <div style={{ fontFamily: B.hFont, fontSize: 38, fontWeight: 700, color: B.black, letterSpacing: "-2px", lineHeight: 0.92, marginBottom: 18 }}><OP text={s.headline} /></div>
      <div style={{ fontFamily: B.bFont, fontSize: 12, color: B.black, opacity: 0.65, lineHeight: 1.55, marginBottom: 12 }}>{s.body1}</div>
      <div style={{ fontFamily: B.bFont, fontSize: 12, color: B.black, opacity: 0.65, lineHeight: 1.55 }}>{s.body2}</div>
    </div>
    <Footer page={i + 1} total={n} dark={false} />
  </div>
);
