'use client'
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import YearSlider from "@/components/YearSlider";
import LocationDetail from "@/components/LocationDetail";
import PostButton from '@/components/PostButton'

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
const MarkerLayer = dynamic(() => import("@/components/MarkerLayer"), { ssr: false });

const SLIDEBAR_OPEN_WIDTH = '400px';
const SLIDEBAR_CLOSED_WIDTH = '80px';

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [isSatellite, setIsSatellite] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        if (Array.isArray(data)) {
          setLocations(data);
        } else if (Array.isArray(data?.locations)) {
          setLocations(data.locations);
        } else {
          setLocations([]);
        }
      } catch (err) {
        console.error('fetch error', err);
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsSlidebarOpen(true);
  };

  const toggleMapLayer = () => {
    setIsSatellite(!isSatellite);
  };

  const slidebarWidth = isSlidebarOpen ? SLIDEBAR_OPEN_WIDTH : SLIDEBAR_CLOSED_WIDTH;

  return (
    <main style={{
      display: 'grid',
      height: '100%',
      width: '100%',
      gridTemplateColumns: `${SLIDEBAR_CLOSED_WIDTH} 1fr`,
      overflow: 'hidden',
    }}>
      
      {/* 固定位置のボタン */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <button
          onClick={() => setIsSlidebarOpen(!isSlidebarOpen)}
          style={{
            width: '60px',
            height: '60px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Click Me
        </button>
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

      {/* サイドバー */}
      <div style={{
        position: 'absolute',
        width: slidebarWidth,
        height: 'calc(100% - 80px)',
        zIndex: 10,
        overflowY: isSlidebarOpen ? 'auto' : 'hidden',
        backgroundColor: '#f9f9f9',
        padding: 0,
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {isSlidebarOpen && (
          <div style={{ padding: '10px', overflowY: 'auto', flexGrow: 1 }}>
            <LocationDetail location={selectedLocation} />
          </div>
        )}
      </div>

      {/* 地図とスライダー */}
      <div style={{
        gridColumn: '2 / 3',
        width: '100%',
        height: '100%',
        zIndex: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          height: '60px',
          width: '60%',
          marginLeft: 'auto',
          backgroundColor: '#fff',
          borderBottom: '1px solid #ddd',
          paddingTop: '30px',
        }}>
          <YearSlider onChange={setSelectedYear} />
        </div>

        <div style={{
          flexGrow: 1,
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

