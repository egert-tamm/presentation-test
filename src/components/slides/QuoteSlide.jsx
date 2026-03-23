import { B, W, H } from "../../constants";
import { Logo, Footer, OP } from "../Decorations";

export const QuoteSlide = ({ s, i, n }) => (
  <div style={{ width: W, height: H, background: B.black, position: "relative", overflow: "hidden" }}>
    <Logo dark style={{ position: "absolute", top: 14, left: 18 }} />
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, textAlign: "center" }}>
      <div style={{ fontFamily: B.hFont, fontSize: 50, fontWeight: 700, letterSpacing: "-3px", lineHeight: 0.95, marginBottom: 22 }}><OP text={s.quote} base={B.white} /></div>
      {s.attribution && <div style={{ fontFamily: B.bFont, fontSize: 13, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>— {s.attribution}</div>}
    </div>
    <Footer page={i + 1} total={n} dark />
  </div>
);
