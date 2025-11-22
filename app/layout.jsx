import './globals.css'
// import Script from "next/script";

export const metadata = {
    title: '今昔マップ',
    description: 'This is a application that overlooks now and old maps / aerial photos.'
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <head>
                {/* ライブラリの追加 */}
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
            </head>
            <body>
                {/* この中にpage.jsxの内容が表示される */}
                {children}
            </body>
        </html>
    )
}