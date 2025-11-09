export const metadata = {
    title: '今昔マップ',
    description: 'This is a application that overlooks now and old maps / aerial photos.'
};

export default function RootLayout({children}) {
    return (
        <html lang="ja">
            <head>
                <meta charset="UTF-8"></meta>
                <title>今昔マップ</title>
            </head>
            <body>
                {/* この中にpage.jsxの内容が表示される */}
                {children}
            </body>
        </html>
    )
}