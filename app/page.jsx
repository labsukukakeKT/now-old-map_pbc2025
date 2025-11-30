'use client';

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const JSON_URL = "/data_geojson/66_東京.geojson";

// Mapコンポーネントを動的にインポートし、SSRを無効にする
const Map = dynamic(
    () => import('../components/Map'),
    {
        ssr: false,
        loading: () => <p style={{ 
            height: '100%',
            width: '100%',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>マップをロード中...</p>
    }
);

// GeoJsonLayerも動的にインポートし、SSRを無効にする
const GeoJsonLayer = dynamic(
    () => import('../components/GeoJsonLayer'),
    { ssr: false }
);

export default function Home() {
    const [geojson, setGeoJson] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // GeoJsonを非同期で読み込む
    useEffect(() => {
        async function fetchGeoJson() {
            try {
                setIsLoading(true);
                const response = await fetch(JSON_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch GeoJSON: ${response.statusText}`);
                }
                const data = await response.json();
                setGeoJson(data);
            } catch(error) {
                console.error("GeoJSON読み込みエラー", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchGeoJson();
    }, []);

    
    return (
        <main style={{ width: '100vw', height: '100vh', margin: 0, padding: 0}}>
            <div style={{
                display: 'grid',
                height: '100%',
                width: '100%',
                gridTemplateColumns: '400px 1fr',
                overflow: 'hidden',
            }}>

                {/* サイドバー */}
                <div style={{
                    gridColumn: '1 / 2',
                    overflowY: 'auto'
                }}>
                    <h1>今昔マップ</h1>
                </div>

                {/* マップエリア */}
                <div style={{
                    gridColumn: '2 / 3',
                    position: 'relative',
                    height: '100%',
                    width: '100%'
                }}>
                    {/* Mapコンポーネントの子としてGeoJsonLayerを配置 */}
                    <Map>
                        {/* geojsonがロードされたらレイヤーを描画 */}
                        {geojson && <GeoJsonLayer geojson={geojson} />}
                    </Map>
                </div>
            </div>
        </main>
    );
}