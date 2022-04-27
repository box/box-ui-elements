import * as React from 'react';

import classNames from 'classnames';
import CloseButton from '../close-button/CloseButton';
// @ts-ignore flow
import FlyoutContext from './FlyoutContext';

import './OverlayHeader.scss';

export interface OverlayHeaderProps {
    /** Components to render in the header */
    children?: React.ReactNode;
    /** Set className to the overlay header */
    className?: string;
}

const OverlayHeader = ({ children, className }: OverlayHeaderProps) => {
    const handleClick = (event: React.SyntheticEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
    };

    const { closeOverlay } = React.useContext(FlyoutContext);

    return (
        <div
            className={classNames('bdl-OverlayHeader', className)}
            data-testid="bdl-OverlayHeader"
            onClick={handleClick}
            role="presentation"
        >
            <div className="bdl-OverlayHeader-content">{children}</div>
            <CloseButton onClick={closeOverlay} />
        </div>
    );
};

export default OverlayHeader;
