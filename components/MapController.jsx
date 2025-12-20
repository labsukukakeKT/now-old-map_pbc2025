
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapController({ location }) {
    const map = useMap();

    useEffect(() => {
        if (location && location.lattitude && location.longitude) {
            map.flyTo([location.lattitude, location.longitude], 16, {
                duration: 1.5
            });
        } else if (location && location.lat && location.lng) {
            // Fallback for potentially different property names if any
            map.flyTo([location.lat, location.lng], 16, {
                duration: 1.5
            });
        }
    }, [location, map]);

    return null;
}
