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
            suffix: ''
        });

        // create highlight element that will show current value below the handle
        const highlight = document.createElement('div');
        highlight.className = 'year-highlight';
        Object.assign(highlight.style, {
            position: 'absolute',
            top: '100%',
            transform: 'translate(-50%, 8px)',
            padding: '6px 10px',
            borderRadius: '8px',
            background: '#0b5cff',
            color: '#fff',
            fontWeight: 700,
            fontSize: '14px',
            pointerEvents: 'none',
            zIndex: 5,
            whiteSpace: 'nowrap',
            transition: 'left 220ms cubic-bezier(.2,.8,.2,1), opacity 120ms linear',
        });
        // container should be positioned
        const container = sliderRef.current;
        container.style.position = container.style.position || 'relative';
        container.appendChild(highlight);

        const slider = noUiSlider.create(sliderRef.current, {
            start: [2025],
            range: {
                'min': 1875, // 1875年に合わせる場合
                'max': 2025
            },
            step: 1,
            tooltips: false, // disable built-in tooltip
            format: yearFormat,
            pips: {
                mode: 'steps',
                filter: (value) => (value % 25 === 0 ? 1 : -1), // 25年ごと
                format: yearFormat
            }
        });

        function updateHighlight(values, handle, unencoded, tap, positions) {
            const raw = Array.isArray(values) ? values[0] : values;
            const year = parseInt(String(raw).replace('年', ''));
            onChange(year);

            // position the highlight under the handle
            const pipValues = Array.from(container.querySelectorAll('.noUi-value'));
            // prefer the slider base element for accurate width
            const baseEl = container.querySelector('.noUi-base') || container;
            const cRect = baseEl.getBoundingClientRect();

            // if layout not yet measured (width 0), wait one frame and retry
            if (!cRect.width || cRect.width < 2) {
                requestAnimationFrame(() => updateHighlight(values, handle, unencoded, tap, positions));
                return;
            }

            let centerX = null;
            // prefer using provided positions (percentage) which are accurate during animations
            if (positions && positions.length) {
                const pct = Number(positions[0]);
                if (!Number.isNaN(pct)) {
                    centerX = (pct / 100) * cRect.width;
                }
            }

            // fallback to DOM handle position if positions not provided
            if (centerX === null) {
                const handles = container.querySelectorAll('.noUi-handle');
                if (handles.length) {
                    const handleEl = handles[0];
                    const hRect = handleEl.getBoundingClientRect();
                    centerX = hRect.left + hRect.width / 2 - cRect.left;
                }
            }

            if (centerX !== null) {
                highlight.textContent = String(year);
                // set left using px relative to base container
                // account for baseEl left offset relative to container
                const baseRect = baseEl.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const offset = baseRect.left - containerRect.left;
                highlight.style.left = `${offset + centerX}px`;

                // hide any pip labels that collide with highlight
                // use bounding rect after layout (read) — small tolerance
                const hlRect = highlight.getBoundingClientRect();
                pipValues.forEach((pv) => {
                    const pvRect = pv.getBoundingClientRect();
                    const overlap = !(pvRect.right < hlRect.left + 6 || pvRect.left > hlRect.right - 6);
                    pv.style.visibility = overlap ? 'hidden' : '';
                });
            }
        }

        // initial update and wire events
        slider.on('update', updateHighlight);
        slider.on('set', updateHighlight);
        slider.on('change', updateHighlight);

        // also run once to initialize highlight position
        setTimeout(() => {
            const vals = slider.get();
            updateHighlight(vals, 0);
        }, 0);

        return () => {
            slider.off('update', updateHighlight);
            slider.destroy();
            if (highlight && highlight.parentNode) highlight.parentNode.removeChild(highlight);
        };
    }, [onChange]);

    return (
        <div style={{ position: 'relative', padding: '20px 20px 40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div ref={sliderRef} style={{ width: '100%', maxWidth: 760 }}></div>
        </div>
    );
}