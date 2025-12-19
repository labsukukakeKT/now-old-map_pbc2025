'use server'

import { prisma } from '@/lib/prisma' // あなたのprismaインスタンスのパスに合わせてください
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // フォームから入力値を取得
  const description = formData.get('description') as string

  // バリデーション（空なら何もしない）
  if (!description || description.trim() === '') {
    return
  }

  // データベースに保存
  await prisma.post.create({
    data: {
      description: description,
      // 【注意】schema.prismaで必須のため、IDを指定する必要があります。
      // 本来はログイン中のユーザーIDや、表示中の場所IDを動的に入れます。
      user_id: 1, 
      place_id: 1,
    },
  })

  // 保存後に一覧ページなどへ遷移
  redirect('/') 
}