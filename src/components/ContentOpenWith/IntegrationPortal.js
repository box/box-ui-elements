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
class IntegrationPortal extends PureComponent<Props> {
    containerElement: ?HTMLElement;

    /**
     * [constructor]
     *
     * @private
     * @return {IntegrationPortal}
     */
    constructor(props: Props) {
        super(props);

        const { integrationWindow }: Props = this.props;
        this.containerElement = integrationWindow.document.createElement('div');
    }

    /**
     * Setup UI in the new window.
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
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
    }

    render() {
        return createPortal(this.props.children, this.containerElement);
    }
}

export default IntegrationPortal;
