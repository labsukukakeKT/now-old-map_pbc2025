'use client';
import L from "leaflet";
import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


// Next.jsでLeafletを扱う際のトラブルとして、マーカー画像を認識できない。
// マーカー画像のパスを明示的に指定するようにする。
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src,
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src
})


export default function Map({ children }) {
    return (
        <MapContainer center={[35.5117, 139.4754]} zoom={15} style={{height: '100%', width: '100%'}}>
            <TileLayer
                attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
                url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    );
}
