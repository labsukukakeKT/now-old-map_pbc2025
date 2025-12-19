'use client';
export default function HunbergerButton({ onClick }) {
    return (
        <button onClick={onClick} style={{
                    width: '40px',
                    height: '40px',
                    margin: '20px 20px 10px 20px', // 余白を調整
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around', // 線を均等に配置
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                }}>
            {/* 三本線のデザイン */}
            <span style={{ width: '100%', height: '2px', backgroundColor: '#333', borderRadius: '2px' }}></span>
            <span style={{ width: '100%', height: '2px', backgroundColor: '#333', borderRadius: '2px' }}></span>
            <span style={{ width: '100%', height: '2px', backgroundColor: '#333', borderRadius: '2px' }}></span>
        </button>
    );
}