'use client'
import { useEffect, useRef } from 'react';
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css'; // CSSのインポートが必要
import wNumb from 'wnumb';

export default function YearSlider({ onChange }) {
    const sliderRef = useRef(null);

    useEffect(() => {
        if (!sliderRef.current) return;

        const yearFormat = wNumb({
            decimals: 0,
            thousand: '',
            suffix: '年'
        });

        const slider = noUiSlider.create(sliderRef.current, {
            start: [2025],
            range: {
                'min': 1875, // 1875年に合わせる場合
                'max': 2025
            },
            step: 1,
            tooltips: true,
            format: yearFormat,
            pips: {
                mode: 'steps',
                filter: (value) => (value % 25 === 0 ? 1 : -1), // 25年ごと
                format: yearFormat
            }
        });

        // スライダーが動いた時に親コンポーネントへ値を渡す
        slider.on('update', (values) => {
            const year = parseInt(values[0].replace('年', ''));
            onChange(year);
        });

        return () => slider.destroy(); // コンポーネント破棄時にクリーンアップ
    }, []);

    return (
        <div style={{ padding: '40px 20px 40px 20px' }}>
            <div ref={sliderRef}></div>
        </div>
    );
}