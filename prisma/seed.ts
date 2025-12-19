import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const places: Prisma.place_DBCreateInput[] = [
    {
      place_id: 1,
      place_name: '東京科学大学すずかけ台キャンパス',
      lat: 35.51417560214643,
      lng: 139.48364376463735,
      place_description: '旧東京工業です。',
      place_photo_url: null,
      // DateTime? なので Date 型を入れる（年だけIntは不可）
      place_era_start: 1999,
      place_era_end: null,
    },
    {
      place_id: 2,
      place_name: '東京科学大学大岡山キャンパス',
      lat: 35.60485178683271,
      lng: 139.68385410808457,
      place_description: '旧東京工業大学です。',
      place_photo_url: null,
      place_era_start: 1924,
      place_era_end: 0,
    },
  ]

  for (const p of places) {
    await prisma.place_DB.upsert({
      where: { place_id: p.place_id },
      update: {
        lat: p.lat,
        lng: p.lng,
        place_description: p.place_description,
        place_photo_url: p.place_photo_url,
        place_era_start: p.place_era_start,
        place_era_end: p.place_era_end,
      },
      create: p,
    })
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
