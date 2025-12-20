'use client'

import { createPost } from './form_input'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Client Componentなので searchParams は直接受け取るか、useSearchParamsを使う
// Next.js 13+ app dir pageで searchParams prop はServer ComponentでもClient Componentでも受け取れるが
// use client をつけると非同期の扱いが変わる可能性がある。
// ただしここではシンプルに props から取る。
export default function PostPage({ searchParams }) {
  const router = useRouter()
  const [userId, setUserId] = useState(null)

  // URLの ?place_id=XXX から値を取り出します
  const placeId = searchParams.place_id;

  useEffect(() => {
    // localStorageからユーザー情報を取得
    const sessionStr = localStorage.getItem('session')
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr)
        if (session && session.userId) {
          setUserId(session.userId)
        }
      } catch (e) {
        console.error("Failed to parse session", e)
      }
    } else {
      // ログインしていなければログイン画面へ飛ばす、などの処理が望ましいが
      // ここでは一旦そのまま、あるいはアラートを出す
      // alert("ログインしてください")
      // router.push('/login')
    }
  }, [router])

  if (!userId) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <p className="mb-4">投稿するにはログインが必要です。</p>
        <a href="/login" className="text-blue-600 hover:underline">ログインする</a>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">投稿を作成</h1>

      {/* placeIdが正しく取れているか確認用 */}
      <p className="text-sm text-gray-500 mb-4">選択中の場所ID: {placeId}</p>

      <form action={createPost} className="flex flex-col gap-4">

        {/* place_id を送信 */}
        <input type="hidden" name="place_id" value={placeId} />

        {/* user_id を送信 (localStorageから取得した値) */}
        <input type="hidden" name="user_id" value={userId} />

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-semibold text-gray-700">
            内容
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="ここに投稿内容を入力してください..."
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
        >
          決定（保存）
        </button>

      </form>
    </div>
  )
}