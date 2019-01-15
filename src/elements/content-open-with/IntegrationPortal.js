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
 * @param {HTMLDocument} documentElement - an HTML document
 * @param {Window} integrationWindow - a browser window
 * @return {void}
 */
export function copyStyles(documentElement: Document, integrationWindow: any) {
    // The new window will have no CSS, so we copy all style sheets as a safe way
    // of ensuring required styles are present
    Array.from(documentElement.styleSheets).forEach(styleSheet => {
        if (!styleSheet.href) {
            return;
        }

        const copiedStyleSheet = integrationWindow.document.createElement('link');
        copiedStyleSheet.rel = 'stylesheet';
        copiedStyleSheet.href = styleSheet.href;
        integrationWindow.document.head.appendChild(copiedStyleSheet);
    });

    // Reset margin and padding in our new window
    integrationWindow.document.body.style.margin = 0;
    integrationWindow.document.body.style.padding = 0;
}

const IntegrationPortal = ({ integrationWindow, children }: Props) => {
    const containerElement = integrationWindow.document.createElement('div');
    copyStyles(document, integrationWindow);
    integrationWindow.document.body.appendChild(containerElement);
    return createPortal(children, containerElement);
};

export default IntegrationPortal;
