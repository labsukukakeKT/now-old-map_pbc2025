"use client";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

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

    return (
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
                    }
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
    );
}
