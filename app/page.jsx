'use client'
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import YearSlider from "@/components/YearSlider";
import LocationDetail from "@/components/LocationDetail";
import PostButton from '@/components/PostButton'
import HunbergerButton from "@/components/HunbergerButton";
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
                if (Array.isArray(data)) {
                    setLocations(data);
                } else if (Array.isArray(data?.locations)) {
                    // API が { locations: [...] } の場合にも対応
                    setLocations(data.locations);
                } else {
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


    // サイドバー開閉の状態の管理
    const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);
    function toggleSidebar() {
        setIsSlidebarOpen(!isSlidebarOpen);
    };
    let slidebar_width;
    if (isSlidebarOpen) {
        slidebar_width = SLIDEBAR_OPNE_WIDTH;
    } else {
        slidebar_width = SLIDEBAR_CLOSED_WIDTH;
    }

    // 選択された場所の管理
    const [selectedLocation, setSelectedLocation] = useState(null);

    // スライドバーの状態管理
    const [selectedYear, setSelectedYear] = useState(2025);

    // 地図タイルの管理
    const [tileLoader, setTileLoader] = useState(null);

    // マーカークリック時の処理
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setIsSlidebarOpen(true); // サイドバーを自動で開く
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


    return (
        <main style={{
            display: 'grid',
            height: '100%',
            width: '100%',
            gridTemplateColumns: `${SLIDEBAR_CLOSED_WIDTH} 1fr`,
            overflow: 'hidden',
        }}>


            {/* サイドバー */}
            <div style={{
                position: 'absolute',
                width: slidebar_width, // 幅を動的に変更
                height: 'calc(100% - 80px)', // ヘッダーバーの分引く
                zIndex: 10,
                overflowY: isSlidebarOpen ? 'auto' : 'hidden',
                backgroundColor: '#f9f9f9',
                padding: 0,
                transition: 'width 0.3s ease', // 開閉アニメーション
                display: 'flex',
                flexDirection: 'column',
            }}>

                {/* サイドバーの開閉ボタン */}
                <HunbergerButton onClick={toggleSidebar} />
                <div>
                    <button
                        onClick={toggleMapLayer}
                        style={{
                            width: '60px',
                            height: '60px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        {isSatellite ? '標準地図' : '航空写真'}
                    </button>
                </div>


                {/* サイドバーのコンテンツ */}
                {isSlidebarOpen && (
                    <div>
                        <div style={{
                            padding: '10px',
                            overflowY: 'auto',
                            flexGrow: 1
                        }}>
                            <LocationDetail location={selectedLocation} />

                        </div>
                        <div className="mb-8">
                            <PostButton locations={selectedLocation} />
                        </div>
                    </div>
                )}



            </div>


            {/* マップとスライドバーのエリア */}
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
                    height: '70px', // Pipsを表示するため少し高めに設定
                    width: '75%',
                    marginLeft: 'auto',
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #ddd',
                    paddingTop: '30px', // ツールチップの重なり防止
                }}>
                    <YearSlider onChange={setSelectedYear} />
                </div>


                {/* マップエリア */}
                <div style={{
                    flexGrow: 1, // 残りの高さをすべて使う
                    width: '100%',
                    position: 'relative',
                    zIndex: 0,
                }}>
                    <Map isSatellite={isSatellite} tileUrl={mapData?.url} >
                        <MarkerLayer
                            locations={locations}
                            onLocationSelect={handleLocationSelect}
                        />
                    </Map>
                </div>
            </div>
        </main>
    );
}