"use client";
import L from "leaflet";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import CreatePlaceButton from "./CreatePlaceButton";
import SideBar from "./SideBar";

// カスタムアイコンを定義
const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MarkerLayer({ locations = [], onLocationSelect }) {
  const router = useRouter();
  const [selectedPos, setSelectedPos] = useState(null); // [lat, lng] or null
  const [mapEl, setMapEl] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);

  // map event handler: only allow selecting empty-space when selectionMode is true
  const map = useMapEvents({
    click: (e) => {
      const clickPoint = map.latLngToContainerPoint(e.latlng);
      // find if any existing marker is within ~18px
      const hit = (locations || []).some((loc) => {
        const lat = Number(loc.latitude ?? loc.lattitude ?? loc.lat);
        const lng = Number(loc.longitude ?? loc.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
        const pt = map.latLngToContainerPoint([lat, lng]);
        const dx = clickPoint.x - pt.x;
        const dy = clickPoint.y - pt.y;
        return Math.sqrt(dx * dx + dy * dy) <= 18;
      });

      if (!hit && selectionMode) {
        const lat = Number(e.latlng.lat);
        const lng = Number(e.latlng.lng);
        setSelectedPos([lat, lng]);
        // notify other components (PlaceSelection) of selection
        window.dispatchEvent(new CustomEvent("place-selected", { detail: { lat, lng } }));
      } else if (!selectionMode) {
        // not in selection mode: clicking on empty space clears temp selection
        setSelectedPos(null);
      } else {
        // clicked near existing marker while in selection mode -> clear selection
        setSelectedPos(null);
        window.dispatchEvent(new CustomEvent("place-selected", { detail: null }));
      }
    },
    move: () => {},
  });

  // attach map DOM container for portal once available
  useEffect(() => {
    if (!map) return;
    try {
      setMapEl(map.getContainer());
    } catch {
      setMapEl(null);
    }
  }, [map]);

  // listen for global events to open/cancel selection mode
  useEffect(() => {
    function onOpenPlaceSelection() {
      setSelectionMode(true);
      setSelectedPos(null);
      // ensure sidebar opens (SideBar listens for this too)
      window.dispatchEvent(new CustomEvent("open-sidebar", { detail: { pane: "place-selection" } }));
    }
    function onCancelPlaceSelection() {
      setSelectionMode(false);
      setSelectedPos(null);
      window.dispatchEvent(new CustomEvent("place-selected", { detail: null }));
    }
    function onCloseSidebar() {
      // when sidebar closes, exit selection mode
      setSelectionMode(false);
    }

    window.addEventListener("open-place-selection", onOpenPlaceSelection);
    window.addEventListener("cancel-place-selection", onCancelPlaceSelection);
    window.addEventListener("close-sidebar", onCloseSidebar);

    return () => {
      window.removeEventListener("open-place-selection", onOpenPlaceSelection);
      window.removeEventListener("cancel-place-selection", onCancelPlaceSelection);
      window.removeEventListener("close-sidebar", onCloseSidebar);
    };
  }, []);

  // handler passed to CreatePlaceButton: start the place-selection flow (no redirect)
  function handleCreateHere() {
    // trigger selection mode and open sidebar with PlaceSelection content
    window.dispatchEvent(new Event("open-place-selection"));
  }

  const selectedIcon = useMemo(() => {
    try {
      return L.icon({
        iconUrl: '/marker-icon.png',
        iconSize: [28, 36],
        iconAnchor: [14, 36],
      });
    } catch {
      return customIcon;
    }
  }, []);

  // ensure we fetch full details if description is missing
  async function handleMarkerClick(loc) {
    if (!onLocationSelect) return;

    // if description already present, just forward and open sidebar
    if (loc.place_description || loc.description || loc.details) {
      onLocationSelect(loc);
      // open sidebar immediately for detail pane
      window.dispatchEvent(new CustomEvent("open-sidebar", { detail: { pane: "detail" } }));
      return;
    }

    const id = loc.place_id ?? loc.id;
    if (!id) {
      onLocationSelect(loc);
      window.dispatchEvent(new CustomEvent("open-sidebar", { detail: { pane: "detail" } }));
      return;
    }

    // try a couple of likely endpoints for details
    const candidates = [`/api/places/${id}`, `/api/locations/${id}`];

    try {
      let data = null;
      for (const ep of candidates) {
        // attempt fetch; skip non-ok
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(ep);
        if (res.ok) {
          // eslint-disable-next-line no-await-in-loop
          data = await res.json();
          break;
        }
      }
      const merged = data ? { ...loc, ...data } : loc;
      onLocationSelect(merged);
      // open sidebar with detail pane immediately
      window.dispatchEvent(new CustomEvent("open-sidebar", { detail: { pane: "detail" } }));
    } catch (err) {
      // on any error, fall back to original object and still open sidebar
      onLocationSelect(loc);
      window.dispatchEvent(new CustomEvent("open-sidebar", { detail: { pane: "detail" } }));
    }
  }

  return (
    <>
      <MarkerClusterGroup>
        {(locations || []).map((loc) => {
          const lat = loc.latitude ?? loc.lattitude ?? loc.lat;
          const lng = loc.longitude ?? loc.lng;

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            return null;
          }

          return (
            <Marker
              key={loc.place_id ?? loc.id}
              position={[lat, lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  // use the fetch-aware handler
                  void handleMarkerClick(loc);
                },
              }}
            >
              <Popup>
                <strong>{loc.place_name}</strong>
                <br />
                {loc.place_description ?? loc.description ?? "No description"}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {/* render temporary selected marker (from empty-space click) */}
      {selectedPos ? <Marker position={selectedPos} icon={selectedIcon} /> : null}

      {/* portaled CTA button inside the map container (bottom-right) */}
      {mapEl &&
        createPortal(
          <div
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              zIndex: 9999,
              display: "flex",
              gap: 8,
              alignItems: "center",
              pointerEvents: "auto",
              fontFamily: "sans-serif",
            }}
          >
            {/* CreatePlaceButton triggers handleCreateHere (clear removed) */}
            <CreatePlaceButton disabled={false} onCreate={handleCreateHere} />
          </div>,
          mapEl
        )}
    </>
  );
}
