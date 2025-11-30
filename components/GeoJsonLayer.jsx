'use client';

import React, { useEffect, useContext } from "react";
import L from 'leaflet';
import { MapContext } from "./MapContext";


/**
 * 
 * @param {object} props
 * @param {object} props.geojson - 描画するGeoJSONデータ
 */
export default function GeoJsonLayer({ geojson }) {
    const map = useContext(MapContext);

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