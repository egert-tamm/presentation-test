import { useState, useRef, useEffect, useCallback } from "react";
import { B, W, H } from "../constants";

const EDITABLE_TAGS = ["DIV", "SPAN", "P", "H1", "H2", "H3", "B"];
const GRID_SIZES = [8, 16, 24, 32, 48];
const DEFAULT_GRID = 16;

function snap(val, grid) {
  return Math.round(val / grid) * grid;
}

function getEditableTarget(el, container) {
  let node = el;
  while (node && node !== container) {
    if (EDITABLE_TAGS.includes(node.tagName) && node.textContent.trim() && node.children.length === 0) {
      return node;
    }
    if (EDITABLE_TAGS.includes(node.tagName) && node.textContent.trim()) {
      const hasOnlyInline = [...node.children].every(c => ["SPAN", "B", "I", "EM", "STRONG"].includes(c.tagName));
      if (hasOnlyInline && node.children.length > 0) return node;
    }
    node = node.parentElement;
  }
  return null;
}

function getComputedProps(el) {
  const cs = window.getComputedStyle(el);
  return {
    fontSize: Math.round(parseFloat(cs.fontSize)),
    fontWeight: cs.fontWeight,
    color: cs.color,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing,
    opacity: cs.opacity,
    textAlign: cs.textAlign,
    width: Math.round(parseFloat(cs.width)),
    height: Math.round(parseFloat(cs.height)),
    paddingTop: Math.round(parseFloat(cs.paddingTop)),
    paddingRight: Math.round(parseFloat(cs.paddingRight)),
    paddingBottom: Math.round(parseFloat(cs.paddingBottom)),
    paddingLeft: Math.round(parseFloat(cs.paddingLeft)),
    borderRadius: Math.round(parseFloat(cs.borderRadius)),
    background: cs.backgroundColor,
  };
}

function GridOverlay({ gridSize, visible }) {
  if (!visible) return null;
  const cols = Math.floor(W / gridSize);
  const rows = Math.floor(H / gridSize);
  return (
    <svg
      width={W} height={H}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 10 }}
    >
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line key={"c" + i} x1={i * gridSize} y1={0} x2={i * gridSize} y2={H}
          stroke="rgba(255,98,0,0.12)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <line key={"r" + i} x1={0} y1={i * gridSize} x2={W} y2={i * gridSize}
          stroke="rgba(255,98,0,0.12)" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function ResizeHandles({ el, containerEl, gridSize, onResize }) {
  if (!el || !containerEl) return null;

  const elRect = el.getBoundingClientRect();
  const cRect = containerEl.getBoundingClientRect();
  const top = elRect.top - cRect.top;
  const left = elRect.left - cRect.left;
  const width = elRect.width;
  const height = elRect.height;

  const handles = [
    { cursor: "nw-resize", pos: { top: top - 4, left: left - 4 }, dir: "nw" },
    { cursor: "n-resize", pos: { top: top - 4, left: left + width / 2 - 4 }, dir: "n" },
    { cursor: "ne-resize", pos: { top: top - 4, left: left + width - 4 }, dir: "ne" },
    { cursor: "e-resize", pos: { top: top + height / 2 - 4, left: left + width - 4 }, dir: "e" },
    { cursor: "se-resize", pos: { top: top + height - 4, left: left + width - 4 }, dir: "se" },
    { cursor: "s-resize", pos: { top: top + height - 4, left: left + width / 2 - 4 }, dir: "s" },
    { cursor: "sw-resize", pos: { top: top + height - 4, left: left - 4 }, dir: "sw" },
    { cursor: "w-resize", pos: { top: top + height / 2 - 4, left: left - 4 }, dir: "w" },
  ];

  const handleMouseDown = (e, dir) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = parseFloat(el.style.width) || el.offsetWidth;
    const startH = parseFloat(el.style.height) || el.offsetHeight;

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newW = startW, newH = startH;

      if (dir.includes("e")) newW = snap(startW + dx, gridSize);
      if (dir.includes("w")) newW = snap(startW - dx, gridSize);
      if (dir.includes("s")) newH = snap(startH + dy, gridSize);
      if (dir.includes("n")) newH = snap(startH - dy, gridSize);

      if (newW > gridSize) el.style.width = newW + "px";
      if (newH > gridSize) el.style.height = newH + "px";
      onResize?.();
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      onResize?.();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <>
      {/* Bounding box */}
      <div style={{
        position: "absolute", top, left, width, height,
        border: "1.5px solid " + B.orange,
        pointerEvents: "none", zIndex: 11,
      }} />
      {/* Dimension label */}
      <div style={{
        position: "absolute",
        top: top + height + 6,
        left: left + width / 2,
        transform: "translateX(-50%)",
        background: B.orange,
        color: "#fff",
        fontSize: 9,
        fontFamily: B.bFont,
        padding: "2px 6px",
        borderRadius: 4,
        whiteSpace: "nowrap",
        zIndex: 12,
        pointerEvents: "none",
      }}>
        {Math.round(width)} × {Math.round(height)}
      </div>
      {/* Handles */}
      {handles.map(h => (
        <div
          key={h.dir}
          onMouseDown={e => handleMouseDown(e, h.dir)}
          style={{
            position: "absolute",
            ...h.pos,
            width: 8, height: 8,
            background: "#fff",
            border: "1.5px solid " + B.orange,
            borderRadius: 2,
            cursor: h.cursor,
            zIndex: 13,
          }}
        />
      ))}
    </>
  );
}

export function EditableSlide({ children }) {
  const containerRef = useRef(null);
  const slideRef = useRef(null);
  const [selectedEl, setSelectedEl] = useState(null);
  const [hoveredEl, setHoveredEl] = useState(null);
  const [panelProps, setPanelProps] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID);
  const [, forceUpdate] = useState(0);

  const refreshProps = useCallback(() => {
    if (selectedEl) setPanelProps(getComputedProps(selectedEl));
    forceUpdate(n => n + 1);
  }, [selectedEl]);

  const clearSelection = useCallback(() => {
    if (selectedEl) {
      selectedEl.contentEditable = "false";
      selectedEl.style.outline = "none";
    }
    setSelectedEl(null);
    setPanelProps(null);
    setEditing(false);
  }, [selectedEl]);

  const handleClick = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const target = getEditableTarget(e.target, container);
    if (!target) { clearSelection(); return; }
    if (selectedEl && selectedEl !== target) {
      selectedEl.contentEditable = "false";
      selectedEl.style.outline = "none";
    }
    setSelectedEl(target);
    setPanelProps(getComputedProps(target));
  }, [selectedEl, clearSelection]);

  const handleDoubleClick = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const target = getEditableTarget(e.target, container);
    if (!target) return;
    target.contentEditable = "true";
    target.focus();
    setEditing(true);
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const handleBlur = useCallback((e) => {
    if (e.target.contentEditable === "true") {
      e.target.contentEditable = "false";
      setEditing(false);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (editing) return;
    const container = containerRef.current;
    if (!container) return;
    const target = getEditableTarget(e.target, container);
    setHoveredEl(target);
  }, [editing]);

  const handleMouseLeave = useCallback(() => { setHoveredEl(null); }, []);

  // Hover highlight
  useEffect(() => {
    if (hoveredEl && hoveredEl !== selectedEl) {
      hoveredEl.style.outline = "1px dashed rgba(255,98,0,0.4)";
      hoveredEl.style.outlineOffset = "2px";
      return () => { hoveredEl.style.outline = "none"; hoveredEl.style.outlineOffset = "0"; };
    }
  }, [hoveredEl, selectedEl]);

  // Selected highlight (only when no resize handles visible — handles draw their own box)
  useEffect(() => {
    if (selectedEl && !showGrid) {
      selectedEl.style.outline = "2px solid " + B.orange;
      selectedEl.style.outlineOffset = "2px";
      return () => { selectedEl.style.outline = "none"; selectedEl.style.outlineOffset = "0"; };
    }
  }, [selectedEl, showGrid]);

  const updateStyle = (prop, value) => {
    if (!selectedEl) return;
    selectedEl.style[prop] = value;
    setPanelProps(getComputedProps(selectedEl));
  };

  return (
    <div style={{ position: "relative", display: "flex" }}>
      <div
        ref={containerRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: editing ? "text" : "default", position: "relative" }}
      >
        <div ref={slideRef} style={{ position: "relative" }}>
          {children}
          <GridOverlay gridSize={gridSize} visible={showGrid} />
          {selectedEl && showGrid && (
            <ResizeHandles
              el={selectedEl}
              containerEl={slideRef.current?.firstChild}
              gridSize={gridSize}
              onResize={refreshProps}
            />
          )}
        </div>
      </div>

      {/* Property panel */}
      {selectedEl && panelProps && (
        <div style={{
          position: "absolute", top: 0, left: "100%", marginLeft: 12,
          width: 210, background: "#1a1a1a", borderRadius: 10, padding: 14,
          display: "flex", flexDirection: "column", gap: 8,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)", zIndex: 20, maxHeight: H, overflowY: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: B.hFont, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Properties</div>
            <button onClick={clearSelection} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>

          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: B.bFont }}>Double-click to edit text</div>

          {/* Grid toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #282828" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setShowGrid(!showGrid)}
                style={{
                  width: 32, height: 18, borderRadius: 9, border: "none",
                  background: showGrid ? B.orange : "#333", cursor: "pointer",
                  position: "relative", transition: "background 0.15s",
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: 7, background: "#fff",
                  position: "absolute", top: 2,
                  left: showGrid ? 16 : 2, transition: "left 0.15s",
                }} />
              </button>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Grid + Resize</span>
            </div>
            {showGrid && (
              <select
                value={gridSize}
                onChange={e => setGridSize(Number(e.target.value))}
                style={{ background: "#111", border: "1px solid #333", borderRadius: 4, padding: "2px 4px", color: "#fff", fontSize: 10 }}
              >
                {GRID_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
              </select>
            )}
          </div>

          {/* Dimensions (when grid active) */}
          {showGrid && (
            <PropRow label="Size (W × H)">
              <div style={{ display: "flex", gap: 6 }}>
                <DimInput
                  value={panelProps.width}
                  gridSize={gridSize}
                  onChange={v => updateStyle("width", v + "px")}
                />
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, lineHeight: "28px" }}>×</span>
                <DimInput
                  value={panelProps.height}
                  gridSize={gridSize}
                  onChange={v => updateStyle("height", v + "px")}
                />
              </div>
            </PropRow>
          )}

          {/* Padding (when grid active) */}
          {showGrid && (
            <PropRow label="Padding">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {["Top", "Right", "Bottom", "Left"].map(side => (
                  <div key={side} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", width: 10 }}>{side[0]}</span>
                    <DimInput
                      value={panelProps["padding" + side]}
                      gridSize={gridSize}
                      onChange={v => updateStyle("padding" + side, v + "px")}
                      small
                    />
                  </div>
                ))}
              </div>
            </PropRow>
          )}

          {/* Border radius */}
          {showGrid && (
            <PropRow label="Radius">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="range" min="0" max="32" value={panelProps.borderRadius}
                  onChange={e => updateStyle("borderRadius", e.target.value + "px")}
                  style={{ flex: 1, accentColor: B.orange }}
                />
                <span style={{ fontSize: 11, color: "#fff", minWidth: 24, textAlign: "right" }}>{panelProps.borderRadius}</span>
              </div>
            </PropRow>
          )}

          {/* Background color */}
          {showGrid && (
            <PropRow label="Background">
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="color"
                  value={rgbToHex(panelProps.background)}
                  onChange={e => updateStyle("backgroundColor", e.target.value)}
                  style={{ width: 28, height: 28, border: "none", background: "none", cursor: "pointer", padding: 0 }}
                />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{rgbToHex(panelProps.background)}</span>
              </div>
            </PropRow>
          )}

          <div style={{ borderTop: "1px solid #282828", paddingTop: 8, marginTop: 2 }}>
            <div style={{ fontFamily: B.hFont, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Typography</div>
          </div>

          {/* Font size */}
          <PropRow label="Size">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="range" min="8" max="80" value={panelProps.fontSize}
                onChange={e => updateStyle("fontSize", e.target.value + "px")}
                style={{ flex: 1, accentColor: B.orange }} />
              <span style={{ fontSize: 11, color: "#fff", minWidth: 28, textAlign: "right" }}>{panelProps.fontSize}</span>
            </div>
          </PropRow>

          {/* Font weight */}
          <PropRow label="Weight">
            <select value={panelProps.fontWeight} onChange={e => updateStyle("fontWeight", e.target.value)}
              style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 11 }}>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </PropRow>

          {/* Color */}
          <PropRow label="Color">
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="color" value={rgbToHex(panelProps.color)}
                onChange={e => updateStyle("color", e.target.value)}
                style={{ width: 28, height: 28, border: "none", background: "none", cursor: "pointer", padding: 0 }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{rgbToHex(panelProps.color)}</span>
            </div>
          </PropRow>

          {/* Text align */}
          <PropRow label="Align">
            <div style={{ display: "flex", gap: 4 }}>
              {["left", "center", "right"].map(a => (
                <button key={a} onClick={() => updateStyle("textAlign", a)}
                  style={{
                    flex: 1, padding: "4px 0",
                    background: panelProps.textAlign === a ? "rgba(255,98,0,0.2)" : "#111",
                    border: panelProps.textAlign === a ? "1px solid " + B.orange : "1px solid #333",
                    borderRadius: 5, color: panelProps.textAlign === a ? B.orange : "rgba(255,255,255,0.5)",
                    fontSize: 10, cursor: "pointer",
                  }}>
                  {a[0].toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </PropRow>

          {/* Letter spacing */}
          <PropRow label="Spacing">
            <input type="range" min="-5" max="5" step="0.5"
              value={parseFloat(panelProps.letterSpacing) || 0}
              onChange={e => updateStyle("letterSpacing", e.target.value + "px")}
              style={{ width: "100%", accentColor: B.orange }} />
          </PropRow>

          {/* Opacity */}
          <PropRow label="Opacity">
            <input type="range" min="0" max="1" step="0.05"
              value={panelProps.opacity}
              onChange={e => updateStyle("opacity", e.target.value)}
              style={{ width: "100%", accentColor: B.orange }} />
          </PropRow>
        </div>
      )}
    </div>
  );
}

function DimInput({ value, gridSize, onChange, small }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(String(value));

  useEffect(() => { if (!editing) setText(String(value)); }, [value, editing]);

  const commit = () => {
    const num = snap(parseInt(text) || 0, gridSize);
    onChange(num);
    setEditing(false);
  };

  return (
    <input
      value={editing ? text : value}
      onFocus={() => setEditing(true)}
      onChange={e => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={e => {
        if (e.key === "Enter") commit();
        if (e.key === "ArrowUp") { e.preventDefault(); onChange(snap(value + gridSize, gridSize)); }
        if (e.key === "ArrowDown") { e.preventDefault(); onChange(snap(Math.max(gridSize, value - gridSize), gridSize)); }
      }}
      style={{
        width: small ? 44 : 52, background: "#111", border: "1px solid #333", borderRadius: 5,
        padding: small ? "3px 5px" : "4px 6px", color: "#fff", fontSize: small ? 10 : 11,
        textAlign: "center", fontFamily: "monospace",
      }}
    />
  );
}

function PropRow({ label, children }) {
  return (
    <div>
      <div style={{ fontFamily: B.bFont, fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

function rgbToHex(rgb) {
  if (!rgb) return "#000000";
  if (rgb.startsWith("#")) return rgb;
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return "#000000";
  return "#" + match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
}
