
import React from 'react';
import PostPageImage from './PostPageImage';
import MarkdownRenderer from './MarkdownRenderer';
import PostButton from './PostButton';

const PostPlaceInfo = ({ place, posts, children }) => {
    return (
        <div className="flex flex-col gap-8 mb-8 w-[1000px] flex-shrink-0">
            {/* --- Top Section: Split Layout (Left: Name+Photo, Right: Description) --- */}
            <div className="flex flex-row gap-6 items-start w-full">

                {/* Left Column: Place Name & Photo */}
                <div className="flex flex-col gap-4 w-1/3 flex-shrink-0">
                    {/* Place Name */}
                    <h2 className="text-2xl font-bold text-gray-800 break-words">
                        {place?.place_name}
                    </h2>

                    {/* Photo Component */}
                    <div>
                        <PostPageImage place={place} />
                    </div>
                </div>

                {/* Right Column: Description */}
                <div className="w-2/3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
                        説明
                    </h3>
                    <div className="text-gray-700 leading-relaxed">
                        <MarkdownRenderer source={place?.place_description || '場所の説明はありません。'} />
                    </div>
                </div>
            </div>

            {/* --- Bottom Section: Form & Posts --- */}
            <div className="flex flex-col gap-6 w-full">

                {/* New Post Form (Injected via children) */}
                <div className="w-full">
                    {children}
                </div>

                {/* Existing Posts List */}
                <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-md box-border">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                        みんなの投稿
                    </h3>

                    <div>
                        {posts && posts.length > 0 ? (
                            <div className="flex flex-col gap-5">
                                {posts.map((post) => (
                                    <div key={post.post_id} style={{
                                        padding: '10px',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px',
                                        border: '1px solid #eee',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '12px',
                                            marginBottom: '6px',
                                            color: '#666'
                                        }}>
                                            <span style={{ fontWeight: 'bold' }}>
                                                {post.user_DB?.user_name || '名無しさん'}
                                            </span>
                                            <span>
                                                {post.uploaded_date ? new Date(post.uploaded_date).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '16px',
                                            lineHeight: '1.5',
                                            color: '#333',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {post.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">まだ投稿はありません。</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostPlaceInfo;
