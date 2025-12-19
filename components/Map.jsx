'use client';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ children, isSatellite }) {
  const tileLayerUrl = isSatellite
    ? 'https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg'
    : 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png';

  return (
    <MapContainer center={[35.5117, 139.4754]} zoom={15} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        url={tileLayerUrl}
      />
      {children}
    </MapContainer>
  );
}
