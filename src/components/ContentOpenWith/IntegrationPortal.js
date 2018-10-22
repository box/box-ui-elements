/**
 * @flow
 * @file Allows react to render a component in an arbitrary DOM node, in this case in a new window.
 * @author Box
 */

import { PureComponent } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    children: any,
    integrationWindow: any,
};

const INTEGRATION_CONTAINER_ID = 'integration-container';
class IntegrationPortal extends PureComponent<Props> {
    containerElement: ?HTMLElement;

    document: Document;

    /**
     * [constructor]
     *
     * @private
     * @return {IntegrationPortal}
     */
    constructor(props: Props) {
        super(props);

        const { integrationWindow }: Props = this.props;
        const existingContainer = integrationWindow.document.querySelector(
            `#${INTEGRATION_CONTAINER_ID}`,
        );

        // If the integration window isn't closed, we should reuse the container div and avoid
        // creating another one.
        this.containerElement =
            existingContainer ||
            integrationWindow.document.createElement('div');

        this.containerElement.id = INTEGRATION_CONTAINER_ID;
    }

    /**
     * Setup UI in the new window.
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        this.document = document;

        const { integrationWindow }: Props = this.props;
        this.copyStyles();
        integrationWindow.document.body.appendChild(this.containerElement);
    }

    /**
     * Copies stylesheets to the new window.
     *
     * @private
     * @return {void}
     */
    copyStyles() {
        const { integrationWindow }: Props = this.props;
        // The new window will have no CSS, so we copy all style sheets as a safe way
        // of ensuring required styles are present
        Array.from(this.document.styleSheets).forEach(styleSheet => {
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
    }

    render() {
        return createPortal(this.props.children, this.containerElement);
    }
}

export default IntegrationPortal;
