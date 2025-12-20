import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const CHANGE_PLACE_DB = true;
const CHANGE_USER_DB = false;

async function main() {
  const places = [
    {
      place_id: 1,
      place_name: '東京科学大学すずかけ台キャンパス',
      lat: 35.51417560214643,
      lng: 139.48364376463735,
      place_description: '旧東京工業です。',
      place_photo_url: null as string | null,
      place_era_start: 1999 as number | null,
      place_era_end: null as number | null,
    },
    {
      place_id: 2,
      place_name: '東京科学大学大岡山キャンパス',
      lat: 35.60485178683271,
      lng: 139.68385410808457,
      place_description: '旧東京工業大学です。',
      place_photo_url: null as string | null,
      place_era_start: 1924 as number | null,
      place_era_end: 0 as number | null,
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
      create: {
        place_name: p.place_name,
        lat: p.lat,
        lng: p.lng,
        place_description: p.place_description,
        place_photo_url: p.place_photo_url,
        place_era_start: p.place_era_start,
        place_era_end: p.place_era_end,
      },
    })
  }
  const users = [
    {
      user_id: 3,
      user_name: '山田太郎',
      user_description: null as string | null,
      email: 'taro@example.com',
      // SHA256 hash of "password123"
      password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    },
  ]
  for (const u of users) {
    await prisma.user_DB.upsert({
      where: { user_id: u.user_id },
      update: {
        user_name: u.user_name,
        user_description: u.user_description,
        email: u.email,
        password: u.password,
      },
      create: {
        user_name: u.user_name,
        user_description: u.user_description,
        email: u.email,
        password: u.password,
      },
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
