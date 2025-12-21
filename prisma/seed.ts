import { PrismaClient } from '@prisma/client'
import { places } from './seed_placedata'
const prisma = new PrismaClient()

const CHANGE_PLACE_DB = true;
const CHANGE_USER_DB = false;

async function main() {
  // 依存関係のある子テーブルから順に削除
  if (CHANGE_PLACE_DB) {
    await prisma.post.deleteMany()
    await prisma.place_DB.deleteMany()


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


  if (CHANGE_USER_DB) {
    await prisma.user_DB.deleteMany()
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
}



main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
