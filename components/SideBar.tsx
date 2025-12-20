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
  const [isCompact, setIsCompact] = useState(false);

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
    // responsive: compact mode for portrait or narrow widths
    const mqPortrait = window.matchMedia("(orientation: portrait)");
    const mqNarrow = window.matchMedia("(max-width: 720px)");
    function handleMq() {
      setIsCompact(mqPortrait.matches || mqNarrow.matches);
    }
    handleMq();
    mqPortrait.addEventListener("change", handleMq);
    mqNarrow.addEventListener("change", handleMq);
    return () => {
      window.removeEventListener("open-sidebar", onOpenSidebar as any);
      window.removeEventListener("close-sidebar", onCloseSidebar);
      window.removeEventListener("toggle-sidebar", onToggleSidebar);
      window.removeEventListener("open-place-selection", onOpenPlaceSelection);
      mqPortrait.removeEventListener("change", handleMq);
      mqNarrow.removeEventListener("change", handleMq);
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
    // compute width/height signal depending on compact mode
    const width = isCompact ? (open ? window.innerWidth : 0) : open ? OPEN : CLOSED;
    if (mounted) {
      window.dispatchEvent(new CustomEvent("sidebar-state", { detail: { open, width } }));
    }
  }, [open, mounted]);

  if (!mounted) return null;
  const width = isCompact ? (open ? window.innerWidth : 0) : open ? OPEN : CLOSED;

  return createPortal(
    <>
      {/* fixed-position hamburger stays visually in the same spot (hidden in compact mode) */}
      {!isCompact ? (
        <div
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
      ) : null}

      {/* animated sidebar */}
      <aside
        role="complementary"
        aria-hidden={!open}
        style={
          // compact (portrait / small) mode: bottom-up panel with transform-based animation
          isCompact
            ? {
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                // height depends on pane
                height:
                  open && pane === "place-selection"
                    ? "50vh"
                    : open && pane === "detail"
                    ? "calc(100vh - 64px)"
                    : 0,
                background: open ? "#fff" : "transparent",
                borderTop: open ? "1px solid #e6e6e6" : "none",
                boxShadow: open ? "0 -8px 24px rgba(0,0,0,0.12)" : "none",
                zIndex: 1200,
                overflow: "hidden",
                transition: "transform 320ms ease, height 320ms ease",
                display: "flex",
                flexDirection: "column",
                pointerEvents: open ? "auto" : "none",
                transform: open ? "translateY(0)" : "translateY(100%)",
              }
            : {
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
              }
        }
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
            borderBottom: isCompact && open ? "1px solid rgba(0,0,0,0.06)" : "none",
            position: "relative",
          }}
        >
          {open ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {!isCompact && (
                <div style={{ width: BUTTON_SIZE + BUTTON_PADDING, height: 32 }} />
              )}
              <h3 style={{ margin: 0, fontSize: 16 }}>
                {pane === "place-selection" ? "Create new place" : "Location detail"}
              </h3>
              {!isCompact && pane !== "place-selection" && <QRButton location={location} />}
            </div>
          ) : null}

          {/* compact mode: always show top-right close X when expanded */}
          {isCompact && open ? (
            <button
              onClick={() => window.dispatchEvent(new Event("close-sidebar"))}
              aria-label="Close"
              style={{
                position: "absolute",
                right: 8,
                top: 8,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
                <path d="M6 6L18 18M6 18L18 6" stroke="#333" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>

        {/* content area with fade/slide in */}
        <div
          style={{
            flex: 1,
            padding: 12,
            overflow: "auto",
            // in compact mode animate with translateY and keep content scrollable separately
            opacity: open ? 1 : 0,
            transform: isCompact ? (open ? "translateY(0)" : `translateY(8px)`) : open ? "translateX(0)" : `translateX(-8px)`,
            transition: "opacity 240ms ease, transform 240ms ease",
            pointerEvents: open ? "auto" : "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {pane === "place-selection" ? (
            <PlaceSelection />
          ) : (
            <LocationDetail location={location} />
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}
