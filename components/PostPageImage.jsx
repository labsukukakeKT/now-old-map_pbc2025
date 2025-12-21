'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export default function PostPageImage({ place }) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [uploadSuccess, setUploadSuccess] = useState('')
    const [photoUrl, setPhotoUrl] = useState(place?.place_photo_url)
    const fileInputRef = useRef(null)

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setUploadError('')
        setUploadSuccess('')

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('placeId', place.place_id)

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
        <div className="w-full">
            {/* Image Display Area */}
            <div
                style={{ width: 'auto', display: 'inline-block' }}
                className={`bg-gray-200 rounded-lg flex items-center justify-center relative shadow-sm transition-colors ${!photoUrl ? 'cursor-pointer hover:bg-gray-300 w-full' : 'cursor-default'} !h-[30px]`}
                onClick={!photoUrl ? handleUploadClick : undefined}
            >
                {photoUrl ? (
                    <div className="relative w-full overflow-hidden rounded-lg">
                        <Image
                            src={photoUrl}
                            alt={place.place_name}
                            width={0}
                            height={0}
                            sizes="100vw"
                            quality={10}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="max-w-none object-contain rounded-lg"
                            priority
                            unoptimized={false}
                        />
                    </div>
                ) : (
                    <div style={{
                        width: '300px',
                        height: '210px',
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
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                    }}>
                        <svg width="36" height="48" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
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
                            {isUploading ? 'アップロード中...' : '画像をアップロード'}
                        </button>
                    </div>
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

            {/* Error Message */}
            {uploadError && (
                <div className="bg-red-50 text-red-700 p-2 rounded text-xs mb-2 border border-red-200">
                    {uploadError}
                </div>
            )}

            {/* Success Message */}
            {uploadSuccess && (
                <div className="bg-green-50 text-green-700 p-2 rounded text-xs mb-2 border border-green-200">
                    {uploadSuccess}
                </div>
            )}
        </div>
    )
}
