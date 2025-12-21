
'use client'

import { createPost } from './form_input'
import { useEffect, useState } from 'react'

export default function PostForm({ placeId }) {
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        // localStorageからユーザー情報を取得
        const sessionStr = localStorage.getItem('session')
        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr)
                if (session && session.userId) {
                    setUserId(session.userId)
                }
            } catch (e) {
                console.error("Failed to parse session", e)
            }
        }
    }, [])

    if (!userId) {
        return (
            <div className="max-w-md mt-6 p-6 bg-white rounded-lg shadow-md text-center" style={{ borderTop: '4px solid #0b5fff' }}>
                <p className="mb-4 text-gray-700">投稿するにはログインが必要です。</p>
                <a href="/login" style={{ textDecoration: 'none' }}>
                    <button style={{
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
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        投稿する
                    </button>
                </a>
            </div>
        )
    }

    return (
        <div
            style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderTop: '4px solid #3b82f6',
                padding: '1.5rem',
                boxSizing: 'border-box'
            }}
        >
            <h3 className="text-xl font-bold mb-4 text-gray-800">新しい投稿を作成</h3>

            <form action={createPost} className="flex flex-col gap-4 w-full">

                {/* place_id を送信 */}
                <input type="hidden" name="place_id" value={placeId} />

                {/* user_id を送信 (localStorageから取得した値) */}
                <input type="hidden" name="user_id" value={userId} />

                <div className="flex flex-col gap-2 w-full">
                    {/* label removed */}

                    <textarea
                        id="description"
                        name="description"
                        rows={7}
                        placeholder="この場所の豆知識をみんなに共有しましょう"
                        style={{ width: '100%', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', color: '#1f2937', border: '1px solid #d0d7de', borderRadius: 6, padding: '12px', resize: 'vertical' }}
                        className="w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    style={{
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
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    投稿する
                </button>

            </form>
        </div>
    )
}
