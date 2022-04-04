// @flow
import * as React from 'react';

import './OverlayHeader.scss';
import classNames from 'classnames';
import { bdlGray62 } from '../../styles/variables';
import Button from '../button';
import IconClose from '../../icons/general/IconClose';

export type ResponsiveMenuProps = {
    /** Custom primary action button that appears on the right header */
    actionButton?: React.node,
    /** Set className to the overlay header */
    className?: string,
    /** Set click handler when close button is clicked */
    onCloseClick?: Function,
    /** Primary title in header */
    primaryTitle?: string,
    /** Reverse orientation of primary and secondary titles in header */
    reverseTitle?: boolean,
    /** Secondary title in header */
    secondaryTitle?: string,
};

type CloseButtonProps = {
    onClick?: Function,
};

const CloseButton = ({ onClick }: CloseButtonProps) => {
    return (
        <Button onClick={onClick} className="close-btn" type="button">
            <IconClose color={bdlGray62} height={18} width={18} />
        </Button>
    );
};

const OverlayHeader = (props: ResponsiveMenuProps) => {
    const { actionButton, primaryTitle, secondaryTitle, reverseTitle, onCloseClick, className } = props;
    const primaryTitleEl = primaryTitle && (
        <div key="primary" className="oh-primary-title">
            {primaryTitle}
        </div>
    );
    const secondaryTitleEl = secondaryTitle && (
        <div key="secondary" className="oh-secondary-title">
            {secondaryTitle}
        </div>
    );

    const titleComponents = [primaryTitleEl, secondaryTitleEl];

    return (
        <div className={classNames(['overlay-header', className])}>
            <div className="oh-text">{reverseTitle ? titleComponents.reverse() : titleComponents}</div>
            <div className="oh-buttons">
                {actionButton !== undefined && actionButton}
                <CloseButton onClick={onCloseClick} />
            </div>
        </div>
    );
};

export default OverlayHeader;
