'use client'; // ブラウザでのみ動作するインタラクティブなロジックを含むため、クライアントコンポーネントとして指定

import React, { useEffect, useRef } from "react";
import L from "leaflet";

/**
 * Leafletマップを表示するための専用コンポーネント
 * マップの初期化とクリーンアップのロジックをカプセル化する
 * @param {object} props
 * @param {function} props.onMapLoad
 */
export default function Map({onMapLoad}) {
    const MapContainerRef = useRef(null);

    useEffect(() => {
        // LeafletオブジェクトLがインポートされたモジュールとして利用できる
        if (MapContainerRef.current) {
            // マップの初期化にmapContainerRefが参照するDOM要素を使用
            const map = L.map(MapContainerRef.current).setView([35.5117, 139.4754], 15);
            const gsi_std_tile = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";

            const tile_layer = L.tileLayer(gsi_std_tile, {
                attribution: '出典: <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>',
            }).addTo(map);


            if (onMapLoad) {
                // これにより、コンテナのサイズが確定した後、マップ全体が再描画される
                // map.invalidateSize();
                onMapLoad(map);
            }
            

            // クリーンアップ関数：コンポーネントがアンマウントされる際にマップオブジェクトを解除し、メモリリークを防ぐ
            return () => {
                map.remove();
            };
        }
    }, [onMapLoad]); 


    // マップがレンダリングされるコンテナ要素を返す。
    return (
        <div
            ref={MapContainerRef}
            style = {{height: '100%', width: '100%'}}
        />
    );
}