// データベースの初期値を書き込むプログラム
import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const contents: Prisma.place_DBCreateInput[] = [
        {
            place_name: '東京科学大学すずかけ台キャンパス',
            lattitude: 35.51417560214643,
            longitude: 139.48364376463735,
            place_description: '旧東京工業です。2026年4月より横浜キャンパスになります。',
            place_photo_url: null,
            place_era_start: new Date('1975-01-01'),
            place_era_end: new Date('9999-01-01'),
        },
        {
            place_name: '東京科学大学大岡山キャンパス',
            lattitude: 35.60485178683271,
            longitude: 139.68385410808457,
            place_description: '旧東京工業大学。昔は蔵前にあったらしいよ。',
            place_photo_url: null,
            place_era_start: new Date('1924-01-01'),
            place_era_end: new Date('9999-01-01'),
        },
        {
            place_name: '世にも奇妙な池',
            lattitude: 35.601914,
            longitude: 139.690719,
            place_description: '足を洗う池。いやん、足がきれいになっちゃう',
            place_photo_url: null,
            place_era_start: new Date('1424-01-01'),
            place_era_end: new Date('9999-01-01'),
        },
    ];

    for (const content of contents) {
        await prisma.place_DB.create({ data: content });
    }
}



main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})

