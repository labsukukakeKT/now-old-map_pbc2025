'use client';
import { useEffect, useRef } from 'react';
import { MapContext } from './MapContext';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Children } from 'react';

export default function Map({ children }) {
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const container_id = 'map';
    

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map(container_id).setView([35.5117, 139.4754], 15);
        }

        // 初回だけレイヤーをつくる
        if (!layerRef.current) {
            layerRef.current = L.tileLayer(tile_url, {
                attribution: '出典: <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
            }).addTo(mapRef.current);
            return;
        }
        

        // tile_layerが変更された場合、レイヤーを更新
        layerRef.current.setUrl(tile_url);


    }, []);


    
    return (
        <MapContext.Provider value={{ mapRef, layerRef }}>
            <div id={container_id} style={{ height: '100%', width: '100%' }}>
                {children}

            </div>
        </MapContext.Provider>
    );
}
