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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '16px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#111827'
          }}>
            ログインが必要です
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            アカウントにアクセスするにはログイン、または新規登録を行ってください。
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <Link
              href="/login"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                textAlign: 'center',
                transition: 'background-color 0.2s',
                boxSizing: 'border-box'
              }}
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#fff',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                textAlign: 'center',
                transition: 'background-color 0.2s',
                boxSizing: 'border-box'
              }}
            >
              サインアップ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="account-page">
      <Card className="account-card">
        <CardHeader className="account-header">
          {/* Profile Photo */}
          <div className="account-avatar-container">
            {user.user_photo_url ? (
              <img
                src={user.user_photo_url}
                alt={user.user_name}
                className="account-avatar"
              />
            ) : (
              <div className="account-avatar-placeholder">
                {user.user_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <CardTitle className="account-username">{user.user_name}</CardTitle>
        </CardHeader>

        <CardContent className="account-content">
          {/* User Info */}
          <div className="account-info-section">
            <div className="account-info-item">
              <span className="account-info-label">メールアドレス</span>
              <span className="account-info-value">{user.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="account-actions">
            <Button asChild variant="outline" className="account-btn">
              <Link href="/create-place">新しい場所を追加</Link>
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="account-btn"
            >
              ログアウト
            </Button>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        .account-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .account-card {
          width: 100%;
          max-width: 400px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          background: #fff;
        }

        .account-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 24px 24px;
          background: linear-gradient(135deg, #f6f8fc 0%, #eef2f7 100%);
        }

        .account-avatar-container {
          margin-bottom: 16px;
        }

        .account-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .account-avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 42px;
          font-weight: 600;
          border: 4px solid #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .account-username {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          text-align: center;
        }

        .account-content {
          padding: 32px 24px;
        }

        .account-info-section {
          margin-bottom: 32px;
        }

        .account-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .account-info-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .account-info-value {
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
        }

        .account-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .account-btn {
          width: 100%;
          height: 48px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .account-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
