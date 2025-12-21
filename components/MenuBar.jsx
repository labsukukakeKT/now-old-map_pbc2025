"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MenuBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [pathname]); // pathname が変わるたびに再取得

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        {/* 中央 title - larger hitbox, navigates home */}
        <div style={{ ...styles.titleWrap, justifyContent: 'flex-start' }}>
          <Link href="/" aria-label="ホーム" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '8px 12px' }}>
            <div style={{ ...styles.title, marginLeft: -8 }}>Rewind Map</div>
          </Link>
        </div>

        {/* 右: account as monochrome icon + username (truncated) */}
        <Link
          href="/account"
          aria-label="アカウント"
          style={{
            ...styles.boxBtn,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            width: 'auto',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            marginLeft: 8,
            maxWidth: 140,
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'rgba(255,255,255,0.95)',
            fontSize: 14,
          }}>{user?.user_name || ''}</span>
        </Link>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(20,20,20,0.9)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  },
  inner: {
    height: 64,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    gap: 12,
  },

  // 左右の四角ボタン
  boxBtn: {
    width: 64,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    textDecoration: "none",
    color: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    fontSize: 18, // ← ここで文字・アイコンの大きさ
    flex: "0 0 auto",
  },

  // 真ん中のタイトル領域（左右に押されても中央に固定）
  titleWrap: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "rgba(255,255,255,0.95)",
    letterSpacing: 0.5,
  },

  // アクティブ時の強調
  active: {
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.35)",
    color: "#fff",
  },
};
