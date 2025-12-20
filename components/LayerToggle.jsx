"use client";
import React from "react";

export default function LayerToggle({ isSatellite, onChange, isCompact = false }) {
  return (
    <div
      role="tablist"
      aria-label="Map layer toggle"
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        aspectRatio: "2 / 1",
        height: isCompact ? 48 : 40,
        borderRadius: 9999,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <button
        onClick={() => onChange(false)}
        aria-pressed={!isSatellite}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          border: "none",
          background: !isSatellite ? "#0b5cff" : "transparent",
          color: !isSatellite ? "#fff" : "rgba(0,0,0,0.65)",
          height: "100%",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 6l6-2 6 2 6-2v13l-6 2-6-2-6 2V6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={() => onChange(true)}
        aria-pressed={isSatellite}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          border: "none",
          background: isSatellite ? "#0b5cff" : "transparent",
          color: isSatellite ? "#fff" : "rgba(0,0,0,0.65)",
          height: "100%",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M21 3l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 21l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
