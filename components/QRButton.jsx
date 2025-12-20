
import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react'; // Assuming lucide-react is available as per package.json
import QRFunction from './QRFunction';

const QRButton = ({ location }) => {
    const [showQR, setShowQR] = useState(false);
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && location?.place_id) {
            // Construct URL with placeId query param
            const baseUrl = window.location.origin;
            setUrl(`${baseUrl}?placeId=${location.place_id}`);
        }
    }, [location]);

    if (!location) return null;

    return (
        <>
            <button
                onClick={() => setShowQR(true)}
                title="Show QR Code"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    color: '#555',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <QrCode size={20} />
            </button>

            {showQR && (
                <QRFunction
                    url={url}
                    onClose={() => setShowQR(false)}
                />
            )}
        </>
    );
};

export default QRButton;
