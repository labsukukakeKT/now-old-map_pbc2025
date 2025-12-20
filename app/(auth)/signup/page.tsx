"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userName, setUserName] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("パスワードが一致しません")
      return
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください")
      return
    }

    if (!userName.trim()) {
      setError("ユーザー名を入力してください")
      return
    }

    setLoading(true)

    try {
      let photoUrl = null

      // Upload photo if selected
      if (photoFile) {
        const formData = new FormData()
        formData.append("file", photoFile)
        formData.append("type", "face")

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("写真のアップロードに失敗しました")
        }

        const uploadData = await uploadResponse.json()
        photoUrl = uploadData.url
      }

      // Create user account
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          user_name: userName,
          user_photo_url: photoUrl
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "アカウント作成に失敗しました")
      }

      // Store user info in localStorage
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      router.push("/account")
    } catch (err: any) {
      setError(err.message || "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '16px',
    backgroundColor: '#f9fafb',
    overflowY: 'auto'
  }

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    margin: '16px 0'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#111827',
    textAlign: 'center'
  }

  const subtitleStyle: React.CSSProperties = {
    color: '#6b7280',
    marginBottom: '24px',
    fontSize: '14px',
    textAlign: 'center'
  }

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '16px'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  }

  const fileInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    cursor: 'pointer'
  }

  const buttonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '12px 24px',
    backgroundColor: loading ? '#93c5fd' : '#3b82f6',
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '16px',
    textAlign: 'center',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
    boxSizing: 'border-box'
  }

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px'
  }

  const footerStyle: React.CSSProperties = {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280'
  }

  const linkStyle: React.CSSProperties = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600'
  }

  const photoPreviewStyle: React.CSSProperties = {
    width: '96px',
    height: '96px',
    objectFit: 'cover',
    borderRadius: '50%',
    border: '2px solid #e5e7eb',
    marginTop: '8px'
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>サインアップ</h1>
        <p style={subtitleStyle}>新しいアカウントを作成してください</p>

        <form onSubmit={handleSignup}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>メールアドレス</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="userName" style={labelStyle}>ユーザー名</label>
            <input
              id="userName"
              type="text"
              placeholder="あなたの名前"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="photo" style={labelStyle}>プロフィール写真（任意）</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={fileInputStyle}
            />
            {photoPreview && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={photoPreview}
                  alt="プレビュー"
                  style={photoPreviewStyle}
                />
              </div>
            )}
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>パスワード</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>パスワード（確認）</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "作成中..." : "アカウント作成"}
          </button>
        </form>

        <div style={footerStyle}>
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" style={linkStyle}>
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}

