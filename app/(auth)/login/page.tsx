"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("Sending login request...")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store session in localStorage
      if (data.session) {
        console.log("Storing user data in localStorage...")
        localStorage.setItem("session", JSON.stringify(data.session))
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      console.log("Navigating to /account...")
      router.push("/account")
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Something went wrong")
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
    backgroundColor: '#f9fafb'
  }

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '32px',
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

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>ログイン</h1>
        <p style={subtitleStyle}>アカウントにアクセスするための情報を入力してください</p>

        <form onSubmit={handleLogin}>
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

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <div style={footerStyle}>
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" style={linkStyle}>
            サインアップ
          </Link>
        </div>
      </div>
    </div>
  )
}

