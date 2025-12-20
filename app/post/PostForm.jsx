
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
            <div className="max-w-md mt-6 p-6 bg-white rounded-lg shadow-md text-center border-t-4 border-blue-500">
                <p className="mb-4 text-gray-700">投稿するにはログインが必要です。</p>
                <a href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
                    ログインする
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
                        rows={15}
                        placeholder="ここに投稿内容を入力してください..."
                        style={{ width: '100%' }}
                        className="w-full border border-gray-300 rounded-md p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-xl font-bold"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out shadow-md"
                >
                    決定（保存）
                </button>

            </form>
        </div>
    )
}
