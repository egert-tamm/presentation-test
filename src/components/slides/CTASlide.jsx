import { B, W, H } from "../../constants";
import { Footer } from "../Decorations";

export const CTASlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.orange, position: "relative", overflow: "hidden" }}>
    <img src={B.logo} alt="Yolo" style={{ position: "absolute", top: 14, left: 18, height: 26, filter: "brightness(0)", opacity: 0.6, pointerEvents: "none" }} />
    <div style={{ position: "absolute", top: "50%", left: 46, transform: "translateY(-50%)", maxWidth: 580 }}>
      <div style={{ fontFamily: B.hFont, fontSize: 62, fontWeight: 700, color: B.white, letterSpacing: "-4px", lineHeight: 0.92, marginBottom: 18 }}>{s.headline}</div>
      <div style={{ fontFamily: B.bFont, fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>{s.body}</div>
      {s.cta && <div style={{ marginTop: 24, display: "inline-block", background: B.white, color: B.orange, fontFamily: B.hFont, fontSize: 13, fontWeight: 700, padding: "10px 24px", borderRadius: 9 }}>{s.cta}</div>}
    </div>
    <Footer page={i + 1} total={n} dark />
  </div>
);
