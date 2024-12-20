// @flow
import * as React from 'react';
import classNames from 'classnames';

import ThumbnailCardDetails from './ThumbnailCardDetails';
import ThumbnailCardThumbnail from './ThumbnailCardThumbnail';

import './ThumbnailCard.scss';

type Props = {
    actionItem?: React.Element<any>,
    className?: string,
    highlightOnHover?: boolean,
    icon?: React.Node,
    onKeyDown?: () => void,
    subtitle?: React.Node,
    thumbnail: React.Node,
    title: React.Node,
};

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
}: Props) => (
    <div
        role="button"
        tabIndex="0"
        className={classNames('thumbnail-card', className, { 'is-highlight-applied': highlightOnHover })}
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
