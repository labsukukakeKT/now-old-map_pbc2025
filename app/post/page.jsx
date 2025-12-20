
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

        <div className={styles.grid}>

          {/* Left Column: Info, Posts */}
          <div className={styles.leftColumn}>
            <PostPlaceInfo place={place} posts={posts}>
              <PostForm placeId={placeIdStr} />
            </PostPlaceInfo>
          </div>

          {/* Right Column: Photo & Form - デスクトップ(lg以上)でのみ表示 */}
          <div className={styles.rightColumn}>
            {/* Photo Section */}
            {place.place_photo_url ? (
              <div className={styles.imageContainer}>
                <Image
                  src={place.place_photo_url}
                  alt={place.place_name}
                  className={styles.image}
                  height={400}
                  width={400}
                />
              </div>
            ) : (
              <div className={styles.noImage}>
                <span className={styles.noImageText}>No Image Available</span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
