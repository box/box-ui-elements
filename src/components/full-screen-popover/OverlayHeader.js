// @flow
import * as React from 'react';

import classNames from 'classnames';
import CloseButton from './CloseButton';
import './styles/OverlayHeader.scss';

export type Props = {
    /** Components to render in the header */
    children?: React.Node,
    /** Set className to the overlay header */
    className?: string,
    /** Set click handler when close button is clicked */
    onCloseClick?: Function,
};

const OverlayHeader = (props: Props) => {
    const { children, onCloseClick, className } = props;
    return (
        <div className={classNames('bdl-overlay-header', className)}>
            <div className="bdl-oh-content">{children}</div>
            <CloseButton className="bdl-oh-close-btn" onClick={onCloseClick} />
        </div>
    );
};

export default OverlayHeader;
