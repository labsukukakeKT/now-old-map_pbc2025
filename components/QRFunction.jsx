
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRFunction = ({ url, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                maxWidth: '90%',
            }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>QR Code</h3>
                <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
                    <QRCodeSVG value={url} size={200} />
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#666', wordBreak: 'break-all', textAlign: 'center', maxWidth: '250px' }}>
                    {url}
                </p>
                <button
                    onClick={onClose}
                    style={{
                        padding: '8px 24px',
                        backgroundColor: '#f5f5f5',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: '#333'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default QRFunction;
