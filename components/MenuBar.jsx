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

  const handleHomeClick = (e) => {
    e.preventDefault();
    router.refresh();
    router.push("/");
  };

  const isHome = pathname === "/";
  const isAccount = pathname === "/account";

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        {/* 左：ホーム */}
        <Link href="/" onClick={handleHomeClick} style={{ ...styles.boxBtn, ...(isHome ? styles.active : {}) }} aria-label="ホーム">
          🏠
        </Link>

        {/* 中央：タイトル */}
        <div style={styles.titleWrap}>
          <div style={styles.title}>Now - Old Map</div>
        </div>

        {/* 右：アカウント */}
        <Link
          href="/account"
          style={{ ...styles.boxBtn, ...(isAccount ? styles.active : {}), overflow: 'hidden' }}
        >
          {user?.user_photo_url ? (
            <img
              src={user.user_photo_url}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            "アカウント"
          )}
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
