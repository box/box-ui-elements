// @flow

import { toQuery, useMediaQuery } from 'react-responsive';
import type { MediaFeatures } from './types';

type MediaQuery = string | MediaFeatures;

/**
 * Formats the media query either as a MediaQuery object or string
 * @param query
 * @returns {string}
 */
function formatQuery(query: MediaQuery): string {
    return typeof query === 'string' ? query : toQuery(query);
}

/**
 * Executes media query
 * @param query
 * @param onQueryChange
 * @returns {boolean}
 */
function useQuery(query: string, onQueryChange?: (_: boolean) => void): boolean {
    return useMediaQuery({ query }, null, onQueryChange);
}

/**
 * @param query
 * @param onQueryChange
 * @returns {boolean}
 */
function useMedia(query: string, onQueryChange?: (_: boolean) => void): boolean {
    const formattedQuery = formatQuery(query);
    return useQuery(formattedQuery, onQueryChange);
}

export default useMedia;
