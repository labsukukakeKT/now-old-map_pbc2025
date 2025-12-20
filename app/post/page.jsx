
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import PostPlaceInfo from '@/components/PostPlaceInfo'
import PostForm from './PostForm'
import styles from './page.module.css'

export default async function PostPage({ searchParams }) {
  const placeIdStr = searchParams.place_id;

  if (!placeIdStr) {
    return <div className={styles.errorMessage}>Error: Place ID is missing.</div>
  }

  const placeId = Number(placeIdStr);
  if (isNaN(placeId)) {
    return <div className={styles.errorMessage}>Error: Invalid Place ID.</div>
  }

  // データベースから場所情報を取得
  const place = await prisma.place_DB.findUnique({
    where: { place_id: placeId },
  })

  if (!place) {
    notFound();
  }

  // データベースからこの場所に関連する投稿を取得
  const posts = await prisma.post.findMany({
    where: { place_id: placeId },
    include: {
      user_DB: true,
    },
    orderBy: {
      uploaded_date: 'desc',
    },
  })

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <PostPlaceInfo place={place} posts={posts}>
            <PostForm placeId={placeIdStr} />
          </PostPlaceInfo>
        </div>
      </div>
    </div>
  )
}
