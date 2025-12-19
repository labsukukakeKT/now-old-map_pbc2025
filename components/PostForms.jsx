'use client'

import { createPost } from '@/app/actions' // 先ほどの関数をインポート

// 親コンポーネント（地図）から、選択中の place_id を受け取ります
// ★変更点: propsの型定義 { placeId: number } を削除しました
export default function PostForm({ placeId }) {
  
  return (
    // actionに先ほどの関数を指定
    <form action={createPost} className="flex flex-col gap-4 p-4 border rounded bg-white">
      
      {/* ★これが Hidden input です！
        画面には表示されませんが、name="place_id" として
        value={placeId} (例: 5) をサーバーに送信します。
      */}
      <input type="hidden" name="place_id" value={placeId} />

      {/* ユーザーが入力する場所 */}
      <label htmlFor="description" className="font-bold">
        コメントを書く
      </label>
      <textarea
        id="description"
        name="description"
        className="border p-2 rounded"
        placeholder="ここでの思い出を教えてください"
        rows={4}
      />

      {/* 送信ボタン */}
      <button 
        type="submit" 
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        投稿する
      </button>
    </form>
  )
}