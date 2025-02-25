import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import FocusTrap from '../focus-trap';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    /** Overlay contents */
    children: React.ReactNode;
    /** Component class names */
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onClose?: () => void;
    shouldDefaultFocus?: boolean;
    shouldOutlineFocus?: boolean;
    role?: string;
}

type OverlayProps = Omit<Props, 'onClose'> & {
    className?: string;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    tabIndex?: number;
};

class Overlay extends React.Component<Props> {
    closeOverlay = (): void => {
        const { onClose } = this.props;
        if (!onClose) {
            return;
        }
        setTimeout(() => onClose(), 0);
    };

    handleOverlayKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key !== 'Escape') {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.closeOverlay();
    };

    render(): React.ReactElement {
        const { children, className, ...rest } = this.props;
        const overlayProps = {
            ...omit(rest, ['onClose']),
            children,
            className: classNames('bdl-Overlay', className),
            onKeyDown: this.handleOverlayKeyDown,
            tabIndex: 0,
        } as OverlayProps;

        return (
            <FocusTrap {...overlayProps}>
                <div className="overlay">{children}</div>
            </FocusTrap>
        );
    }
}

export default Overlay;
