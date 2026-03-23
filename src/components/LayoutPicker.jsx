import { useState } from "react";
import { B } from "../constants";

const LAYOUTS = [
  {
    type: "cover",
    label: "Cover",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#f0f0f0" />
        <rect x="8" y="6" width="16" height="4" rx="1" fill="#ccc" />
        <rect x="8" y="38" width="60" height="8" rx="1" fill="#0a0a0a" />
        <rect x="8" y="49" width="40" height="5" rx="1" fill="#ff6200" />
        <rect x="8" y="58" width="24" height="3" rx="1" fill="#ccc" />
      </svg>
    ),
  },
  {
    type: "stats_sidebar",
    label: "Stats Sidebar",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#f0f0f0" />
        <rect x="8" y="16" width="50" height="6" rx="1" fill="#0a0a0a" />
        <rect x="8" y="26" width="45" height="3" rx="1" fill="#ccc" />
        <rect x="8" y="32" width="45" height="3" rx="1" fill="#ccc" />
        <rect x="72" y="4" width="44" height="18" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
        <rect x="76" y="8" width="20" height="5" rx="1" fill="#0a0a0a" />
        <rect x="76" y="15" width="30" height="2" rx="0.5" fill="#ccc" />
        <rect x="72" y="25" width="44" height="18" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
        <rect x="76" y="29" width="20" height="5" rx="1" fill="#0a0a0a" />
        <rect x="76" y="36" width="30" height="2" rx="0.5" fill="#ccc" />
        <rect x="72" y="46" width="44" height="18" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
        <rect x="76" y="50" width="20" height="5" rx="1" fill="#0a0a0a" />
        <rect x="76" y="57" width="30" height="2" rx="0.5" fill="#ccc" />
      </svg>
    ),
  },
  {
    type: "grid_cards",
    label: "Grid Cards",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#f0f0f0" />
        <rect x="8" y="14" width="34" height="6" rx="1" fill="#0a0a0a" />
        <rect x="8" y="23" width="30" height="3" rx="1" fill="#ccc" />
        <rect x="48" y="4" width="33" height="28" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
        <rect x="84" y="4" width="33" height="28" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
        <rect x="48" y="36" width="33" height="28" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
        <rect x="84" y="36" width="33" height="28" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
      </svg>
    ),
  },
  {
    type: "chapter",
    label: "Chapter",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#0a0a0a" />
        <rect x="20" y="24" width="80" height="8" rx="1" fill="#fff" fillOpacity="0.9" />
        <rect x="30" y="38" width="60" height="4" rx="1" fill="#fff" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    type: "team",
    label: "Team",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#0a0a0a" />
        <rect x="30" y="5" width="60" height="6" rx="1" fill="#fff" fillOpacity="0.9" />
        <rect x="6" y="18" width="34" height="46" rx="3" fill="#141414" />
        <rect x="43" y="18" width="34" height="46" rx="3" fill="#141414" />
        <rect x="80" y="18" width="34" height="46" rx="3" fill="#141414" />
        <rect x="11" y="22" width="20" height="3" rx="1" fill="#fff" fillOpacity="0.7" />
        <rect x="11" y="27" width="14" height="2" rx="0.5" fill="#ff6200" />
        <rect x="48" y="22" width="20" height="3" rx="1" fill="#fff" fillOpacity="0.7" />
        <rect x="48" y="27" width="14" height="2" rx="0.5" fill="#ff6200" />
        <rect x="85" y="22" width="20" height="3" rx="1" fill="#fff" fillOpacity="0.7" />
        <rect x="85" y="27" width="14" height="2" rx="0.5" fill="#ff6200" />
      </svg>
    ),
  },
  {
    type: "portfolio",
    label: "Portfolio",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#0a0a0a" />
        <rect x="30" y="4" width="60" height="6" rx="1" fill="#fff" fillOpacity="0.9" />
        {[0,1,2,3].map(c => [0,1].map(r => (
          <rect key={`${c}${r}`} x={6 + c * 28} y={16 + r * 26} width={26} height={23} rx="2" fill="#141414" />
        )))}
      </svg>
    ),
  },
  {
    type: "advantage",
    label: "Advantage",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#0a0a0a" />
        <rect x="25" y="4" width="70" height="6" rx="1" fill="#fff" fillOpacity="0.9" />
        {[0,1,2].map(r => (
          <g key={r}>
            <rect x="6" y={16 + r * 16} width="52" height="13" rx="2" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="0.5" />
            <rect x="62" y={16 + r * 16} width="52" height="13" rx="2" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="0.5" />
          </g>
        ))}
      </svg>
    ),
  },
  {
    type: "cta",
    label: "Call to Action",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#ff6200" />
        <rect x="10" y="18" width="60" height="8" rx="1" fill="#fff" />
        <rect x="10" y="30" width="50" height="3" rx="1" fill="#fff" fillOpacity="0.7" />
        <rect x="10" y="36" width="40" height="3" rx="1" fill="#fff" fillOpacity="0.7" />
        <rect x="10" y="46" width="30" height="10" rx="3" fill="#fff" />
      </svg>
    ),
  },
  {
    type: "quote",
    label: "Quote",
    render: () => (
      <svg viewBox="0 0 120 68" fill="none">
        <rect width="120" height="68" rx="2" fill="#0a0a0a" />
        <rect x="15" y="22" width="90" height="7" rx="1" fill="#fff" fillOpacity="0.9" />
        <rect x="25" y="33" width="70" height="4" rx="1" fill="#ff6200" fillOpacity="0.7" />
        <rect x="40" y="44" width="40" height="3" rx="1" fill="#fff" fillOpacity="0.3" />
      </svg>
    ),
  },
];

export function LayoutPicker({ currentType, onSelect, onClose }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#1a1a1a", borderRadius: 14, padding: "20px 24px", maxWidth: 520, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontFamily: B.hFont, fontSize: 15, fontWeight: 700, letterSpacing: "-0.5px" }}>Change Layout</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {LAYOUTS.map(l => {
            const isActive = l.type === currentType;
            const isHover = hovered === l.type;
            return (
              <div
                key={l.type}
                onClick={() => onSelect(l.type)}
                onMouseEnter={() => setHovered(l.type)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: "pointer",
                  borderRadius: 10,
                  padding: 8,
                  border: isActive ? "2px solid " + B.orange : "2px solid " + (isHover ? "rgba(255,255,255,0.2)" : "transparent"),
                  background: isActive ? "rgba(255,98,0,0.08)" : isHover ? "rgba(255,255,255,0.04)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ borderRadius: 6, overflow: "hidden", marginBottom: 6 }}>
                  {l.render()}
                </div>
                <div style={{ fontFamily: B.bFont, fontSize: 10, color: isActive ? B.orange : "rgba(255,255,255,0.5)", textAlign: "center" }}>{l.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
