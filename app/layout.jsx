// import Script from "next/script";
import "./globals.css";
import MenuBar from "@/components/MenuBar";


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
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <MenuBar />
          <div style={{ flex: 1, overflow: "auto" }}>
            {children}
          </div>
        </div>
      </body>

    </html>
  )
}