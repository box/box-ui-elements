import * as React from 'react';
import classNames from 'classnames';

import ThumbnailCardDetails from './ThumbnailCardDetails';
import ThumbnailCardThumbnail from './ThumbnailCardThumbnail';

import './ThumbnailCard.scss';

export interface ThumbnailCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onKeyDown' | 'title'> {
    /** Optional action element rendered in the details section */
    actionItem?: React.ReactElement;
    /** Additional CSS class for the card */
    className?: string;
    /** Whether to apply highlight styles on hover */
    highlightOnHover?: boolean;
    /** Optional icon rendered in the details section */
    icon?: React.ReactNode;
    /** Keydown handler forwarded to the title; when set, the card omits role and tabIndex */
    onKeyDown?: () => void;
    /** Optional subtitle rendered below the title */
    subtitle?: React.ReactNode;
    /** Thumbnail content rendered in the thumbnail viewport */
    thumbnail: React.ReactNode;
    /** Title content rendered in the details section */
    title: React.ReactNode;
}

const ThumbnailCard = ({
    actionItem,
    className = '',
    highlightOnHover = false,
    icon,
    onKeyDown,
    subtitle,
    thumbnail,
    title,
    ...rest
}: ThumbnailCardProps) => (
    <div
        className={classNames('thumbnail-card', className, { 'is-highlight-applied': highlightOnHover })}
        role={onKeyDown ? null : 'button'}
        tabIndex={onKeyDown ? null : 0}
        {...rest}
    >
        <ThumbnailCardThumbnail thumbnail={thumbnail} />
        <ThumbnailCardDetails
            actionItem={actionItem}
            icon={icon}
            onKeyDown={onKeyDown}
            subtitle={subtitle}
            title={title}
        />
    </div>
);

export default ThumbnailCard;
