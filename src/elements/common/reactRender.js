/**
 * @file Utility for rendering React components with backward compatibility
 * @author Box
 */

// For React 17 and below
// eslint-disable-next-line react/no-deprecated
import { render as legacyRender } from 'react-dom';

// For React 18+
let createRoot = null;

// Initialize createRoot asynchronously
(async function initCreateRoot() {
    try {
        const clientModule = await import('react-dom/client');
        createRoot = clientModule.createRoot;
    } catch {
        // Keep createRoot as null for React 17 fallback
    }
})();

/**
 * Renders a React element into a container with backward compatibility
 * @param {React.Element} element - React element to render
 * @param {HTMLElement} container - DOM element to render into
 * @returns {Object} - Returns root object for React 18+ or result of render for older versions
 */
function reactRender(element, container) {
    if (typeof createRoot === 'function') {
        // React 18+ path
        const root = createRoot(container);
        root.render(element);
        return root;
    }
    // React 17 or older path
    return legacyRender(element, container);
}

export default reactRender;
