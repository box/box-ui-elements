/* eslint-disable react/no-deprecated -- Intentionally using deprecated methods for React 17 compatibility */
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

type CleanupFunction = () => void;

/**
 * Legacy render function for React 17 compatibility
 * @param element React element to render
 * @param container DOM container to render into
 * @returns cleanup function to unmount the component
 * @deprecated This function uses deprecated React DOM methods and will be removed when React 17 support is dropped
 */
export function legacyRender(element: React.ReactElement, container: Element): CleanupFunction {
    render(element, container);
    return () => {
        unmountComponentAtNode(container);
    };
}
/* eslint-enable react/no-deprecated */
