'use client'
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import YearSlider from "@/components/YearSlider";
import LocationDetail from "@/components/LocationDetail";
import PostButton from '@/components/PostButton'
import HunbergerButton from "@/components/HunbergerButton";

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

  // マーカークリック時の処理
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsSlidebarOpen(true); // サイドバーを自動で開く
  };
  const toggleMapLayer = () => {
    setIsSatellite(!isSatellite);
  };


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


      {/* Sidebar Container */}
      <div style={{
        position: 'absolute',
        width: slidebar_width,
        height: 'calc(100% - 80px)',
        zIndex: 10,
        // overflowY: 'hidden', // Stop entire sidebar from scrolling
        backgroundColor: '#f9f9f9',
        padding: 0,
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Fixed Top Section: Buttons */}
        <div style={{
          flex: '0 0 auto',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* Size and alignment wrappers can be adjusted as needed */}
          <HunbergerButton onClick={toggleSidebar} />

          <button
            onClick={toggleMapLayer}
            style={{
              width: '60px',
              height: '60px',
              fontWeight: 'bold',
              fontSize: '12px',
              cursor: 'pointer',
              // make sure it doesn't get squashed
              flexShrink: 0
            }}
          >
            {isSatellite ? '標準地図' : '航空写真'}
          </button>
        </div>


        {/* Scrollable Content Section */}
        <div style={{
          flex: '1 1 auto',   // Fill remaining space
          minHeight: 0,       // Crucial for nested flex scrolling
          overflowY: isSlidebarOpen ? 'auto' : 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {isSlidebarOpen && (
            <>
              <div style={{
                padding: '10px',
                // overflowY is handled by parent div now
                // flexGrow: 1 // No longer needed here if parent scrolls
              }}>
                <LocationDetail location={selectedLocation} />
              </div>

              <div className="mb-8" style={{ padding: '0 10px' }}>
                <PostButton locations={selectedLocation} />
              </div>
            </>
          )}
        </div>

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
          <Map isSatellite={isSatellite}>
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