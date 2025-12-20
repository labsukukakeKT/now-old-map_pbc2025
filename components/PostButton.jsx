import Link from 'next/link'

export default function PostButton({ locations }) {
  
  // 1. locationsの中から place_id を取り出します
  // locations が空(null)の場合にエラーにならないよう '?.' を使っています
  const placeId = locations?.place_id;

  // 2. IDがある場合はパラメータ付きURL、なければ通常のURLにします
  const linkHref = placeId ? `/post?place_id=${placeId}` : '/post';

  return (
    <Link href={linkHref}>
      <button className="bg-green-500 text-white py-2 px-4 rounded">
        投稿する ＋
      </button>
    </Link>
  )
}