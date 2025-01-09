import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { legacyRender } from './legacy-render';

type CleanupFunction = () => void;

/**
 * Version-aware render function that uses createRoot for React 18+
 * Falls back to legacy render for React 17 compatibility
 * @param element React element to render
 * @param container DOM container to render into
 * @returns cleanup function to unmount the component
 */
export function versionAwareRender(element: React.ReactElement, container: Element | null): CleanupFunction {
    if (!container) {
        throw new Error('Container element is required');
    }

    try {
        const root = createRoot(container);
        root.render(element);
        return () => root.unmount();
    } catch (e) {
        // Fall back to legacy render for React 17 compatibility
        // This will be removed once React 17 support is dropped
        return legacyRender(element, container);
    }
}
