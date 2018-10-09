/**
 * @flow
 * @file Allows react to render a component in an arbitrary DOM node, in this case in a new window.
 * @author Box
 */

import { PureComponent } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    children: any,
    integrationWindowRef: any,
};
class IntegrationPortal extends PureComponent<Props> {
    containerEl: ?HTMLElement;

    /**
     * [constructor]
     *
     * @private
     * @return {IntegrationPortal}
     */
    constructor(props: Props) {
        super(props);
        this.containerEl = document.createElement('div');
    }

    /**
     * Setup UI in the new window.
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        const { integrationWindowRef }: Props = this.props;
        this.copyStyles();
        integrationWindowRef.document.body.appendChild(this.containerEl);
    }

    /**
     * Copies stylesheets to the new window.
     *
     * @private
     * @return {void}
     */
    copyStyles() {
        const { integrationWindowRef }: Props = this.props;
        // The new window will have no CSS, so we copy all style sheets as a safe way
        // of ensuring required styles are present
        Array.from(document.styleSheets).forEach(styleSheet => {
            const copiedStyleSheet = document.createElement('link');
            copiedStyleSheet.rel = 'stylesheet';
            copiedStyleSheet.href = styleSheet.href;
            integrationWindowRef.document.head.appendChild(copiedStyleSheet);
        });
    }

    render() {
        return createPortal(this.props.children, this.containerEl);
    }
}

export default IntegrationPortal;
