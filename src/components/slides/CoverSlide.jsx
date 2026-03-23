import { B, W, H } from "../../constants";
import { WaveDecor, CubeDecor, Logo, Footer } from "../Decorations";

export const CoverSlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.bg, position: "relative", overflow: "hidden" }}>
    <WaveDecor style={{ top: "-20%", left: "-10%", width: "110%", height: "110%" }} opacity={0.1} />
    <CubeDecor style={{ top: -60, right: -40, width: 380, height: 380 }} />
    <div style={{ position: "absolute", top: 0, right: 22, background: B.black, borderRadius: "0 0 12px 12px", padding: "7px 14px" }}>
      <span style={{ fontFamily: B.bFont, fontSize: 9.5, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
        <b>Disclaimer: </b>Confidential — For Qualified Investors Only
      </span>
    </div>
    <Logo style={{ position: "absolute", top: 14, left: 18 }} />
    <div style={{ position: "absolute", bottom: 72, left: 38 }}>
      <div style={{ fontFamily: B.hFont, fontSize: 66, fontWeight: 700, lineHeight: 0.92, letterSpacing: "-4px", color: B.black, whiteSpace: "pre-line" }}>{s.title}</div>
      <div style={{ fontFamily: B.hFont, fontSize: 36, fontWeight: 600, color: B.orange, letterSpacing: "-1.5px", marginTop: 6, lineHeight: 1.1 }}>{s.subtitle}</div>
    </div>
    {s.tags && <div style={{ position: "absolute", bottom: 44, left: 42, fontFamily: B.bFont, fontSize: 11, color: B.black }}>{s.tags}</div>}
    <Footer page={i + 1} total={n} dark={false} />
  </div>
);
