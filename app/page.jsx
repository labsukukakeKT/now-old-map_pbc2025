'use client';
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import YearSlider from "@/components/YearSlider";
import LocationDetail from "@/components/LocationDetail";
import PostButton from '@/components/PostButton'

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const MarkerLayer = dynamic(() => import("@/components/MarkerLayer"), {
  ssr: false,
});

const SLIDEBAR_OPEN_WIDTH = '400px';
const SLIDEBAR_CLOSED_WIDTH = '80px';

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        setLocations(Array.isArray(data) ? data : data.locations || []);
      } catch (err) {
        console.error('Failed to fetch locations', err);
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  const toggleSidebar = () => setIsSlidebarOpen(!isSlidebarOpen);
  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setIsSlidebarOpen(true);
  };

  const toggleMapLayer = () => setIsSatellite(!isSatellite);
  const tileLayerUrl = isSatellite
    ? "https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg"
    : "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";

  const slidebarWidth = isSlidebarOpen ? SLIDEBAR_OPEN_WIDTH : SLIDEBAR_CLOSED_WIDTH;

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
        width: slidebarWidth,
        height: 'calc(100% - 80px)',
        zIndex: 10,
        overflowY: isSlidebarOpen ? 'auto' : 'hidden',
        backgroundColor: '#f9f9f9',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px'
      }}>
        {/* Click Me ボタン */}
        <button onClick={toggleSidebar} style={{
          width: '60px',
          height: '40px',
          marginBottom: '10px'
        }}>
          Click Me
        </button>

        {/* 地図切り替えボタン */}
        <button onClick={toggleMapLayer} style={{
          padding: '6px 10px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          {isSatellite ? '標準地図' : '航空写真'}
        </button>

        {/* 詳細情報パネル */}
        {isSlidebarOpen && (
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            <LocationDetail location={selectedLocation} />
          </div>
        )}
      </div>

      {/* メインビュー */}
      <div style={{
        gridColumn: '2 / 3',
        width: '100%',
        height: '100%',
        zIndex: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* スライダー */}
        <div style={{
          height: '70px',
          width: '75%',
          marginLeft: 'auto',
          backgroundColor: '#fff',
          borderBottom: '1px solid #ddd',
          paddingTop: '30px',
        }}>
          <YearSlider onChange={setSelectedYear} />
        </div>

        {/* 地図 */}
        <div style={{ flexGrow: 1, width: '100%', position: 'relative' }}>
          <Map tileLayerUrl={tileLayerUrl}>
            <MarkerLayer locations={locations} onLocationSelect={handleLocationSelect} />
          </Map>
        </div>
      </div>
    </main>
  );
}
