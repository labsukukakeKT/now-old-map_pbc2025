'use client'
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * URLパラメータからplace_idを読み取り、該当する場所を自動選択するコンポーネント
 * useSearchParamsを使用するためSuspense境界内でレンダリングする必要があります
 */
export default function PlaceAutoSelector({ locations, onLocationSelect }) {
    const searchParams = useSearchParams();
    const urlPlaceId = searchParams?.get('place_id');

    useEffect(() => {
        if (!urlPlaceId || !locations || locations.length === 0) return;

        const placeIdNum = parseInt(urlPlaceId, 10);
        if (isNaN(placeIdNum)) return;

        // locations内から該当するplace_idを持つ場所を検索
        const targetLocation = locations.find(loc => {
            const locId = loc.place_id ?? loc.id;
            return locId === placeIdNum;
        });

        if (targetLocation) {
            // 見つかったらその場所を選択し、サイドバーを開く
            onLocationSelect(targetLocation);
            // 少し遅延を入れてサイドバーを開く（地図の読み込み完了を待つ）
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("open-sidebar", { detail: { pane: "detail" } }));
            }, 300);
        }
    }, [urlPlaceId, locations, onLocationSelect]);

    return null; // このコンポーネントはUIを持たない
}
