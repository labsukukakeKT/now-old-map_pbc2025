// データベースの初期値を書き込むプログラム
import {Prisma, PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const contents: Prisma.LocationCreateInput[] = [
        {
            title: '東京科学大学すずかけ台キャンパス',
            lat: 35.51417560214643,
            lng: 139.48364376463735,
            eraStart: 1975,
            eraEnd: 9999,
            abst: '旧東京工業です。',
            detail: '2026年4月より横浜キャンパスになります。'
        },
        {
            title: '東京科学大学大岡山キャンパス',
            lat: 35.60485178683271,
            lng: 139.68385410808457,
            eraStart: 1924,
            eraEnd: 9999,
            abst: '旧東京工業大学です。',
            detail: '昔は蔵前にあったらしいよ。'
        }
                {
            title: '世にも奇妙な池',
            lat: 35.601914,
            lng: 139.690719,
            eraStart: 1424,
            eraEnd: 9999,
            abst: '足を洗う行け',
            detail: 'いやん、足がきれいになっちゃう'
        }
    ];



    for (const content of contents) {
        await prisma.location.upsert({
            where: { id: 0 },
            update: {},
            create: content
        })
    }
}



main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})

