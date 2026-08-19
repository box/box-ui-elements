import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import FocusTrap from '../focus-trap';

export interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Overlay contents */
    children: React.ReactNode;
    /** Component class names */
    className?: string;
    /** Called when the overlay should close */
    onClose?: () => void;
    /** Whether to focus the first focusable element when opened */
    shouldDefaultFocus?: boolean;
}

class Overlay extends React.Component<OverlayProps> {
    closeOverlay = () => {
        const { onClose } = this.props;
        if (!onClose) {
            return;
        }
        setTimeout(() => onClose(), 0);
    };

    handleOverlayKeyDown = (event: React.KeyboardEvent) => {
        if (event.key !== 'Escape') {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.closeOverlay();
    };

    render() {
        const { children, className, ...rest } = this.props;
        const overlayProps = omit(rest, ['onClose']) as Record<string, unknown>;
        overlayProps.className = classNames('bdl-Overlay', className);
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
