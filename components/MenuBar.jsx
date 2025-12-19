'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "ホーム" },
  { href: "/account", label: "アカウント" },
];

export default function MenuBar() {
  const pathname = usePathname();

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              style={{
                ...styles.tab,
                ...(active ? styles.activeTab : {}),
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(20,20,20,0.9)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  nav: {
    height: 52,
    display: "flex",
    gap: 8,
    alignItems: "center",
    padding: "0 16px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  tab: {
    padding: "8px 12px",
    borderRadius: 10,
    textDecoration: "none",
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  activeTab: {
    color: "#fff",
    background: "rgba(255,255,255,0.12)",
  },
};
