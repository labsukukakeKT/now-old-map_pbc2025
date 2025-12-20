"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMapEvents, Marker } from "react-leaflet";
import Map from "./Map";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkdownRenderer from "./MarkdownRenderer";
import "./PlaceEditor.css";

export type PlaceInfo = {
  mainImageUrl: string;
  placeName: string;
  periodStartYear: number | null;
  periodEndYear: number | null;
  descriptionMarkdown: string;
  latitude: number | null;
  longitude: number | null;
};

export type PlaceInfoEditorProps = {
  value: PlaceInfo;
  onChange: (next: PlaceInfo) => void;
  disabled?: boolean;
  className?: string;
};

function toYearOrNull(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n)) return null;
  if (n < 0 || n > 9999) return null;
  return n;
}

export default function PlaceInfoEditor({
  value,
  onChange,
  disabled,
  className,
}: PlaceInfoEditorProps) {
  const initialCenter = useMemo(
    () => [value.latitude ?? 35.6895, value.longitude ?? 139.6917] as [number, number],
    [value.latitude, value.longitude]
  );
  const [center, setCenter] = useState<[number, number]>(initialCenter);

  // marker placed by clicking the map
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    value.latitude != null && value.longitude != null ? [value.latitude, value.longitude] : null
  );

  useEffect(() => {
    // keep map center in sync when external value changes
    if (value.latitude != null && value.longitude != null) {
      setCenter([value.latitude, value.longitude]);
      setMarkerPos([value.latitude, value.longitude]);
    }
  }, [value.latitude, value.longitude]);

  const handleField =
    <K extends keyof PlaceInfo>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next: PlaceInfo = { ...value };
      if (key === "periodStartYear" || key === "periodEndYear") {
        next[key] = toYearOrNull(e.target.value) as any;
      } else {
        next[key] = e.target.value as any;
      }
      onChange(next);
    };

  // handle clicks (distinct from drag/zoom): place marker and update latitude/longitude
  function MapClickListener() {
    useMapEvents({
      click: (e) => {
        const lat = Number(e.latlng.lat);
        const lng = Number(e.latlng.lng);
        setMarkerPos([lat, lng]);
        onChange({ ...value, latitude: lat, longitude: lng });
      },
    });
    return null;
  }

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // helper: replace selection and restore focus/selection
  function replaceSelection(newText: string, selStart: number, selEnd: number) {
    const next: PlaceInfo = { ...value, descriptionMarkdown: newText };
    onChange(next);
    // restore selection in next tick
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  }

  function wrapSelection(prefix: string, suffix = prefix, placeholder = "text") {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const cur = el.value;
    const selected = cur.slice(start, end) || placeholder;
    const nextValue = cur.slice(0, start) + prefix + selected + suffix + cur.slice(end);
    const newStart = start + prefix.length;
    const newEnd = newStart + selected.length;
    replaceSelection(nextValue, newStart, newEnd);
  }

  function insertHeading(level: number) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const cur = el.value;
    const lineStart = cur.lastIndexOf("\n", start - 1) + 1;
    const rest = cur.slice(lineStart);
    // avoid duplicating heading hashes
    const withoutHashes = rest.replace(/^\s*#{1,6}\s*/, "");
    const prefix = "#".repeat(level) + " ";
    const nextValue = cur.slice(0, lineStart) + prefix + withoutHashes;
    const newPos = lineStart + prefix.length;
    replaceSelection(nextValue, newPos, newPos + withoutHashes.length);
  }

  function toggleList(ordered = false) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const cur = el.value;
    const before = cur.slice(0, start);
    const sel = cur.slice(start, end) || "";
    const after = cur.slice(end);
    const lines = sel.split("\n");
    const out = lines.map((ln, idx) => {
      const trimmed = ln.replace(/^\s*([-*+]|\d+\.)\s*/, "");
      if (ordered) return `${idx + 1}. ${trimmed}`;
      return `- ${trimmed}`;
    });
    const next = before + out.join("\n") + after;
    const newStart = start;
    const newEnd = start + out.join("\n").length;
    replaceSelection(next, newStart, newEnd);
  }

  function toggleQuote() {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const cur = el.value;
    const before = cur.slice(0, start);
    const sel = cur.slice(start, end) || "";
    const after = cur.slice(end);
    const lines = (sel || "").split("\n");
    const out = lines.map((ln) => (ln.startsWith("> ") ? ln.replace(/^>\s+/, "") : `> ${ln}`));
    const next = before + out.join("\n") + after;
    const newStart = start;
    const newEnd = start + out.join("\n").length;
    replaceSelection(next, newStart, newEnd);
  }

  function insertLink() {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const cur = el.value;
    const selected = cur.slice(start, end) || "link text";
    const url = window.prompt("Enter URL", "https://") ?? "";
    if (!url) return;
    const next = cur.slice(0, start) + `[${selected}](${url})` + cur.slice(end);
    const newStart = start + 1;
    const newEnd = newStart + selected.length;
    replaceSelection(next, newStart, newEnd);
  }

  function insertImage() {
    const url = window.prompt("Image URL", "https://") ?? "";
    if (!url) return;
    const alt = window.prompt("Alt text", "") ?? "";
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const cur = el.value;
    const next = cur.slice(0, start) + `![${alt}](${url})` + cur.slice(start);
    const pos = start + 2 + alt.length; // place caret inside alt
    replaceSelection(next, pos, pos);
  }

  function insertCode() {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const cur = el.value;
    const selected = cur.slice(start, end);
    if (selected.includes("\n")) {
      // block
      const next = cur.slice(0, start) + "```\n" + selected + "\n```" + cur.slice(end);
      const newStart = start + 4;
      const newEnd = newStart + selected.length;
      replaceSelection(next, newStart, newEnd);
    } else {
      // inline
      wrapSelection("`", "`");
    }
  }

  // small helper to check if URL looks like an image
  function isImageUrl(u?: string) {
    if (!u) return false;
    try {
      const parsed = new URL(u);
      if (parsed.protocol.startsWith("http") === false) return false;
      const ext = parsed.pathname.split(".").pop()?.toLowerCase() ?? "";
      return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext) || u.startsWith("data:image");
    } catch {
      return false;
    }
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      const el = containerRef.current;
      if (!el) {
        setAvailableHeight(null);
        return;
      }
      // compute remaining height below this component's top (accounts for navbar/title above)
      const top = el.getBoundingClientRect().top;
      const avail = Math.max(320, window.innerHeight - Math.round(top) - 24); // 24px bottom margin
      setAvailableHeight(avail);
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      ro.disconnect();
    };
  }, []);

  // create a simple custom marker icon using public/marker-icon.png
  const markerIcon = useMemo(() => {
    try {
      return L.icon({
        iconUrl: "/marker-icon.png",
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -36],
      });
    } catch {
      return undefined as any;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="ppe-container"
      style={
        availableHeight
          ? ({ ["--available-height" as any]: `${availableHeight}px` } as React.CSSProperties)
          : undefined
      }
    >
      <div className="ppe-left">
        <div className="ppe-upper">
          <div className="ppe-inputs">
            <label className="pie-label" htmlFor="pie-placeName">
              Place name
            </label>
            <input
              id="pie-placeName"
              className="pie-input"
              type="text"
              placeholder="e.g., Old Town Square"
              value={value.placeName}
              onChange={handleField("placeName")}
              disabled={disabled}
            />

            <label className="pie-label" htmlFor="pie-mainImageUrl" style={{ marginTop: 12 }}>
              Main picture URL
            </label>
            <input
              id="pie-mainImageUrl"
              className="pie-input"
              type="url"
              inputMode="url"
              placeholder="https://example.com/your-image.jpg"
              value={value.mainImageUrl}
              onChange={handleField("mainImageUrl")}
              disabled={disabled}
              spellCheck={false}
            />

            <div className="pie-flex-row" style={{ marginTop: 12 }}>
              <div className="pie-flex-item">
                <label className="pie-label" htmlFor="pie-startYear">
                  Period start (year)
                </label>
                <input
                  id="pie-startYear"
                  className="pie-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{1,4}"
                  placeholder="YYYY"
                  value={value.periodStartYear ?? ""}
                  onChange={handleField("periodStartYear")}
                  disabled={disabled}
                />
              </div>
              <div className="pie-flex-item">
                <label className="pie-label" htmlFor="pie-endYear">
                  Period end (year)
                </label>
                <input
                  id="pie-endYear"
                  className="pie-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{1,4}"
                  placeholder="YYYY"
                  value={value.periodEndYear ?? ""}
                  onChange={handleField("periodEndYear")}
                  disabled={disabled}
                />
              </div>
            </div>
            <div className="pie-help" style={{ marginTop: 8 }}>
              Enter 1–4 digit years. Leave blank if unknown.
            </div>
          </div>

          {/* collapsed image wrapper: single element contains preview + label via CSS ::after */}
          <div className="ppe-image-box">
            {isImageUrl(value.mainImageUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.mainImageUrl!} alt={value.placeName || "preview"} className="ppe-image-el" />
            ) : (
              <div className="ppe-image-placeholder">No image<br />(paste a valid image URL)</div>
            )}
          </div>

          {/* map */}
          <div className="ppe-map">
            <div className="ppe-map-wrap">
              <Map center={center} zoom={12} tileUrl={null}>
                <MapClickListener />
                {markerPos ? <Marker position={markerPos as any} icon={markerIcon as any} /> : null}
              </Map>

              <div className="ppe-center-indicator" />
            </div>
          </div>
        </div>

        {/* Lower: semantic headers and editor card */}
        <div className="ppe-lower">
          <div className="ppe-lower-editor">
            <h4 className="ppe-lower-header">Description</h4>

            <div className="editor-card">
              <div className="ppe-toolbar">
                <button type="button" onClick={() => insertHeading(1)} disabled={disabled}>
                  H1
                </button>
                <button type="button" onClick={() => insertHeading(2)} disabled={disabled}>
                  H2
                </button>
                <button type="button" onClick={() => insertHeading(3)} disabled={disabled}>
                  H3
                </button>
                <button type="button" onClick={() => wrapSelection("**", "**")} disabled={disabled}>
                  <strong>B</strong>
                </button>
                <button type="button" onClick={() => wrapSelection("*", "*")} disabled={disabled}>
                  <em>I</em>
                </button>
                <button type="button" onClick={insertLink} disabled={disabled}>
                  Link
                </button>
                <button type="button" onClick={insertImage} disabled={disabled}>
                  Image
                </button>
                <button type="button" onClick={insertCode} disabled={disabled}>
                  Code
                </button>
                <button type="button" onClick={() => toggleList(false)} disabled={disabled}>
                  UL
                </button>
                <button type="button" onClick={() => toggleList(true)} disabled={disabled}>
                  OL
                </button>
                <button type="button" onClick={toggleQuote} disabled={disabled}>
                  Quote
                </button>
              </div>

              <textarea
                id="pie-description"
                ref={textareaRef}
                className="pie-textarea ppe-textarea"
                placeholder="Write the place description in Markdown..."
                value={value.descriptionMarkdown}
                onChange={(e) => onChange({ ...value, descriptionMarkdown: e.target.value })}
                disabled={disabled}
              />
            </div>
          </div>

          <div className="ppe-lower-preview">
            <h4 className="ppe-lower-header">Preview</h4>
            <div className="ppe-preview-body">
              <MarkdownRenderer source={value.descriptionMarkdown || ""} />
            </div>
          </div>
        </div>

        {/* single footer row for helper text + submit button */}
        <div className="ppe-lower-footer">
          <div className="footer-left">You can use Markdown here — use the toolbar or type Markdown directly.</div>
          <div className="footer-right">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                // replace with real submit handler as needed
                // eslint-disable-next-line no-console
                console.log("Submit place", value);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="ppe-right">
        <div style={{ fontSize: 13, marginBottom: 8 }}>JSON preview (debug)</div>
        <pre className="ppe-json">{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  );
}