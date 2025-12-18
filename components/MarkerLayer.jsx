"use client";
import { Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

/**
 * 地図上にDatabase上にある観光スポットをレイヤーとして追加する
 */
export default function MarkerLayer({ locations }) {
    if (!locations) {
        return null;
    }

    return (
        <MarkerClusterGroup>
            {locations.map((loc) => (
                <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                    <Popup>
                        <strong>{loc.title}</strong>
                        <br />
                        {loc.abst}
                    </Popup>
                </Marker>
            ))}
        </MarkerClusterGroup>
    );
}
