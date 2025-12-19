'use client'
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
});

const MarkerLayer = dynamic(() => import("@/components/MarkerLayer"), {
    ssr: false,
});



// サイドバーの幅
const SLIDEBAR_OPNE_WIDTH = '400px';
const SLIDEBAR_CLOSED_WIDTH = '80px';

// 地図のURL
// const TOPO_TILE_URL = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
// const PHOTO_TILE_URL = "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg";

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
    

    // 地形図/航空写真の切り替え
    // const [isTopoMap, setIsTopleMap] = useState(true);
    // function toggleTopoMap() {
    //     setIsTopleMap(!isTopoMap);
    // };
    // let tile_url;
    // if (isTopoMap) {
    //     tile_url = TOPO_TILE_URL;
    // } else {
    //     tile_url = PHOTO_TILE_URL;
    // }


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
                <button onClick={toggleSidebar} style={{
                    width: '60px',
                    height: '40px',
                    margin: '10px'
                }}>
                    Click Me
                </button>

                
                {/* サイドバーのコンテンツ */}
                {isSlidebarOpen && (
                    <div style={{
                        padding: '10px',
                        overflowY: 'auto',
                        flexGrow: 1
                    }}>
                        <h2 style={{fontSize: '18px', marginBottom: '15px'}}>場所リスト</h2>
                        
                        {/* 場所リスト */}
                        <div style={{marginBottom: '20px'}}>
                            {safeLocations.map((loc) => (
                                <div 
                                    key={loc.id}
                                    onClick={() => setSelectedLocation(loc)}
                                    style={{
                                        padding: '10px',
                                        marginBottom: '10px',
                                        backgroundColor: selectedLocation?.id === loc.id ? '#e3f2fd' : '#fff',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedLocation?.id !== loc.id) {
                                            e.currentTarget.style.backgroundColor = '#f5f5f5';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedLocation?.id !== loc.id) {
                                            e.currentTarget.style.backgroundColor = '#fff';
                                        }
                                    }}
                                >
                                    <strong style={{display: 'block', marginBottom: '5px'}}>{loc.title}</strong>
                                    {loc.eraStart && (
                                        <small style={{color: '#666'}}>
                                            {loc.eraStart}年 {loc.eraEnd && loc.eraEnd !== 9999 ? `- ${loc.eraEnd}年` : ''}
                                        </small>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 選択された場所の詳細 */}
                        {selectedLocation && (
                            <div style={{
                                marginTop: '20px',
                                padding: '15px',
                                backgroundColor: '#f9f9f9',
                                border: '2px solid #2196F3',
                                borderRadius: '8px'
                            }}>
                                <h3 style={{fontSize: '16px', marginBottom: '10px', color: '#2196F3'}}>
                                    {selectedLocation.title}
                                </h3>
                                
                                {/* 画像表示エリア */}
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '5px',
                                    marginBottom: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999'
                                }}>
                                    {/* TODO: 画像URLを追加したらここに表示 */}
                                    画像エリア
                                </div>

                                {/* 説明文 */}
                                <div style={{marginBottom: '10px'}}>
                                    <strong>概要:</strong>
                                    <p style={{margin: '5px 0', color: '#555'}}>
                                        {selectedLocation.abst || '説明なし'}
                                    </p>
                                </div>

                                {selectedLocation.detail && (
                                    <div>
                                        <strong>詳細:</strong>
                                        <p style={{margin: '5px 0', color: '#555'}}>
                                            {selectedLocation.detail}
                                        </p>
                                    </div>
                                )}

                                <div style={{marginTop: '10px', fontSize: '12px', color: '#888'}}>
                                    座標: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                                </div>
                            </div>
                        )}
                    </div>
                )}


            </div>


            {/* マップエリア */}
            <div style={{
                gridColumn: '2 / 3',
                width: '100%',
                height: '100%',
                zIndex: 0,
                position: 'relative',
            }}>
                <Map>
                    <MarkerLayer locations={locations} />
                </Map>
            </div>
        </main>
    );
}