'use client'
import dynamic from "next/dynamic";
import { useState } from "react";

const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
});

// サイドバーの幅
const SLIDEBAR_OPNE_WIDTH = '400px';
const SLIDEBAR_CLOSED_WIDTH = '80px';

// 地図のURL
const TOPO_TILE_URL = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
const PHOTO_TILE_URL = "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg";

export default function Home() {
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
    

    // 地形図/航空写真の切り替え
    const [isTopoMap, setIsTopleMap] = useState(true);
    function toggleTopoMap() {
        setIsTopleMap(!isTopoMap);
    };
    let tile_url;
    if (isTopoMap) {
        tile_url = TOPO_TILE_URL;
    } else {
        tile_url = PHOTO_TILE_URL;
    }




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
                    <div>
                        <div style={{flexGrow: 1}}>
                            これは車輪の発明
                            <br></br>
                            これはサイドバー
                        </div>


                        {/* 地形図/航空写真切り替えボタン */}
                        <button onClick={toggleTopoMap} style={{
                            margin: '10px'
                        }}>
                            {isTopoMap ? '航空写真' : '地形図'}
                        </button>
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
                <Map tile_url={tile_url} />
            </div>
        </main>
    );
}