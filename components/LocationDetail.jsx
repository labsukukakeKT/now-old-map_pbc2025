'use client'

/**
 * 選択された場所の詳細を表示するコンポーネント
 */
export default function LocationDetail({ location }) {
    if (!location) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#999'
            }}>
                <p>地図上のピンをクリックして<br/>場所の詳細を表示</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '2px solid #2196F3',
            margin: '10px'
        }}>
            {/* タイトル */}
            <h3 style={{
                fontSize: '18px',
                marginBottom: '15px',
                color: '#2196F3',
                borderBottom: '2px solid #2196F3',
                paddingBottom: '8px'
            }}>
                {location.place_name || location.title}
            </h3>
            
            {/* 画像表示エリア */}
            <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#e0e0e0',
                borderRadius: '5px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                {location.place_photo_url || location.photoUrl ? (
                    <img 
                        src={location.place_photo_url || location.photoUrl} 
                        alt={location.place_name || location.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    <span style={{ color: '#999' }}>画像なし</span>
                )}
            </div>

            {/* 年代情報 */}
            {(location.place_era_start || location.eraStart) && (
                <div style={{
                    marginBottom: '15px',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '5px'
                }}>
                    <strong style={{ color: '#666' }}>年代: </strong>
                    <span style={{ color: '#333' }}>
                        {location.place_era_start ? new Date(location.place_era_start).getFullYear() : location.eraStart}年
                        {(location.place_era_end || location.eraEnd) && 
                         (location.place_era_end ? new Date(location.place_era_end).getFullYear() : location.eraEnd) !== 9999 && (
                            <> - {location.place_era_end ? new Date(location.place_era_end).getFullYear() : location.eraEnd}年</>
                        )}
                    </span>
                </div>
            )}

            {/* 説明文 */}
            {(location.place_description || location.abst) && (
                <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#555', display: 'block', marginBottom: '8px' }}>
                        説明:
                    </strong>
                    <p style={{
                        margin: 0,
                        color: '#333',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {location.place_description || location.abst}
                    </p>
                </div>
            )}

            {/* 詳細情報 */}
            {(location.detail && location.detail !== location.place_description && location.detail !== location.abst) && (
                <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#555', display: 'block', marginBottom: '8px' }}>
                        詳細:
                    </strong>
                    <p style={{
                        margin: 0,
                        color: '#333',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {location.detail}
                    </p>
                </div>
            )}

            {/* 座標情報 */}
            <div style={{
                fontSize: '12px',
                color: '#888',
                borderTop: '1px solid #eee',
                paddingTop: '10px',
                marginTop: '10px'
            }}>
                <strong>座標: </strong>
                {(location.lattitude || location.lat)?.toFixed(5)}, {(location.longitude || location.lng)?.toFixed(5)}
            </div>
        </div>
    );
}
