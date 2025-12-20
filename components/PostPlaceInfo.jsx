
import React from 'react';
import Image from 'next/image';

const PostPlaceInfo = ({ place, posts, children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left', width: '100%', alignItems: 'flex-start' }}>


            {/* Place Info */}
            <div style={{ width: '100%' }}>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{place.place_name}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                    {place.place_description || "場所の説明はありません。"}
                </p>
            </div>

            {/* Form Section (Injected via children) */}
            <div style={{ width: '100%' }}>
                {children}
            </div>

            {/* Existing Posts - スクロール可能なブロック */}
            <div
                className="shadow-md"
                style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    width: '100%',
                    boxSizing: 'border-box'
                    // maxWidth: '448px' // max-w-md approx - Removed to unify width
                }}
            >
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">みんなの投稿</h3>
                {/* 最大高さを設定し、超えたらスクロール */}
                <div>
                    {posts && posts.length > 0 ? (
                        <div className="flex flex-col gap-4 pr-2">
                            {posts.map((post) => (
                                <div key={post.post_id} className="bg-gray-50 p-6 rounded-lg shadow-sm border text-left">
                                    <p className="text-gray-800 whitespace-pre-wrap text-xl font-bold">{post.description}</p>
                                    <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                                        <span>{post.user_DB?.user_name || "Unknown User"}</span>
                                        <span>{new Date(post.uploaded_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">まだ投稿はありません。</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostPlaceInfo;
