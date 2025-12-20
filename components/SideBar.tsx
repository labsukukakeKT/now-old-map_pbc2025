"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import PlaceSelection from "./PlaceSelection";
import LocationDetail from "./LocationDetail";
import HamburgerButton from "./HamburgerButton";
import QRButton from "./QRButton";

export default function SideBar({ location }: { location: any }) {
  const [open, setOpen] = useState(false);
  const [pane, setPane] = useState<"detail" | "place-selection" | null>(null);

  useEffect(() => {
    function onOpenSidebar(e: any) {
      setOpen(true);
      const p = e?.detail?.pane ?? null;
      setPane(p);
    }
    function onCloseSidebar() {
      setOpen(false);
      setPane(null);
    }
    function onToggleSidebar() {
      setOpen((v) => !v);
    }
    function onOpenPlaceSelection() {
      setOpen(true);
      setPane("place-selection");
    }

    window.addEventListener("open-sidebar", onOpenSidebar as any);
    window.addEventListener("close-sidebar", onCloseSidebar);
    window.addEventListener("toggle-sidebar", onToggleSidebar);
    window.addEventListener("open-place-selection", onOpenPlaceSelection);

    return () => {
      window.removeEventListener("open-sidebar", onOpenSidebar as any);
      window.removeEventListener("close-sidebar", onCloseSidebar);
      window.removeEventListener("toggle-sidebar", onToggleSidebar);
      window.removeEventListener("open-place-selection", onOpenPlaceSelection);
    };
  }, []);

  // ensure we only render portal on client after mount to avoid SSR/CSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // hamburger sizing / padding
  const BUTTON_SIZE = 48; // px
  const BUTTON_PADDING = 8; // px (left/right)
  const CLOSED = BUTTON_SIZE + BUTTON_PADDING * 2;
  const OPEN = 420;

  // broadcast current sidebar state so other UI (top bar) can avoid being covered
  useEffect(() => {
    const width = open ? OPEN : CLOSED;
    // dispatch only after mount to avoid events during SSR
    if (mounted) {
      window.dispatchEvent(new CustomEvent("sidebar-state", { detail: { open, width } }));
    }
  }, [open, mounted]);

  if (!mounted) return null;
  const width = open ? OPEN : CLOSED;

  return createPortal(
    <>
      {/* fixed-position hamburger stays visually in the same spot */}
      <div
        id="hamburger-button-container"
        style={{
          position: "fixed",
          left: BUTTON_PADDING, // fixed 8px left padding
          top: 72,
          zIndex: 1300,
          pointerEvents: "auto",
        }}
      >
        <HamburgerButton size={BUTTON_SIZE} />
      </div>

      {/* animated sidebar */}
      <aside
        role="complementary"
        aria-hidden={!open}
        style={{
          position: "fixed",
          left: 0,
          top: 64,
          height: "calc(100vh - 80px)",
          width: width,
          maxWidth: "100%",
          background: open ? "#fff" : "transparent",
          borderRight: open ? "1px solid #e6e6e6" : "none",
          boxShadow: open ? "8px 0 24px rgba(0,0,0,0.06)" : "none",
          zIndex: 1200,
          overflow: "hidden",
          transition: "width 280ms ease",
          display: "flex",
          flexDirection: "column",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            gap: 8,
            minHeight: 48,
          }}
        >
          {open ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* reserve space equal to hamburger width + one padding so title starts to the right of the button */}
              <div style={{ width: BUTTON_SIZE + BUTTON_PADDING, height: 32 }} />
              <h3 style={{ margin: 0, fontSize: 16 }}>
                {pane === "place-selection" ? "Create new place" : "Location detail"}
              </h3>
              {pane !== "place-selection" && (
                <QRButton location={location} />
              )}
            </div>
          ) : null}
        </div>

        {/* content area with fade/slide in */}
        <div
          style={{
            flex: 1,
            padding: 12,
            overflow: "auto",
            opacity: open ? 1 : 0,
            transform: open ? "translateX(0)" : `translateX(-8px)`,
            transition: "opacity 240ms ease, transform 240ms ease",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          {pane === "place-selection" ? <PlaceSelection /> : <LocationDetail location={location} />}
        </div>
      </aside>
    </>,
    document.body
  );
}
