'use client'
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, Suspense } from "react";
import YearSlider from "@/components/YearSlider";
import LocationDetail from "@/components/LocationDetail";
import PostButton from '@/components/PostButton'
import SideBar from "@/components/SideBar";
import TileLoader from "@/utils/tileloader";

const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
});

const MarkerLayer = dynamic(() => import("@/components/MarkerLayer"), {
    ssr: false,
});



// サイドバーの幅
const SLIDEBAR_OPNE_WIDTH = '400px';
const SLIDEBAR_CLOSED_WIDTH = '80px';


export default function Home() {
    // 場所データを保持するステート
    const [locations, setLocations] = useState([]);
    // マウント時にAPIからデータの取得
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/locations');
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                const data = await response.json();
                console.log('[fetchLocations] raw data:', data);
                if (Array.isArray(data)) {
                    console.log('[fetchLocations] data is array, length:', data.length);
                    setLocations(data);
                } else if (Array.isArray(data?.locations)) {
                    // API が { locations: [...] } の場合にも対応
                    console.log('[fetchLocations] data.locations is array, length:', data.locations.length);
                    setLocations(data.locations);
                } else {
                    console.log('[fetchLocations] data is neither array nor has locations property');
                    setLocations([]);
                }
            } catch (error) {
                console.error('fetch locations error', error);
                setLocations([]);
            }
        };
        fetchLocations();
    }, [])
    const [isSatellite, setIsSatellite] = useState(false);
    // 配列でなければ空配列にフォールバック
    const safeLocations = Array.isArray(locations) ? locations : [];


    // 選択された場所の管理
    const [selectedLocation, setSelectedLocation] = useState(null);

    // スライドバーの状態管理
    const [selectedYear, setSelectedYear] = useState(2025);

    // 地図タイルの管理
    const [tileLoader, setTileLoader] = useState(null);

    // マーカークリック時の処理
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        window.dispatchEvent(new CustomEvent("open-sidebar", { detail: { pane: "detail" } }));
    };
    const toggleMapLayer = () => {
        setIsSatellite(!isSatellite);
    };


    // TileLoaderの初期化
    useEffect(() => {
        const loader = new TileLoader(
            ["/tiles/topo_tile.json", "/tiles/photo_tile.json", "/tiles/kjmap_tile.json", "tiles/gsi_standard_tile.json"]
        );

        // すべてのJSON読み込みが完了したらコンストラクタ2を実行
        Promise.all(loader.data_promise).then(() => {
            loader.constructor2();
            setTileLoader(loader);
        });
    }, []);

    // TileLoaderを使ってURLを決定
    const mapData = useMemo(() => {
        if (!tileLoader) return null;

        // isSatelliteがtrueなら 'photo'、falseなら 'topo' を渡す
        const type = isSatellite ? "photo" : "topo";
        // 現在の緯度経度は必要に応じて渡してください（kjmap用）
        return tileLoader.GetUrl(selectedYear, type);
    }, [tileLoader, selectedYear, isSatellite]);

    // track sidebar open state (width provided by SideBar)
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(80);

    // compact mode (portrait or small width)
    const [isCompact, setIsCompact] = useState(false);
    useEffect(() => {
        const mqPortrait = window.matchMedia('(orientation: portrait)');
        const mqNarrow = window.matchMedia('(max-width: 720px)');
        function handle() {
            setIsCompact(mqPortrait.matches || mqNarrow.matches);
        }
        handle();
        mqPortrait.addEventListener('change', handle);
        mqNarrow.addEventListener('change', handle);
        return () => {
            mqPortrait.removeEventListener('change', handle);
            mqNarrow.removeEventListener('change', handle);
        };
    }, []);

    useEffect(() => {
        function onSidebarState(e) {
            const d = e?.detail ?? {};
            setSidebarOpen(Boolean(d.open));
            if (typeof d.width === "number") setSidebarWidth(d.width);
        }
        window.addEventListener("sidebar-state", onSidebarState);
        return () => window.removeEventListener("sidebar-state", onSidebarState);
    }, []);


    return (
        <main style={{
            display: 'grid',
            height: '100%',
            width: '100%',
            gridTemplateColumns: isCompact ? `0 1fr` : `${SLIDEBAR_CLOSED_WIDTH} 1fr`,
            overflow: 'hidden',
        }}>

            {/* Left slim column: mount SideBar (portal). SideBar renders the fixed hamburger. */}
            <div style={{
                width: isCompact ? '0px' : SLIDEBAR_CLOSED_WIDTH,
                height: '100%',
                zIndex: 10,
                backgroundColor: '#f9f9f9',
                padding: isCompact ? 0 : 8,
                display: isCompact ? 'none' : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                pointerEvents: isCompact ? 'none' : 'auto',
            }}>
                <SideBar location={selectedLocation} />
            </div>

            {/* マップとスライダーのエリア */}
            <div style={{
                gridColumn: '2 / 3',
                width: '100%',
                height: '100%',
                zIndex: 0,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column', // 上下に並べる
            }}>

                <div style={{
                    width: '100%',
                    paddingLeft: isCompact ? '0px' : SLIDEBAR_OPNE_WIDTH, // 左側にサイドバー分の余白
                    boxSizing: 'border-box', // paddingを含めた幅計算にする
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #ddd',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex', // 横並びにする
                    alignItems: 'center', // 上下中央揃え
                    justifyContent: 'flex-end', // 右寄せ
                    paddingRight: '10px', // 右端に少し余白
                    gap: '20px', // ボタンとスライダーの間隔
                    height: '80px', // 全体の高さ
                }}>
                    <button
                        onClick={toggleMapLayer}
                        aria-label="Toggle satellite"
                        style={{
                            minWidth: '80px',
                            height: '40px',
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: 'pointer',
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid #ddd',
                            background: isSatellite ? '#eef4ff' : '#fff',
                            flexShrink: 0,
                        }}
                    >
                        {isSatellite ? '標準' : '航空'}
                    </button>

                    <div style={{
                        flexGrow: 1, // 残りのスペースを使う
                        position: 'relative',
                    }}>
                        <YearSlider onChange={setSelectedYear} />
                    </div>
                </div>


                {/* マップエリア */}
                <div style={{
                    flexGrow: 1, // 残りの高さをすべて使う
                    width: '100%',
                    position: 'relative',
                    zIndex: 0,
                }}>
                    {/* URL引数(緯度経度)からの非同期読み込み、useSearchParamsを使うためのおまじない */}
                    <Suspense fallback={<div>Loading...</div>}>
                        <Map isSatellite={isSatellite} tileUrl={mapData?.url} >
                            <MarkerLayer
                                locations={locations}
                                selectedYear={selectedYear}
                                onLocationSelect={handleLocationSelect}
                            />
                        </Map>
                    </Suspense>
                </div>
            </div>
        </main>
    );
}