'use server'

import { prisma } from '@/lib/prisma' 
import { redirect } from 'next/navigation'

// 引数に「: FormData」という型を付けます
export async function createPost(formData: FormData) {
  // フォームから入力値を取得
  // .get() の返り値が null の可能性もあるため、as string で「これは文字列だよ」と教えます
  const description = formData.get('description') as string
  const placeIdString = formData.get('place_id') as string

  // バリデーション
  if (!description || description.trim() === '') {
    return
  }

  // place_id がない場合はエラーにする
  if (!placeIdString) {
    console.error("place_id is missing")
    return
  }

  // データベースに保存
  await prisma.post.create({
    data: {
      description: description,
      // 文字列として受け取った "5" などを数値の 5 に変換
      place_id: Number(placeIdString),
      
      // user_idは一旦 3 で固定
      user_id: 3,  
    },
  })

  // 保存後にトップページ（地図）へ戻る
  redirect('/') 
}