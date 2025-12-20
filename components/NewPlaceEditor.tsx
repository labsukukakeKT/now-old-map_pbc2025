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
  mainImageFile: File | null;
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
  errors?: Partial<Record<keyof PlaceInfo, string>>;
  onSubmit?: () => Promise<void> | void;
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
  errors,
  onSubmit,
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

  // Image preview URL (from file or existing URL)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    value.mainImageUrl || null
  );

  // State for upload progress
  const [isUploading, setIsUploading] = useState(false);

  // State for image input mode: 'upload' or 'url'
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');

  // State for URL input
  const [imageUrlInput, setImageUrlInput] = useState(value.mainImageUrl || '');

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
    // Accept blob: URLs for local previews
    if (u.startsWith("blob:")) return true;
    try {
      const parsed = new URL(u);
      if (parsed.protocol.startsWith("http") === false) return false;
      const ext = parsed.pathname.split(".").pop()?.toLowerCase() ?? "";
      return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext) || u.startsWith("data:image");
    } catch {
      return false;
    }
  }

  // Handle file selection for image upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      window.alert('JPG、PNG、WebP、GIF形式のみアップロード可能です');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      window.alert('ファイルサイズは5MB以下である必要があります');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);

    // Update value with file
    onChange({ ...value, mainImageFile: file, mainImageUrl: '' });
  }

  function handleRemoveImage() {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setImageUrlInput('');
    onChange({ ...value, mainImageFile: null, mainImageUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Handle URL input apply
  function handleApplyImageUrl() {
    const url = imageUrlInput.trim();
    if (!url) {
      window.alert('URLを入力してください');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      window.alert('有効なURLを入力してください');
      return;
    }

    // Clean up previous blob URL if exists
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setImagePreviewUrl(url);
    onChange({ ...value, mainImageFile: null, mainImageUrl: url });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

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

  // local frontend validation errors
  const [localErrors, setLocalErrors] = useState<Partial<Record<keyof PlaceInfo, string>>>({});
  const combinedErrors = { ...(errors || {}), ...(localErrors || {}) };

  function isValidImageUrlClient(u?: string) {
    if (!u) return false;
    try {
      const url = new URL(u);
      const ext = url.pathname.split(".").pop()?.toLowerCase() ?? "";
      return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext) || u.startsWith("data:image");
    } catch {
      return false;
    }
  }

  function validateFrontend(p: PlaceInfo) {
    const e: Partial<Record<keyof PlaceInfo, string>> = {};
    if (!p.placeName || p.placeName.trim() === "") e.placeName = "Place name is required";
    if (!p.descriptionMarkdown || p.descriptionMarkdown.trim() === "") e.descriptionMarkdown = "Description is required";
    if (p.latitude == null || Number.isNaN(p.latitude)) e.latitude = "Latitude is required";
    else if (p.latitude < -90 || p.latitude > 90) e.latitude = "Latitude must be between -90 and 90";
    if (p.longitude == null || Number.isNaN(p.longitude)) e.longitude = "Longitude is required";
    else if (p.longitude < -180 || p.longitude > 180) e.longitude = "Longitude must be between -180 and 180";
    if (p.periodStartYear != null) {
      if (!Number.isFinite(p.periodStartYear) || p.periodStartYear > 3000) e.periodStartYear = "Invalid start year (≤3000)";
    }
    if (p.periodEndYear != null) {
      if (!Number.isFinite(p.periodEndYear) || p.periodEndYear > 3000) e.periodEndYear = "Invalid end year (≤3000)";
    }
    if (p.mainImageUrl && p.mainImageUrl.trim() !== "" && !isValidImageUrlClient(p.mainImageUrl)) {
      e.mainImageUrl = "Main image must be a valid image URL";
    }
    return e;
  }

  // run validation on a single field blur: recompute frontend errors and keep them
  function handleBlurField() {
    const e = validateFrontend(value);
    setLocalErrors(e);
  }

  async function handleSubmitClick() {
    if (disabled) return;
    const e = validateFrontend(value);
    setLocalErrors(e);
    const keys = Object.keys(e);
    if (keys.length > 0) {
      const msg = keys.map((k) => `${k}: ${e[k as keyof typeof e]}`).join("\n");
      window.alert("Please fix the following errors:\n\n" + msg);
      // focus first invalid field optionally
      return;
    }
    // pass through to parent submit handler
    if (typeof onSubmit === "function") {
      await onSubmit();
    }
  }

  return (
    <>
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
              <label className={`pie-label ${combinedErrors?.placeName ? "invalid" : ""}`} htmlFor="pie-placeName">
                Place name
              </label>
              <input
                id="pie-placeName"
                className={`pie-input ${combinedErrors?.placeName ? "invalid" : ""}`}
                type="text"
                placeholder="e.g., Old Town Square"
                value={value.placeName}
                onChange={handleField("placeName")}
                onBlur={handleBlurField}
                disabled={disabled}
              />
              {combinedErrors?.placeName ? <div className="pie-error">{combinedErrors.placeName}</div> : null}

              <label className={`pie-label ${combinedErrors?.mainImageUrl ? "invalid" : ""}`} style={{ marginTop: 12 }}>
                Place Image
              </label>

              {/* Tab switcher for upload/URL */}
              <div className="pie-image-tabs">
                <button
                  type="button"
                  className={`pie-image-tab ${imageInputMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setImageInputMode('upload')}
                  disabled={disabled}
                >
                  ファイル
                </button>
                <button
                  type="button"
                  className={`pie-image-tab ${imageInputMode === 'url' ? 'active' : ''}`}
                  onClick={() => setImageInputMode('url')}
                  disabled={disabled}
                >
                  URL
                </button>
              </div>

              {/* File upload mode */}
              {imageInputMode === 'upload' && (
                <div className="pie-file-upload">
                  <input
                    ref={fileInputRef}
                    id="pie-mainImageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={disabled || isUploading}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="pie-file-button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                  >
                    {imagePreviewUrl ? '画像を変更' : '画像を選択'}
                  </button>
                  {imagePreviewUrl && (
                    <button
                      type="button"
                      className="pie-file-remove"
                      onClick={handleRemoveImage}
                      disabled={disabled || isUploading}
                    >
                      削除
                    </button>
                  )}
                  {isUploading && <span className="pie-uploading">アップロード中...</span>}
                </div>
              )}

              {/* URL input mode */}
              {imageInputMode === 'url' && (
                <div className="pie-url-input">
                  <input
                    id="pie-mainImageUrl"
                    className="pie-input pie-url-field"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    disabled={disabled}
                  />
                  <button
                    type="button"
                    className="pie-url-apply"
                    onClick={handleApplyImageUrl}
                    disabled={disabled || !imageUrlInput.trim()}
                  >
                    適用
                  </button>
                  {imagePreviewUrl && (
                    <button
                      type="button"
                      className="pie-file-remove"
                      onClick={handleRemoveImage}
                      disabled={disabled}
                    >
                      削除
                    </button>
                  )}
                </div>
              )}

              <div className="pie-help" style={{ marginTop: 4 }}>
                {imageInputMode === 'upload'
                  ? 'JPG, PNG, WebP, GIF (5MB max)'
                  : '画像のURLを入力してください'}
              </div>
              {combinedErrors?.mainImageUrl ? <div className="pie-error">{combinedErrors.mainImageUrl}</div> : null}

              <div className="pie-flex-row" style={{ marginTop: 12 }}>
                <div className="pie-flex-item">
                  <label className={`pie-label ${combinedErrors?.periodStartYear ? "invalid" : ""}`} htmlFor="pie-startYear">
                    Period start (year)
                  </label>
                  <input
                    id="pie-startYear"
                    className={`pie-input ${combinedErrors?.periodStartYear ? "invalid" : ""}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{1,4}"
                    placeholder="YYYY"
                    value={value.periodStartYear ?? ""}
                    onChange={handleField("periodStartYear")}
                    onBlur={handleBlurField}
                    disabled={disabled}
                  />
                  {combinedErrors?.periodStartYear ? <div className="pie-error">{combinedErrors.periodStartYear}</div> : null}
                </div>
                <div className="pie-flex-item">
                  <label className={`pie-label ${combinedErrors?.periodEndYear ? "invalid" : ""}`} htmlFor="pie-endYear">
                    Period end (year)
                  </label>
                  <input
                    id="pie-endYear"
                    className={`pie-input ${combinedErrors?.periodEndYear ? "invalid" : ""}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{1,4}"
                    placeholder="YYYY"
                    value={value.periodEndYear ?? ""}
                    onChange={handleField("periodEndYear")}
                    onBlur={handleBlurField}
                    disabled={disabled}
                  />
                  {combinedErrors?.periodEndYear ? <div className="pie-error">{combinedErrors.periodEndYear}</div> : null}
                </div>
              </div>
              <div className="pie-help" style={{ marginTop: 8 }}>
                Enter 1–4 digit years. Leave blank if unknown.
              </div>
            </div>

            {/* Upper-middle: image preview */}
            <div className="ppe-upper-col ppe-image">
              <div className="ppe-image-box">
                {imagePreviewUrl && isImageUrl(imagePreviewUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreviewUrl}
                    alt={value.placeName || "preview"}
                    className="ppe-image-el"
                  />
                ) : (
                  <div className="ppe-image-placeholder">
                    No image
                    <br />
                    (Select an image)
                  </div>
                )}
              </div>
            </div>

            {/* Upper-right: map */}
            <div className={`ppe-upper-col ppe-map ${combinedErrors?.latitude || combinedErrors?.longitude ? "invalid" : ""}`}>
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
                  className={`pie-textarea ppe-textarea ${combinedErrors?.descriptionMarkdown ? "invalid" : ""}`}
                  placeholder="Write the place description in Markdown..."
                  value={value.descriptionMarkdown}
                  onChange={(e) => onChange({ ...value, descriptionMarkdown: e.target.value })}
                  onBlur={handleBlurField}
                  disabled={disabled}
                />
                {combinedErrors?.descriptionMarkdown ? <div className="pie-error">{combinedErrors.descriptionMarkdown}</div> : null}
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
                onClick={handleSubmitClick}
              >
                Submit
              </button>
            </div>
          </div>

        </div>

        {/* <div className="ppe-right">
          <div style={{ fontSize: 13, marginBottom: 8 }}>JSON preview (debug)</div>
          <pre className="ppe-json">{JSON.stringify(value, null, 2)}</pre>
        </div> */}
      </div>
    </>
  );
}