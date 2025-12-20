"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PlaceSelection() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    function onPlaceSelected(e: any) {
      const d = e?.detail;
      if (d && d.lat != null && d.lng != null) {
        setPos({ lat: Number(d.lat), lng: Number(d.lng) });
      } else {
        setPos(null);
      }
    }
    window.addEventListener("place-selected", onPlaceSelected);
    return () => window.removeEventListener("place-selected", onPlaceSelected);
  }, []);

  function onCancel() {
    // cancel selection mode and close sidebar
    window.dispatchEvent(new Event("cancel-place-selection"));
    window.dispatchEvent(new Event("close-sidebar"));
  }

  function onConfirm() {
    if (!pos) return;
    // navigate to create-place with lat/lng
    router.push(`/create-place?lat=${encodeURIComponent(pos.lat)}&lng=${encodeURIComponent(pos.lng)}`);
    // cleanup selection mode and close sidebar
    window.dispatchEvent(new Event("cancel-place-selection"));
    window.dispatchEvent(new Event("close-sidebar"));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 style={{ margin: 0 }}>Create new place</h3>
      <p style={{ margin: 0 }}>Please click on the map to choose the place you want to create.</p>

      <div style={{ minHeight: 44, display: "flex", alignItems: "center", color: "#333" }}>
        Selected: {pos ? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}` : "None"}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={!pos}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "none",
            color: "#fff",
            background: pos ? "linear-gradient(180deg,#0b5fff 0%,#0061e0 100%)" : "#cbd7ff",
            cursor: pos ? "pointer" : "not-allowed",
            fontWeight: 600,
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
