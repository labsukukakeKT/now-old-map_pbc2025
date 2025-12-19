// app/actions.ts (ファイル名は適宜読み替えてください)
'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // 1. フォームから値を取得
  const description = formData.get('description') as string
  // ★ここで隠されたplace_idを取得します（HTMLからは必ず文字列として来る）
  const placeIdString = formData.get('place_id') as string

  // 2. バリデーション
  if (!description || description.trim() === '') {
    return
  }
  
  // place_idがない場合のエラーハンドリング（念のため）
  if (!placeIdString) {
    console.error("Place ID is missing")
    return
  }

  // 3. データベースに保存
  await prisma.post.create({
    data: {
      description: description,
      // ★文字列で届いた "5" などを数値の 5 に変換して保存
      place_id: Number(placeIdString),
      
      // user_idは一旦固定(3)のままにします
      user_id: 3, 
      
      // photoなどは今回は省略しますが、必要なら同様に追加します
    },
  })

  // 4. 保存後に遷移
  redirect('/') 
}