"use client"

import { useState, useRef, useEffect } from 'react'
import PostButton from './PostButton'
import MarkdownRenderer from './MarkdownRenderer'
/**
 * 選択された場所の詳細を表示するコンポーネント
 */
export default function LocationDetail({ location }) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [uploadSuccess, setUploadSuccess] = useState('')
    const [photoUrl, setPhotoUrl] = useState(location?.place_photo_url)
    const fileInputRef = useRef(null)

    const [posts, setPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(false)

    // locationが変わった時にphotoUrlも更新 + 投稿の取得
    useEffect(() => {
        setPhotoUrl(location?.place_photo_url)

        const fetchPosts = async () => {
            if (!location?.place_id) {
                setPosts([])
                return
            }

            setLoadingPosts(true)
            try {
                const res = await fetch(`/api/posts?placeId=${location.place_id}`)
                if (res.ok) {
                    const data = await res.json()
                    setPosts(data)
                } else {
                    console.error('Failed to fetch posts')
                    setPosts([])
                }
            } catch (err) {
                console.error('Error fetching posts:', err)
                setPosts([])
            } finally {
                setLoadingPosts(false)
            }
        }

        fetchPosts()
    }, [location?.place_id])

    if (!location) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#999'
            }}>
                <p>地図上のピンをクリックして<br />場所の詳細を表示</p>
            </div>
        );
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setUploadError('')
        setUploadSuccess('')

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('placeId', location.place_id)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                setUploadError(data.error || 'アップロードに失敗しました')
                return
            }

            setPhotoUrl(data.photoUrl)
            setUploadSuccess('画像をアップロードしました')
            setTimeout(() => setUploadSuccess(''), 3000)
        } catch (error) {
            console.error('Upload error:', error)
            setUploadError('アップロード中にエラーが発生しました')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div style={{
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '2px solid #2196F3',
            margin: '10px'
        }}>
            {/* タイトル */}
            <h3 style={{
                fontSize: '18px',
                marginBottom: '15px',
                color: '#2196F3',
                borderBottom: '2px solid #2196F3',
                paddingBottom: '8px'
            }}>
                {location.place_name || location.title}
            </h3>

            {/* 画像表示エリア */}
            <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#e0e0e0',
                borderRadius: '5px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                cursor: photoUrl ? 'default' : 'pointer'
            }}
                onClick={!photoUrl ? handleUploadClick : undefined}
            >
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={location.place_name || location.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                    }}>
                        <span style={{ color: '#999', fontSize: '14px', marginBottom: '8px' }}>
                            画像をアップロード
                        </span>
                        <button
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isUploading ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                opacity: isUploading ? 0.6 : 1
                            }}
                        >
                            {isUploading ? 'アップロード中...' : '画像を選択'}
                        </button>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>

            {/* エラーメッセージ */}
            {uploadError && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '4px',
                    marginBottom: '15px',
                    fontSize: '12px'
                }}>
                    {uploadError}
                </div>
            )}

            {/* 成功メッセージ */}
            {uploadSuccess && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#e8f5e9',
                    color: '#2e7d32',
                    borderRadius: '4px',
                    marginBottom: '15px',
                    fontSize: '12px'
                }}>
                    {uploadSuccess}
                </div>
            )}

            {/* 年代情報 */}
            {(location.place_era_start) && (
                <div style={{
                    marginBottom: '15px',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '5px'
                }}>
                    <strong style={{ color: '#666' }}>年代: </strong>
                    <span style={{ color: '#333' }}>
                        {location.place_era_start || '-'}年 - {location.place_era_end ? `${location.place_era_end}年` : '現存'}
                    </span>
                </div>
            )}

            {/* 説明文 (Markdown) */}
            {(location.place_description || location.abst) && (
                <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#555', display: 'block', marginBottom: '8px' }}>
                        説明:
                    </strong>
                    <div style={{ margin: 0 }}>
                        <MarkdownRenderer
                            source={location.place_description || location.abst}
                            className="md-card"
                        />
                    </div>
                </div>
            )}

            {/* 詳細情報 */}
            {(location.detail && location.detail !== location.place_description && location.detail !== location.abst) && (
                <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#555', display: 'block', marginBottom: '8px' }}>
                        詳細:
                    </strong>
                    <p style={{
                        margin: 0,
                        color: '#333',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {location.detail}
                    </p>
                </div>
            )}

            {/* 座標情報 */}
            <div style={{
                fontSize: '12px',
                color: '#888',
                borderTop: '1px solid #eee',
                paddingTop: '10px',
                marginTop: '10px'
            }}>
                <strong>座標: </strong>
                {(location.lattitude || location.lat)?.toFixed(5)}, {(location.longitude || location.lng)?.toFixed(5)}
            </div>

            {/* コメント一覧 */}
            <div style={{
                marginTop: '20px',
                borderTop: '2px solid #2196F3',
                paddingTop: '15px'
            }}>
                <h4 style={{
                    fontSize: '16px',
                    color: '#2196F3',
                    marginBottom: '10px',
                    margin: '0 0 10px 0'
                }}>
                    コメント
                </h4>

                {loadingPosts ? (
                    <p style={{ color: '#999', fontSize: '14px' }}>読み込み中...</p>
                ) : posts.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '14px' }}>コメントはまだありません</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {posts.map((post) => (
                            <div key={post.post_id} style={{
                                padding: '10px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '5px',
                                border: '1px solid #eee'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '5px',
                                    fontSize: '12px',
                                    color: '#666'
                                }}>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {post.user_DB?.user_name || '名無しさん'}
                                    </span>
                                    <span>
                                        {new Date(post.uploaded_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    color: '#333',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {post.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {(location) && (
                <div className="mb-8" style={{ padding: '0 10px', flexShrink: 0 }}>
                    <PostButton locations={location} />
                </div>
            )}
        </div>
    );
}
