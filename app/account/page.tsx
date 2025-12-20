"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  user_id: number
  email: string
  user_name: string
  user_description?: string
  user_photo_url?: string
  created_at: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("session")
    router.push("/")
  }

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>ログインが必要です</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600">
              アカウントにアクセスするにはログインしてください
            </p>
            <div>
              <Button asChild className="w-full">
                <Link href="/login">ログイン</Link>
              </Button>
              <br />
              <br />
              <p className="text-gray-600">
                アカウントをお持ちでない場合はこちらからサインアップしてください。
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signup">サインアップ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>アカウント情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            {/* Profile Photo */}
            {user.user_photo_url && (
              <div>
                <img
                  src={user.user_photo_url}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 mx-auto"
                />
              </div>
            )}

            {/* User Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  ユーザーID
                </label>
                <p className="mt-1 text-lg">{user.user_id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  メールアドレス
                </label>
                <p className="mt-1 text-lg">{user.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  ユーザー名
                </label>
                <p className="mt-1 text-lg">{user.user_name}</p>
              </div>

              {user.user_description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    自己紹介
                  </label>
                  <p className="mt-1 text-lg">{user.user_description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">
                  アカウント作成日時
                </label>
                <p className="mt-1 text-lg">
                  {new Date(user.created_at).toLocaleString("ja-JP")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-6 space-y-3 flex flex-col">
              <Button asChild variant="outline" className="w-full">
                <Link href="/create-place">新しい場所を追加</Link>
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                ログアウト
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
