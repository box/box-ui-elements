import * as React from 'react';
import classNames from 'classnames';

import ThumbnailCardDetails from './ThumbnailCardDetails';
import ThumbnailCardThumbnail from './ThumbnailCardThumbnail';

import './ThumbnailCard.scss';

export interface ThumbnailCardProps {
    actionItem?: React.ReactElement;
    className?: string;
    highlightOnHover?: boolean;
    icon?: React.ReactNode;
    onKeyDown?: () => void;
    subtitle?: React.ReactNode;
    thumbnail: React.ReactNode;
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
