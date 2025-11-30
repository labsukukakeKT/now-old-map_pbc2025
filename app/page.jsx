'use client';

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import GeoJsonLayer from "../components/GeoJsonLayer";

// const JSON_URL = "../public/data_geojson/66_東京.geojson";
const JSON_URL = "/data_geojson/66_東京.geojson";


// Mapコンポーネントではleafletを使っているため動的インポートが必要
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


export default function Home() {
    // マップインスタンスとGeoJsonデータを保持するState
    const [mapInstance, setMapInstance] = useState(null);
    const [geojson, setGeoJson] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // GeoJsonを非同期で読み込むロジック
    useEffect(() => {
        async function fetchGeoJson() {
            try {
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
        // 画面の高さいっぱいまで広げるコンテナ
        <main style={{ width: '100vw', height: '100vh', margin: 0, padding: 0}}>
            <div style={{
                display: 'grid',
                height: '100%',
                width: '100%',
                gridTemplateColumns: '400px 1fr', // 左右に分割
                overflow: 'hidden', // スクロール防止
                // border: '5px solid red'
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
                    <Map onMapLoad={setMapInstance}/>
                    {/* マップとgeojsonが揃ったらレンダリング */}
                    {mapInstance && geojson && (
                        <GeoJsonLayer map={mapInstance} geojson={geojson}/>
                    )}
                </div>
            </div>
        </main>
    );
}