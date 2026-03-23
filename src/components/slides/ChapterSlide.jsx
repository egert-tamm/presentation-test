import { B, W, H } from "../../constants";
import { GlowDecor, Logo, Footer } from "../Decorations";

export const ChapterSlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.black, position: "relative", overflow: "hidden" }}>
    <GlowDecor style={{ top: "50%", left: "50%", transform: "translate(-50%,-60%)", width: 700, height: 700 }} />
    <Logo dark style={{ position: "absolute", top: 14, left: 18 }} />
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", width: 700 }}>
      <div style={{ fontFamily: B.hFont, fontSize: 62, fontWeight: 700, color: B.white, letterSpacing: "-4px", lineHeight: 0.92, marginBottom: 18 }}>{s.title}</div>
      <div style={{ fontFamily: B.bFont, fontSize: 15, color: "rgba(255,255,255,0.48)", fontStyle: "italic", lineHeight: 1.3 }}>{s.subtitle}</div>
    </div>
    <Footer page={i + 1} total={n} dark />
  </div>
);
