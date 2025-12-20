
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import PostPlaceInfo from '@/components/PostPlaceInfo'
import PostForm from './PostForm'

export default async function PostPage({ searchParams }) {
  const placeIdStr = searchParams.place_id;

  if (!placeIdStr) {
    return <div className="text-center mt-10 text-red-500">Error: Place ID is missing.</div>
  }

  const placeId = Number(placeIdStr);
  if (isNaN(placeId)) {
    return <div className="text-center mt-10 text-red-500">Error: Invalid Place ID.</div>
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* ★変更点1: 全体の幅を少し広げて(6xl)、400pxの画像が合っても窮屈にならないようにします */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">投稿と場所の情報</h1>

        {/* ★変更点2: グリッドの定義を変更。[1fr_400px] で「左側は自動・右側は400px固定」にします */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

          {/* Left Column: Info, Posts */}
          {/* col-span-2 などの指定は削除し、グリッドの左側エリアに自然に収まるようにします */}
          <div className="flex flex-col gap-8">
            <PostPlaceInfo place={place} posts={posts} />
          </div>

          {/* Right Column: Photo & Form - デスクトップ(lg以上)でのみ表示 */}
          <div className="hidden lg:block sticky top-10 flex flex-col gap-6">
            {/* Photo Section */}
            {place.place_photo_url ? (
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={place.place_photo_url}
                  alt={place.place_name}
                  // fill
                  className="object-cover"
                  height={400}
                  width={400}
                />
              </div>
            ) : (
              <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 shadow-inner">
                <span className="text-lg">No Image Available</span>
              </div>
            )}

            {/* Form Section (Moved to Right) */}
            <PostForm placeId={placeIdStr} />
          </div>
        </div>
      </div>
    </div>
  )
}
