'use client';

import { createContext } from 'react';

/**
 * Leafletのマップインスタンスを保持するためのReactコンテキスト。
 * @type {React.Context<L.Map | null>}
 */
export const MapContext = createContext(null);
