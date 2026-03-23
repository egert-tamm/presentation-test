import { B, W, H } from "../../constants";
import { Logo, Footer } from "../Decorations";

export const TeamSlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.black, position: "relative", overflow: "hidden" }}>
    <Logo dark style={{ position: "absolute", top: 14, left: 18 }} />
    <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", textAlign: "center", width: 500 }}>
      <div style={{ fontFamily: B.hFont, fontSize: 38, fontWeight: 700, color: B.white, letterSpacing: "-2px", lineHeight: 0.95 }}>{s.title}</div>
      <div style={{ fontFamily: B.bFont, fontSize: 11, color: "rgba(255,255,255,0.45)", fontStyle: "italic", marginTop: 7 }}>{s.subtitle}</div>
    </div>
    <div style={{ position: "absolute", top: 126, left: 8, right: 8, bottom: 44, display: "flex", gap: 8 }}>
      {(s.people || []).slice(0, 3).map((p, k) => (
        <div key={k} style={{ flex: 1, background: B.dark, borderRadius: 18, padding: "14px 13px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontFamily: B.hFont, fontSize: 16, fontWeight: 600, color: B.white, letterSpacing: "-0.5px" }}>{p.name}</div>
          <div style={{ fontFamily: B.bFont, fontSize: 13, color: B.orange, lineHeight: 1.2 }}>{p.role}</div>
          <div style={{ fontFamily: B.bFont, fontSize: 10.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.45, marginTop: 3, flex: 1 }}>{p.bio}</div>
          <div style={{ flex: 1, background: "#222", borderRadius: 12, minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: B.hFont, fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.08)" }}>
              {p.name?.split(" ")[0]?.[0]}{p.name?.split(" ")[1]?.[0]}
            </div>
          </div>
        </div>
      ))}
    </div>
    <Footer page={i + 1} total={n} dark />
  </div>
);
