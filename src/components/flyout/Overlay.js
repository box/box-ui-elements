// @flow
import * as React from 'react';
import omit from 'lodash/omit';

import FocusTrap from '../focus-trap';

export type Props = {
    /** Overlay contents */
    children: React.Node,
    /** Component class names */
    className?: string,
    onClick?: Function,
    onClose?: Function,
    shouldDefaultFocus?: boolean,
};

class Overlay extends React.Component<Props> {
    closeOverlay = () => {
        const { onClose } = this.props;
        if (!onClose) {
            return;
        }
        // @Note(wyu): I have absolutely no idea why we have to wrap it in a setTimeout here, but it works ¯\_(ツ)_/¯
        // Otherwise there will be a 'React DOM tree root should always have a node reference' error.
        setTimeout(() => onClose(), 0);
    };

    handleOverlayKeyDown = (event: SyntheticKeyboardEvent<>) => {
        if (event.key !== 'Escape') {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.closeOverlay();
    };

    render() {
        const { children, className, ...rest } = this.props;
        const overlayProps = omit(rest, ['onClose']);
        overlayProps.className = className;
        overlayProps.handleOverlayKeyDown = this.handleOverlayKeyDown;
        overlayProps.tabIndex = 0;

        return (
            <FocusTrap {...overlayProps}>
                <div className="overlay">{children}</div>
            </FocusTrap>
        );
    }
}

export default Overlay;
