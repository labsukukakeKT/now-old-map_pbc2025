'use client';

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapContext } from "./MapContext";

/**
 * マップコンテナコンポーネント
 * Leafletマップを初期化し、子コンポーネントにマップインスタンスを提供する。
 * @param {object} props
 * @param {React.ReactNode} props.children - マップ上で動作する子コンポーネント
 */
export default function Map({ children }) {
    const mapContainerRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);

    // マップの初期化
    useEffect(() => {
        if (mapContainerRef.current && !mapInstance) {
            const map = L.map(mapContainerRef.current).setView([35.5117, 139.4754], 15);
            
            const gsi_std_tile = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
            L.tileLayer(gsi_std_tile, {
                attribution: '出典: <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
            }).addTo(map);

            setMapInstance(map);

            // クリーンアップ
            return () => {
                map.remove();
            };
        }
    }, [mapInstance]);

    return (
        <MapContext.Provider value={mapInstance}>
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}>
                {/* マップインスタンスが準備できたら子要素をレンダリング */}
                {mapInstance ? children : null}
            </div>
        </MapContext.Provider>
    );
}