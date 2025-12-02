// import Script from "next/script";

export const metadata = {
    title: '今昔マップ',
    description: 'This is a application that overlooks now and old maps / aerial photos.'
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <head>
                {/* ライブラリの追加があればここに書く */}
                {/* <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" /> */}
                {/* <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" /> */}
                {/* <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" /> */}
            </head>
            <body style={{margin: '0', padding: '0'}}>
                <div style={{
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateRows: '80px 1fr',
                }}>
                    {/* タイトル・ヘッダー */}
                    <div style={{gridRow: '1 / 2',}}>
                        <h1>今昔マップ</h1>
                    </div>

                    {/* メインコンテンツ、この中にpage.jsxがはいる */}
                    <div style={{gridRow: '2 / 3', width: '100%', height: '100%'}}>
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}