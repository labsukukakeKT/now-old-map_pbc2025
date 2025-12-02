'use client';
import { useEffect } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
    const DEFAULT_TILE = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
    useEffect(() => {
        const map = L.map("map").setView([35.5117, 139.4754], 15);
        L.tileLayer(DEFAULT_TILE, {
            attribution: '出典: <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
        }).addTo(map);
        
        // クリーンアップ
        return () => {
            map.remove();
        }
    }, []);

    return <div id="map" style={{ height: '100%', width: '100%' }}></div>;
}
