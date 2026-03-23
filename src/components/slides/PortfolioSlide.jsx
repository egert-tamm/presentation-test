import { B, W, H } from "../../constants";
import { Logo, Footer } from "../Decorations";

export const PortfolioSlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.black, position: "relative", overflow: "hidden" }}>
    <Logo dark style={{ position: "absolute", top: 14, left: 18 }} />
    <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", textAlign: "center", width: 580 }}>
      <div style={{ fontFamily: B.hFont, fontSize: 38, fontWeight: 700, color: B.white, letterSpacing: "-2px", lineHeight: 0.95 }}>{s.title}</div>
      <div style={{ fontFamily: B.bFont, fontSize: 11, color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginTop: 7 }}>{s.subtitle}</div>
    </div>
    <div style={{ position: "absolute", top: 114, left: 8, right: 8, bottom: 44, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridTemplateRows: "1fr 1fr", gap: 6 }}>
      {(s.companies || []).slice(0, 8).map((c, k) => (
        <div key={k} style={{ background: B.dark, borderRadius: 14, padding: "12px 13px 10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: B.hFont, fontSize: 14, fontWeight: 700, color: B.white, letterSpacing: "-0.4px" }}>{c.name}</div>
          <div style={{ fontFamily: B.bFont, fontSize: 10, color: "rgba(255,255,255,0.42)", lineHeight: 1.35, marginTop: 4 }}>{c.desc}</div>
          {c.tag && <div style={{ marginTop: 5, fontFamily: B.bFont, fontSize: 9, color: B.orange, fontStyle: "italic" }}>{c.tag}</div>}
        </div>
      ))}
    </div>
    <Footer page={i + 1} total={n} dark />
  </div>
);
