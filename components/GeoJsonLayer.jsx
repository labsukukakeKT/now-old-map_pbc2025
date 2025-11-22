'use client';

import React, { useEffect } from "react";
import L from 'leaflet';


/**
 * 
 * @param {object} props
 * @param {L.Map | null} props.map - Leafletマップインスタンス 
 * @param {object} props.geojson - 描画するGeoJSONデータ
 */
export default function GeoJsonLayer({map, geojson}) {
    useEffect(() => {
        if (map && geojson) {
            const layer = L.geoJSON(geojson, {
                // スタイル関数：ポリゴンの見た目を定義
                style: function (feature) {
                    return {
                        color: "#0056b3",
                        weight: 3,
                        opacity: 0.9,
                        fillColor: "#4dabf5",
                        fillOpacity: 0.3
                    }
                }
            }).addTo(map);

            return () => {
                map.removeLayer(layer);
            };
        }
    }, [map, geojson]);

    return null;
}