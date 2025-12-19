"use client";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export default function MarkerLayer({ locations }) {
  if (!locations) {
    return null;
  }

    return (
        <MarkerClusterGroup>
            {locations.map((loc) => (
                <Marker key={loc.id} position={[loc.lattitude, loc.longitude]}>
                    <Popup>
                        <strong>{loc.place_name}</strong>
                        <br />
                        {loc.place_description}
                    </Popup>
                </Marker>
            ))}
        </MarkerClusterGroup>
    );
}
