import { useState, useEffect } from "react";
import { B } from "../constants";

const MESSAGES = [
  "Analyzing your topic",
  "Crafting slide structure",
  "Writing headlines",
  "Generating content",
  "Picking layouts",
  "Adding finishing touches",
  "Polishing copy",
  "Almost there",
];

const FRAMES = [
  `
    ╔══════════════════════╗
    ║  ▓▓▓▓▓▓▓▓           ║
    ║                      ║
    ║  ░░░░░░░░░░░░░       ║
    ║  ░░░░░░░░░░          ║
    ║                      ║
    ╚══════════════════════╝
  `,
  `
    ╔══════════════════════╗
    ║  ████████            ║
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ║
    ║                      ║
    ║  ░░░░░░░░  ░░░░░░░░  ║
    ║  ░░░░░░░░  ░░░░░░░░  ║
    ╚══════════════════════╝
  `,
  `
    ╔══════════════════════╗
    ║       ▓▓▓▓▓▓▓▓       ║
    ║     ▓▓▓▓▓▓▓▓▓▓▓▓     ║
    ║                      ║
    ║    ░░░░░░░░░░░░░░    ║
    ║       ░░░░░░░░       ║
    ╚══════════════════════╝
  `,
  `
    ╔══════════════════════╗
    ║  ▓▓▓▓▓▓  ║  ░░░░░░  ║
    ║  ▓▓▓▓▓▓  ║  ░░░░░░  ║
    ║══════════╬══════════ ║
    ║  ░░░░░░  ║  ▓▓▓▓▓▓  ║
    ║  ░░░░░░  ║  ▓▓▓▓▓▓  ║
    ╚══════════════════════╝
  `,
  `
    ╔══════════════════════╗
    ║  ████                ║
    ║  ████   ░░░░░░░░░░░  ║
    ║         ░░░░░░░░░░░  ║
    ║         ░░░░░░░░░    ║
    ║                      ║
    ╚══════════════════════╝
  `,
  `
    ╔══════════════════════╗
    ║  ▓▓▓   ▓▓▓   ▓▓▓    ║
    ║  ░░░   ░░░   ░░░    ║
    ║  ░░░   ░░░   ░░░    ║
    ║                      ║
    ║    ░░░░░░░░░░░░░░    ║
    ╚══════════════════════╝
  `,
];

const SPINNERS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function AsciiLoader() {
  const [frame, setFrame] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots, setDots] = useState(0);
  const [spin, setSpin] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setFrame(f => (f + 1) % FRAMES.length), 2000);
    const t2 = setInterval(() => setMsgIdx(m => (m + 1) % MESSAGES.length), 3000);
    const t3 = setInterval(() => setDots(d => (d + 1) % 4), 500);
    const t4 = setInterval(() => setSpin(s => (s + 1) % SPINNERS.length), 80);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); };
  }, []);

  return (
    <div style={{ textAlign: "center", userSelect: "none" }}>
      <pre style={{
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 1.4,
        color: B.orange,
        opacity: 0.6,
        letterSpacing: "1px",
        margin: "0 auto 20px",
        transition: "opacity 0.3s",
      }}>
        {FRAMES[frame]}
      </pre>
      <div style={{
        fontFamily: B.hFont,
        fontSize: 14,
        fontWeight: 600,
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "-0.3px",
      }}>
        <span style={{ color: B.orange, marginRight: 8 }}>{SPINNERS[spin]}</span>
        {MESSAGES[msgIdx]}{".".repeat(dots)}
      </div>
    </div>
  );
}
