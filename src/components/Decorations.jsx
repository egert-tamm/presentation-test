import { B } from "../constants";

export const Logo = ({ dark, style = {} }) => (
  <img
    src={B.logo}
    alt="Yolo"
    style={{ height: 28, pointerEvents: "none", filter: dark ? "brightness(0) invert(1)" : "none", ...style }}
  />
);

export const Footer = ({ page, total, dark }) => {
  const c = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const b = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, borderTop: "1px solid " + b, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", fontFamily: B.bFont, fontSize: 10, color: c }}>
      <span>Yolo Investments</span>
      <span>{page}/{total}</span>
    </div>
  );
};

export const OP = ({ text, base = B.black }) => {
  const parts = (text || "").split("||");
  return (
    <>
      {parts.map((p, i) => {
        let segment = p;
        if (i > 0 && !p.startsWith(" ") && !parts[i - 1].endsWith(" ")) segment = " " + segment;
        return <span key={i} style={{ color: i % 2 === 1 ? B.orange : base }}>{segment}</span>;
      })}
    </>
  );
};
