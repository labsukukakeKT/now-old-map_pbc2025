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
                    <div className="relative w-auto h-full">
                        <Image
                            src={photoUrl}
                            alt={place.place_name}
                            width={0}
                            height={0}
                            sizes="100vw"
                            quality={10}
                            style={{ width: 'auto', height: '100%' }}
                            className="max-w-none object-contain rounded-lg"
                            priority
                            unoptimized={false}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                        <span className="mb-3 text-sm font-bold">画像をアップロード</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleUploadClick()
                            }}
                            disabled={isUploading}
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition text-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
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
