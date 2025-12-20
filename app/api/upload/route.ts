import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const placeId = formData.get('placeId') as string

    // バリデーション
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      )
    }

    if (!placeId) {
      return NextResponse.json(
        { error: 'placeIdが指定されていません' },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'JPG、PNG、WebP形式のみアップロード可能です' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'ファイルサイズは5MB以下である必要があります' },
        { status: 400 }
      )
    }

    // ファイルを Supabase Storage にアップロード
    const timestamp = Date.now()
    const fileName = `places/${placeId}/${timestamp}.jpg`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('photo')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'ファイルのアップロードに失敗しました' },
        { status: 500 }
      )
    }

    // 公開URL を構築
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('photo').getPublicUrl(fileName)

    // Prisma で place_DB の place_photo_url を更新
    const updatedPlace = await prisma.place_DB.update({
      where: { place_id: Number(placeId) },
      data: { place_photo_url: publicUrl },
    })

    return NextResponse.json({
      success: true,
      photoUrl: publicUrl,
      place: updatedPlace,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
