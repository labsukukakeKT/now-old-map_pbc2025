'use client';
import { useSearchParams } from 'next/navigation';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ children, tileUrl, center = [35.5117, 139.4754], zoom = 15 }) {
  // URL引数から緯度経度を取得
  // 引数がないときのデフォルト値はすずかけ台
  const searchParams = useSearchParams();
  const lat = searchParams.get('lat') || center[0];
  const lng = searchParams.get('lng') || center[1];


  // デフォルトURL（tileUrlがまだ無い時のフォールバック）
  const defaultUrl = 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png';
  const currentUrl = tileUrl || defaultUrl;

  return (
    <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        // URLが切り替わった時にタイルを確実に更新させるためのkey
        key={currentUrl}
        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        url={currentUrl}
      />
      {children}
    </MapContainer>
  );
}