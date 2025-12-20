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
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <Card style={{ width: '100%', maxWidth: '384px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb' }}>
          <CardHeader style={{ textAlign: 'center', paddingBottom: '8px' }}>
            <CardTitle style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Welcome</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', lineHeight: '1.625' }}>
              アカウントにアクセスするには<br />ログインしてください
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button asChild style={{ width: '100%', height: '48px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link href="/login">ログイン</Link>
              </Button>
              <div style={{ position: 'relative', margin: '8px 0' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                  <span style={{ width: '100%', borderTop: '1px solid #e5e7eb' }} />
                </div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '12px', textTransform: 'uppercase' }}>
                  <span style={{ backgroundColor: 'white', padding: '0 8px', color: '#6b7280' }}>Or</span>
                </div>
              </div>
              <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                アカウントをお持ちでない場合は<br />こちらからサインアップ
              </p>
              <Button asChild variant="outline" style={{ width: '100%', height: '48px', fontSize: '16px', fontWeight: '500', borderColor: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link href="/signup">サインアップ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '80px' }}>
      {/* Header Background */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '0 16px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} className="md-hidden-header"> {/* Need global CSS for md:hidden logic if required, but inline usually assumes mobile first or media queries. Given context, I'll keep it simple for mobile first. */}
        <h1 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937', margin: 0 }}>アカウント</h1>
      </div>

      <div style={{
        maxWidth: '448px',
        margin: '0 auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Profile Card */}
        <Card style={{ overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{
            background: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
            height: '96px'
          }}></div>
          <div style={{ paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '-48px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              {user.user_photo_url ? (
                <img
                  src={user.user_photo_url}
                  alt="Profile"
                  style={{
                    width: '96px',
                    height: '96px',
                    objectFit: 'cover',
                    borderRadius: '9999px',
                    border: '4px solid white',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              ) : (
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '9999px',
                  border: '4px solid white',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '30px', color: '#9ca3af' }}>?</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '56px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{user.user_name}</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>{user.email}</p>
            </div>
          </div>
        </Card>

        {/* Details Card */}
        <Card style={{ border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <CardContent style={{ padding: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ユーザーID</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{user.user_id}</span>
              </div>
              {user.user_description && (
                <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>自己紹介</span>
                  <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.625' }}>{user.user_description}</span>
                </div>
              )}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>登録日</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{new Date(user.created_at).toLocaleDateString("ja-JP")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
          <Button asChild style={{ width: '100%', height: '48px', fontSize: '16px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
            <Link href="/create-place">新しい場所を追加</Link>
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            style={{ width: '100%', height: '48px', fontSize: '16px', color: '#dc2626', borderColor: '#fee2e2', backgroundColor: 'transparent' }}
          >
            ログアウト
          </Button>
        </div>
      </div>
    </div>
  )
}

