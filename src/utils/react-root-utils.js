/**
 * @flow
 * @file Utilities for React root management with version compatibility
 * @author Box
 */

import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOM from 'react-dom';

const roots = new WeakMap();

/**
 * Creates or retrieves a React root for a container
 * @param {HTMLElement} container - The container element
 * @returns {Object|null} - React root instance or null for older versions
 */
function getOrCreateRoot(container: HTMLElement): ?{ render: React$Node => void, unmount: () => void } {
    // Check if we already have a root for this container
    let root = roots.get(container);
    if (!root) {
        // Check if createRoot is available (React 18+)
        if (typeof ReactDOMClient.createRoot === 'function') {
            try {
                root = ReactDOMClient.createRoot(container);
                if (root) {
                    roots.set(container, root);
                }
            } catch (e) {
                return null;
            }
        }
    }
    return root;
}

/**
 * Renders a React element into a container with version compatibility
 * @param {Element} element - React element to render
 * @param {HTMLElement} container - Container element
 */
export function renderElement(element: React$Node, container: HTMLElement): void {
    try {
        const root = getOrCreateRoot(container);
        if (root) {
            // React 18+ using createRoot
            root.render(element);
            return;
        }
    } catch (e) {
        // Ignore createRoot errors
    }
    // Fallback for React 17 and below
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(element, container);
}

/**
 * Unmounts a React component and cleans up
 * @param {HTMLElement} container - Container element
 */
export function unmountElement(container: HTMLElement): void {
    try {
        const root = roots.get(container);
        if (root) {
            // React 18+ cleanup
            root.unmount();
            roots.delete(container);
            return;
        }
    } catch (e) {
        // Ignore createRoot errors
    }
    // Fallback for React 17 and below
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
}
