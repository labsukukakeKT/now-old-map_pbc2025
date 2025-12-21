import Link from 'next/link'
import React from 'react'

export default function PostButton({ locations }) {
  const placeId = locations?.place_id;
  const linkHref = placeId ? `/post?place_id=${placeId}` : '/post';

  const btnStyle = {
    background: 'linear-gradient(180deg,#0b5fff 0%,#0061e0 100%)',
    color: '#fff',
    border: 0,
    padding: '9px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 6px 18px rgba(11,95,255,0.14)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  };

  return (
    <Link href={linkHref} style={btnStyle} aria-label="投稿ページへ">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        投稿する
      </span>
    </Link>
  )
}