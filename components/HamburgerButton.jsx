"use client";
import React from "react";

export default function HamburgerButton({ size = 48 }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        window.dispatchEvent(new Event("toggle-sidebar"));
      }}
      aria-label="Toggle sidebar"
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "1px solid rgba(0,0,0,0.08)",
        padding: 8,
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {/* simple hamburger icon */}
      <svg width={18} height={14} viewBox="0 0 18 14" fill="none" aria-hidden>
        <rect x="0" y="0" width="18" height="2" rx="1" fill="#333" />
        <rect x="0" y="6" width="18" height="2" rx="1" fill="#333" />
        <rect x="0" y="12" width="18" height="2" rx="1" fill="#333" />
      </svg>
    </button>
  );
}