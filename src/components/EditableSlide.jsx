import { useState, useRef, useEffect, useCallback } from "react";
import { B } from "../constants";

const EDITABLE_TAGS = ["DIV", "SPAN", "P", "H1", "H2", "H3", "B"];

function getEditableTarget(el, container) {
  let node = el;
  while (node && node !== container) {
    if (EDITABLE_TAGS.includes(node.tagName) && node.textContent.trim() && node.children.length === 0) {
      return node;
    }
    // Also match elements whose direct children are only text/spans (like OP-rendered text)
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
    fontFamily: cs.fontFamily,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing,
    opacity: cs.opacity,
    textAlign: cs.textAlign,
  };
}

export function EditableSlide({ children, onTextChange, slideData, slideIndex }) {
  const containerRef = useRef(null);
  const [selectedEl, setSelectedEl] = useState(null);
  const [hoveredEl, setHoveredEl] = useState(null);
  const [panelProps, setPanelProps] = useState(null);
  const [editing, setEditing] = useState(false);

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
    if (!target) {
      clearSelection();
      return;
    }

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

    // Select all text
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const handleBlur = useCallback((e) => {
    const target = e.target;
    if (target.contentEditable === "true") {
      target.contentEditable = "false";
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

  const handleMouseLeave = useCallback(() => {
    setHoveredEl(null);
  }, []);

  // Highlight effects
  useEffect(() => {
    if (hoveredEl && hoveredEl !== selectedEl) {
      hoveredEl.style.outline = "1px dashed rgba(255,98,0,0.4)";
      hoveredEl.style.outlineOffset = "2px";
      return () => {
        hoveredEl.style.outline = "none";
        hoveredEl.style.outlineOffset = "0";
      };
    }
  }, [hoveredEl, selectedEl]);

  useEffect(() => {
    if (selectedEl) {
      selectedEl.style.outline = "2px solid " + B.orange;
      selectedEl.style.outlineOffset = "2px";
      return () => {
        selectedEl.style.outline = "none";
        selectedEl.style.outlineOffset = "0";
      };
    }
  }, [selectedEl]);

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
        style={{ cursor: editing ? "text" : "default" }}
      >
        {children}
      </div>

      {/* Property panel */}
      {selectedEl && panelProps && (
        <div style={{
          position: "absolute",
          top: 0,
          left: "100%",
          marginLeft: 12,
          width: 200,
          background: "#1a1a1a",
          borderRadius: 10,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          zIndex: 20,
          pointerEvents: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: B.hFont, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Properties</div>
            <button onClick={clearSelection} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>

          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: B.bFont }}>Double-click to edit text</div>

          {/* Font size */}
          <PropRow label="Size">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="range"
                min="8"
                max="80"
                value={panelProps.fontSize}
                onChange={e => updateStyle("fontSize", e.target.value + "px")}
                style={{ flex: 1, accentColor: B.orange }}
              />
              <span style={{ fontSize: 11, color: "#fff", minWidth: 28, textAlign: "right" }}>{panelProps.fontSize}</span>
            </div>
          </PropRow>

          {/* Font weight */}
          <PropRow label="Weight">
            <select
              value={panelProps.fontWeight}
              onChange={e => updateStyle("fontWeight", e.target.value)}
              style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 11 }}
            >
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </PropRow>

          {/* Color */}
          <PropRow label="Color">
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="color"
                value={rgbToHex(panelProps.color)}
                onChange={e => updateStyle("color", e.target.value)}
                style={{ width: 28, height: 28, border: "none", background: "none", cursor: "pointer", padding: 0 }}
              />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{rgbToHex(panelProps.color)}</span>
            </div>
          </PropRow>

          {/* Text align */}
          <PropRow label="Align">
            <div style={{ display: "flex", gap: 4 }}>
              {["left", "center", "right"].map(a => (
                <button
                  key={a}
                  onClick={() => updateStyle("textAlign", a)}
                  style={{
                    flex: 1,
                    padding: "4px 0",
                    background: panelProps.textAlign === a ? "rgba(255,98,0,0.2)" : "#111",
                    border: panelProps.textAlign === a ? "1px solid " + B.orange : "1px solid #333",
                    borderRadius: 5,
                    color: panelProps.textAlign === a ? B.orange : "rgba(255,255,255,0.5)",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  {a[0].toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </PropRow>

          {/* Letter spacing */}
          <PropRow label="Spacing">
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={parseFloat(panelProps.letterSpacing) || 0}
              onChange={e => updateStyle("letterSpacing", e.target.value + "px")}
              style={{ width: "100%", accentColor: B.orange }}
            />
          </PropRow>

          {/* Opacity */}
          <PropRow label="Opacity">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={panelProps.opacity}
              onChange={e => updateStyle("opacity", e.target.value)}
              style={{ width: "100%", accentColor: B.orange }}
            />
          </PropRow>
        </div>
      )}
    </div>
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
