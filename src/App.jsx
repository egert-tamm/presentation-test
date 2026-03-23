import { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { B, W, H } from "./constants";
import { SYSTEM } from "./prompt";
import { SlideView } from "./components/SlideView";

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.05;

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("yolo_api_key") || "");
  const [keyInput, setKeyInput] = useState("");
  const [keySet, setKeySet] = useState(() => !!localStorage.getItem("yolo_api_key"));
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(8);
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const saveKey = () => {
    if (!keyInput.trim()) return;
    localStorage.setItem("yolo_api_key", keyInput.trim());
    setApiKey(keyInput.trim());
    setKeySet(true);
    setKeyInput("");
  };

  const clearKey = () => {
    localStorage.removeItem("yolo_api_key");
    setApiKey("");
    setKeySet(false);
  };

  const generate = async () => {
    if (!topic.trim() || !apiKey) return;
    setLoading(true);
    setErr("");
    setSlides([]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: SYSTEM,
          messages: [{ role: "user", content: `Generate ${slideCount} slides for a Yolo Investments deck about: "${topic}"` }]
        })
      });
      if (!res.ok) throw new Error("API " + res.status);
      const data = await res.json();
      const raw = data.content.filter(b => b.type === "text").map(b => b.text).join("");
      const m = raw.match(/\[[\s\S]*\]/);
      if (!m) throw new Error("No JSON found");
      setSlides(JSON.parse(m[0]));
      setCurrent(0);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const el = document.getElementById("print-area");
    if (!el) return;
    if (slides.length === 0) { el.innerHTML = ""; return; }
    el.innerHTML = slides.map((_, i) => `<div class="print-slide" id="ps${i}"></div>`).join("");
    slides.forEach((sl, i) => {
      const c = document.getElementById(`ps${i}`);
      if (c) createRoot(c).render(<SlideView slide={sl} index={i} total={slides.length} />);
    });
  }, [slides]);

  const [zoom, setZoom] = useState(0.55);
  const canvasRef = useRef(null);
  const THUMB = 200 / W;

  const fitToScreen = useCallback(() => setZoom(0.55), []);

  const handleWheel = useCallback((e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.001)));
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <div style={{ fontFamily: B.bFont, background: "#111", minHeight: "100vh", color: "#fff" }}>
      {/* Header */}
      <div style={{ background: B.black, borderBottom: "1px solid #1e1e1e", padding: "11px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={B.logo} alt="Yolo" style={{ height: 28, filter: "brightness(0) invert(1)" }} />
          <div style={{ width: 1, height: 22, background: "#333" }} />
          <span style={{ fontFamily: B.hFont, fontWeight: 600, fontSize: 13, letterSpacing: "-0.4px" }}>Slides Generator</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {keySet && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>API key set ✓</span>}
          {keySet && <button onClick={clearKey} style={{ background: "transparent", border: "1px solid #333", borderRadius: 7, padding: "5px 12px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11 }}>Clear key</button>}
          {slides.length > 0 && <button onClick={() => window.print()} style={{ background: B.orange, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: 12, fontFamily: B.hFont }}>↓ Save as PDF</button>}
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", height: "calc(100vh - 54px)" }}>
        {/* Sidebar */}
        <div style={{ width: 256, background: B.black, borderRight: "1px solid #1a1a1a", padding: 14, display: "flex", flexDirection: "column", gap: 12, flexShrink: 0, overflowY: "auto" }}>
          {!keySet ? (
            <div>
              <div style={{ fontFamily: B.hFont, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 7 }}>Anthropic API Key</div>
              <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)} onKeyDown={e => e.key === "Enter" && saveKey()} placeholder="sk-ant-..." style={{ width: "100%", background: "#181818", border: "1.5px solid #282828", borderRadius: 9, padding: "9px 10px", fontSize: 12, color: "#fff", outline: "none", fontFamily: B.bFont }} />
              <button onClick={saveKey} disabled={!keyInput.trim()} style={{ width: "100%", marginTop: 7, background: keyInput.trim() ? "#333" : "#1e1e1e", color: "#fff", border: "none", borderRadius: 9, padding: "9px 0", fontWeight: 700, cursor: keyInput.trim() ? "pointer" : "not-allowed", fontSize: 12, fontFamily: B.hFont }}>Save Key</button>
              <div style={{ marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>Stored in your browser only. Never sent anywhere except Anthropic's API.</div>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: B.hFont, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 7 }}>Topic</div>
              <textarea value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }} placeholder="e.g. Fund III Overview, Q2 Portfolio Update…" style={{ width: "100%", height: 88, background: "#181818", border: "1.5px solid #282828", borderRadius: 9, padding: "9px 10px", fontSize: 12, color: "#fff", resize: "none", fontFamily: B.bFont, outline: "none", lineHeight: 1.5 }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 7 }}>
                <div style={{ fontFamily: B.hFont, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Slides</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button onClick={() => setSlideCount(c => Math.max(1, c - 1))} style={{ background: "#181818", border: "1px solid #282828", borderRadius: 6, width: 26, height: 26, color: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontFamily: B.bFont, fontSize: 13, color: "#fff", minWidth: 20, textAlign: "center" }}>{slideCount}</span>
                  <button onClick={() => setSlideCount(c => Math.min(30, c + 1))} style={{ background: "#181818", border: "1px solid #282828", borderRadius: 6, width: 26, height: 26, color: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
              <button onClick={generate} disabled={!topic.trim() || loading} style={{ width: "100%", marginTop: 7, background: topic.trim() && !loading ? B.orange : "#1e1e1e", color: "#fff", border: "none", borderRadius: 9, padding: "11px 0", fontWeight: 700, cursor: topic.trim() && !loading ? "pointer" : "not-allowed", fontSize: 13, fontFamily: B.hFont, letterSpacing: "-0.3px" }}>
                {loading ? "Generating…" : "✦ Generate Deck"}
              </button>
              {err && <div style={{ marginTop: 7, fontSize: 11, color: "#f87171", lineHeight: 1.4 }}>⚠ {err}</div>}
            </div>
          )}

          {/* Slide thumbnails */}
          {slides.length > 0 && (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <div style={{ fontFamily: B.hFont, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 7 }}>Slides ({slides.length})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {slides.map((sl, idx) => (
                  <div key={idx} onClick={() => setCurrent(idx)} style={{ cursor: "pointer", border: idx === current ? "2px solid " + B.orange : "2px solid transparent", borderRadius: 7, overflow: "hidden", position: "relative", height: Math.round(H * THUMB) }}>
                    <div style={{ transform: "scale(" + THUMB + ")", transformOrigin: "top left", width: W, height: H, pointerEvents: "none" }}>
                      <SlideView slide={sl} index={idx} total={slides.length} />
                    </div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,.75))", padding: "6px 5px 3px", fontSize: 9, fontFamily: B.bFont, color: "rgba(255,255,255,0.8)" }}>
                      {idx + 1}. {sl.title || sl.headline || sl.quote?.slice(0, 24) || sl.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main viewer */}
        <div ref={canvasRef} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", position: "relative", overflow: "hidden" }}>
          {slides.length > 0 ? (
            <>
              <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} style={{ position: "absolute", left: 14, background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 38, height: 38, fontSize: 18, color: "#fff", cursor: current === 0 ? "not-allowed" : "pointer", opacity: current === 0 ? 0.2 : 0.7, zIndex: 10 }}>‹</button>
              <button onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))} disabled={current === slides.length - 1} style={{ position: "absolute", right: 14, background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 38, height: 38, fontSize: 18, color: "#fff", cursor: current === slides.length - 1 ? "not-allowed" : "pointer", opacity: current === slides.length - 1 ? 0.2 : 0.7, zIndex: 10 }}>›</button>
              <div style={{ boxShadow: "0 20px 80px rgba(0,0,0,0.7)", borderRadius: 6, overflow: "hidden", transform: "scale(" + zoom + ")", transition: "transform 0.1s ease-out" }}>
                <SlideView slide={slides[current]} index={current} total={slides.length} />
              </div>

              {/* Zoom controls */}
              <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.6)", borderRadius: 8, padding: "4px 6px", zIndex: 10 }}>
                <button onClick={() => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP))} style={{ background: "none", border: "none", color: "#fff", fontSize: 16, width: 28, height: 28, cursor: "pointer", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>−</button>
                <button onClick={fitToScreen} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: B.bFont, cursor: "pointer", padding: "2px 6px", borderRadius: 4, minWidth: 48, textAlign: "center" }}>
                  {Math.round(zoom * 100)}%
                </button>
                <button onClick={() => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP))} style={{ background: "none", border: "none", color: "#fff", fontSize: 16, width: 28, height: 28, cursor: "pointer", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>+</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              {loading ? (
                <>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
                  <div style={{ fontFamily: B.hFont, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>Generating…</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>✦</div>
                  <div style={{ fontFamily: B.hFont, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>
                    {keySet ? "Enter a topic to generate your deck" : "Enter your API key to get started"}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
