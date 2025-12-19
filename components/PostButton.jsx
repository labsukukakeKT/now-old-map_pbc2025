import Link from 'next/link'

export default function PostButton() {
  return (
    // 【重要】ファイル名の page.jsx は書きません。
    // app/post/page.tsx なら "/post"
    // app/posts/page.tsx なら "/posts" です。
    <Link href="/post">
      <button className="bg-green-500 text-white py-2 px-4 rounded">
        投稿する ＋
      </button>
    </Link>
  )
}