'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

// 引数に「: FormData」という型を付けます
export async function createPost(formData: FormData) {
  // フォームから入力値を取得
  // .get() の返り値が null の可能性もあるため、as string で「これは文字列だよ」と教えます
  const description = formData.get('description') as string
  const placeIdString = formData.get('place_id') as string
  /* formから送られてくる user_id を取得 */
  const userIdString = formData.get('user_id') as string

  // バリデーション
  if (!description || description.trim() === '') {
    return
  }

  // place_id がない場合はエラーにする
  if (!placeIdString) {
    console.error("place_id is missing")
    return
  }

  // user_id がない場合もエラー（ログイン必須）
  if (!userIdString) {
    console.error("user_id is missing")
    return
  }

  const userId = Number(userIdString)
  if (isNaN(userId)) {
    console.error("Invalid user_id")
    return
  }

  // データベースに保存
  await prisma.post.create({
    data: {
      description: description,
      // 文字列として受け取った "5" などを数値の 5 に変換
      place_id: Number(placeIdString),

      // formから受け取った user_id を利用
      user_id: userId,
    },
  })

  // 保存後にトップページ（地図）へ戻る
  redirect('/')
}