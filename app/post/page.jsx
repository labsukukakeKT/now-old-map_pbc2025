import { createPost } from './form_input'

// props に searchParams を追加します
export default function PostPage({ searchParams }) {
  
  // URLの ?place_id=XXX から値を取り出します
  // 値がない場合はデフォルト値を入れるか、エラー表示をするなどの対策も可能です
  const placeId = searchParams.place_id;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">投稿を作成</h1>
      
      {/* placeIdが正しく取れているか確認用（本番では消してもOK） */}
      <p className="text-sm text-gray-500 mb-4">選択中の場所ID: {placeId}</p>

      <form action={createPost} className="flex flex-col gap-4">
        
        {/* ★ここに Hidden Input を追加！ */}
        {/* これで place_id がサーバーに送信されます */}
        <input type="hidden" name="place_id" value={placeId} />
        
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-semibold text-gray-700">
            内容
          </label>
          
          <textarea
            id="description"
            name="description" 
            rows={5}
            placeholder="ここに投稿内容を入力してください..."
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
        >
          決定（保存）
        </button>
         
      </form>
    </div>
  )
}