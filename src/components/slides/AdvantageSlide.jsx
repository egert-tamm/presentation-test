import { B, W, H } from "../../constants";
import { GlowDecor, Logo, Footer } from "../Decorations";

export const AdvantageSlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.black, position: "relative", overflow: "hidden" }}>
    <GlowDecor style={{ top: "50%", left: "50%", transform: "translate(-50%,-60%)", width: 700, height: 700 }} />
    <Logo dark style={{ position: "absolute", top: 14, left: 18 }} />
    <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", textAlign: "center", width: 620 }}>
      <div style={{ fontFamily: B.hFont, fontSize: 38, fontWeight: 700, color: B.white, letterSpacing: "-2px", lineHeight: 0.95 }}>{s.title}</div>
      <div style={{ fontFamily: B.bFont, fontSize: 11, color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginTop: 6 }}>{s.subtitle}</div>
    </div>
    <div style={{ position: "absolute", top: 114, left: 8, right: 8, bottom: s.body ? 66 : 44, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {(s.left || []).map((item, k) => (
          <div key={k} style={{ flex: 1, border: "1px solid rgba(255,255,255," + (k === 0 ? "0.45" : "0.12") + ")", borderRadius: 12, padding: "9px 14px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: B.hFont, fontSize: 14, fontWeight: 600, color: B.white, letterSpacing: "-0.4px" }}>{item.name}</div>
            <div style={{ fontFamily: B.bFont, fontSize: 10, color: "rgba(255,255,255,0.42)", marginTop: 2 }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {(s.right || []).map((item, k) => (
          <div key={k} style={{ flex: 1, border: "1px solid rgba(255,255,255," + (k === 0 ? "0.45" : "0.12") + ")", borderRadius: 12, padding: "9px 14px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "right" }}>
            <div style={{ fontFamily: B.hFont, fontSize: 14, fontWeight: 600, color: B.white, letterSpacing: "-0.4px" }}>{item.name}</div>
            <div style={{ fontFamily: B.bFont, fontSize: 10, color: "rgba(255,255,255,0.42)", marginTop: 2 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
    {s.body && <div style={{ position: "absolute", bottom: 44, left: 18, right: 18, fontFamily: B.bFont, fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, textAlign: "center" }}>{s.body}</div>}
    <Footer page={i + 1} total={n} dark />
  </div>
);
