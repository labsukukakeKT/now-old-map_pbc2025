"use client";
import L from "leaflet";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

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

export default function MarkerLayer({ locations, onLocationSelect }) {
  if (!locations || locations.length === 0) {
    return null;
  }

  const router = useRouter();
  const [selectedPos, setSelectedPos] = useState(null); // [lat, lng] or null
  const [mapEl, setMapEl] = useState(null);

  // listen for clicks on the map and decide whether click is near an existing marker
  const map = useMapEvents({
    click: (e) => {
      if (!map) return;
      const clickPoint = map.latLngToContainerPoint(e.latlng);
      // find if any existing marker is within ~18px
      const hit = locations.some((loc) => {
        const lat = Number(loc.latitude ?? loc.lattitude);
        const lng = Number(loc.longitude ?? loc.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
        const pt = map.latLngToContainerPoint([lat, lng]);
        // L.Point has distanceTo; fallback compute manually
        const dx = clickPoint.x - pt.x;
        const dy = clickPoint.y - pt.y;
        return Math.sqrt(dx * dx + dy * dy) <= 18;
      });

      if (!hit) {
        setSelectedPos([e.latlng.lat, e.latlng.lng]);
      } else {
        // clear selection if user clicked an existing marker area
        setSelectedPos(null);
      }
    },
    move: () => {
      // on map move we keep overlay attached; nothing else
    },
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

  // button click navigates to create-place with lat/lng query
  function handleCreateHere() {
    if (!selectedPos) return;
    const [lat, lng] = selectedPos;
    // push to create-place with query params
    router.push(`/create-place?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`);
  }

  // selected icon (slightly different color) — reuse customIcon if you prefer
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

  return (
    <>
      <MarkerClusterGroup>
        {locations.map((loc) => {
          const lat = loc.latitude || loc.lattitude;
          const lng = loc.longitude || loc.lng;

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            return null;
          }

          return (
            <Marker
              key={loc.place_id}
              position={[lat, lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  if (onLocationSelect) {
                    onLocationSelect(loc);
                  }
                },
              }}
            >
              <Popup>
                <strong>{loc.place_name}</strong>
                <br />
                {loc.place_description}
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
            <button
              onClick={() => setSelectedPos(null)}
              disabled={!selectedPos}
              style={{
                background: "transparent",
                border: "1px solid #ddd",
                padding: "8px 10px",
                borderRadius: 8,
                color: "#333",
                cursor: selectedPos ? "pointer" : "not-allowed",
                opacity: selectedPos ? 1 : 0.6,
              }}
              title="Clear selection"
            >
              Clear
            </button>

            <button
              onClick={handleCreateHere}
              disabled={!selectedPos}
              style={{
                background:
                  selectedPos
                    ? "linear-gradient(180deg,#0b5fff 0%,#0061e0 100%)"
                    : "linear-gradient(180deg,#cbd7ff 0%,#b5cfff 100%)",
                color: "#fff",
                border: 0,
                padding: "9px 14px",
                borderRadius: 8,
                cursor: selectedPos ? "pointer" : "not-allowed",
                fontWeight: 600,
                boxShadow: selectedPos ? "0 6px 18px rgba(11,95,255,0.14)" : "none",
              }}
            >
              Create place here
            </button>
          </div>,
          mapEl
        )}
    </>
  );
}
