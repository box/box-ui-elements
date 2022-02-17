import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { getClientDimensions } from './util';

const VIEWPORT_SIZE_DEFAULT_DEBOUNCE = 200;

function useViewportSize(debounceInterval = VIEWPORT_SIZE_DEFAULT_DEBOUNCE) {
    const [viewportSize, setViewportSize] = useState(getClientDimensions());
    useEffect(() => {
        function handleResize() {
            setViewportSize(getClientDimensions());
        }
        window.addEventListener('resize', debounce(handleResize, debounceInterval));
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [debounceInterval]);
    return viewportSize;
}

export { useViewportSize, VIEWPORT_SIZE_DEFAULT_DEBOUNCE, getClientDimensions };
