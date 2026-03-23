import { B } from "../constants";

export const CubeDecor = ({ style = {} }) => (
  <svg viewBox="0 0 400 400" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <defs>
      <linearGradient id="cg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ff4400" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="cg2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffb347" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#ff6200" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {[
      [80,40,180,40,180,140,80,140],[100,60,200,60,200,160,100,160],
      [120,80,220,80,220,180,120,180],[80,140,180,140,200,160,100,160],
      [80,40,100,60,100,160,80,140],[180,40,200,60,200,160,180,140],
      [200,100,300,100,300,200,200,200],[220,120,320,120,320,220,220,220],
      [240,140,340,140,340,240,240,240],[200,200,300,200,320,220,220,220],
      [200,100,220,120,220,220,200,200],[300,100,320,120,320,220,300,200]
    ].map((pts, i) => (
      <polygon
        key={i}
        points={pts.join(",")}
        fill={i < 3 ? "url(#cg1)" : i < 6 ? "rgba(255,150,0,0.3)" : i < 9 ? "rgba(255,120,0,0.5)" : "rgba(255,180,50,0.25)"}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.5"
      />
    ))}
  </svg>
);

export const WaveDecor = ({ style = {}, opacity = 0.12 }) => (
  <svg viewBox="0 0 800 800" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <defs>
      <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#888" stopOpacity="0" />
        <stop offset="50%" stopColor="#444" stopOpacity={opacity * 2} />
        <stop offset="100%" stopColor="#888" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="400" cy="400" rx="380" ry="120" fill="url(#wg1)" transform="rotate(-40 400 400)" />
    <ellipse cx="400" cy="400" rx="350" ry="80" fill="url(#wg1)" transform="rotate(-40 400 400) translate(60,-30)" />
    <ellipse cx="400" cy="400" rx="320" ry="60" fill="url(#wg1)" transform="rotate(-40 400 400) translate(-60,30)" />
  </svg>
);

export const GlowDecor = ({ style = {} }) => (
  <svg viewBox="0 0 600 600" style={{ position: "absolute", pointerEvents: "none", ...style }}>
    <defs>
      <radialGradient id="gg1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ff6200" stopOpacity="0.18" />
        <stop offset="60%" stopColor="#ff6200" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#ff6200" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="300" cy="300" r="280" fill="url(#gg1)" />
  </svg>
);

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

export const OP = ({ text, base = B.black }) => (
  <>
    {(text || "").split("||").map((p, i) => (
      <span key={i} style={{ color: i % 2 === 1 ? B.orange : base }}>{p}</span>
    ))}
  </>
);
