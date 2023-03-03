// @flow

import { toQuery, useMediaQuery as _useMediaQuery } from 'react-responsive';
import {
    ANY_HOVER,
    ANY_POINTER_COARSE,
    ANY_POINTER_FINE,
    HOVER,
    HOVER_TYPE,
    POINTER_COARSE,
    POINTER_FINE,
    POINTER_TYPE,
    SIZE_LARGE,
    SIZE_MEDIUM,
    SIZE_SMALL,
    VIEW_SIZE_TYPE,
} from './constants';
import type { MediaQuery, MediaShape } from './types';

const getPointerCapabilities = (isFine: boolean, isCoarse: boolean) => {
    if (!isFine && !isCoarse) return POINTER_TYPE.none;
    if (isFine) return POINTER_TYPE.fine;
    return POINTER_TYPE.coarse;
};

const getViewDimensions = () => {
    return { viewWidth: window.innerWidth, viewHeight: window.innerHeight };
};

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
function useQuery(query: MediaQuery, onQueryChange?: (_: boolean) => void): boolean {
    return _useMediaQuery({ query: formatQuery(query) }, null, onQueryChange);
}

/**
 * Determines device capabilities for hover and pointer features
 * @returns {{anyPointer: *, hover: (string), pointer: *, anyHover: (string)}}
 */
function useDeviceCapabilities() {
    const isHover: boolean = useQuery(HOVER);
    const isAnyHover: boolean = useQuery(ANY_HOVER);

    const anyHover = isAnyHover ? HOVER_TYPE.hover : HOVER_TYPE.none;
    const hover = isHover ? HOVER_TYPE.hover : HOVER_TYPE.none;
    const pointer = getPointerCapabilities(useQuery(POINTER_FINE), useQuery(POINTER_COARSE));
    const anyPointer = getPointerCapabilities(useQuery(ANY_POINTER_FINE), useQuery(ANY_POINTER_COARSE));

    const isTouchDevice = hover === HOVER_TYPE.none && pointer === POINTER_TYPE.coarse;

    return {
        anyHover,
        hover,
        anyPointer,
        pointer,
        isTouchDevice,
    };
}

/**
 * Determines device size using media queries
 * @returns {string}
 */
function useDeviceSize() {
    const isSmall: boolean = useQuery(SIZE_SMALL);
    const isMedium: boolean = useQuery(SIZE_MEDIUM);
    const isLarge: boolean = useQuery(SIZE_LARGE);

    if (isSmall) return VIEW_SIZE_TYPE.small;
    if (isMedium) return VIEW_SIZE_TYPE.medium;
    if (isLarge) return VIEW_SIZE_TYPE.large;

    return VIEW_SIZE_TYPE.xlarge;
}

function useMediaQuery(): MediaShape {
    const deviceCapabilities = useDeviceCapabilities();
    const deviceSize = useDeviceSize();
    const viewDimensions = getViewDimensions();
    return {
        ...deviceCapabilities,
        ...viewDimensions,
        size: deviceSize,
    };
}

export default useMediaQuery;
