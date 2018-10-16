/**
 * @flow
 * @file Allows react to render a component in an arbitrary DOM node, in this case in a new window.
 * @author Box
 */

import { createPortal } from 'react-dom';

type Props = {
    children: any,
    integrationWindow: any,
};

/**
 * Copies stylesheets to the new window.
 *
 * @private
 * @return {void}
 */
const copyStyles = integrationWindow => {
    // The new window will have no CSS, so we copy all style sheets as a safe way
    // of ensuring required styles are present
    Array.from(document.styleSheets).forEach(styleSheet => {
        if (!styleSheet.href) {
            return;
        }

        const copiedStyleSheet = integrationWindow.document.createElement(
            'link',
        );
        copiedStyleSheet.rel = 'stylesheet';
        copiedStyleSheet.href = styleSheet.href;
        integrationWindow.document.head.appendChild(copiedStyleSheet);
    });

    // Reset margin and padding in our new window
    integrationWindow.document.body.style.margin = 0;
    integrationWindow.document.body.style.padding = 0;
};

const IntegrationPortal = ({ integrationWindow, children }: Props) => {
    // If the integration window isn't closed, we should reuse the container div and avoid
    // creating another one.
    const existingContainer = integrationWindow.document.querySelector('div');
    const containerElement =
        existingContainer || integrationWindow.document.createElement('div');

    copyStyles(integrationWindow);
    integrationWindow.document.body.appendChild(containerElement);

    return createPortal(children, containerElement);
};

export default IntegrationPortal;
