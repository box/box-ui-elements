// @flow
import * as React from 'react';
import classNames from 'classnames';

import ThumbnailCardDetails from './ThumbnailCardDetails';
import ThumbnailCardThumbnail from './ThumbnailCardThumbnail';

import './ThumbnailCard.scss';

type Props = {
    actionItem?: React.Node,
    className?: string,
    icon?: React.Node,
    shouldExpandOnHover: boolean,
    subtitle?: React.Node,
    thumbnail: React.Node,
    title: React.Node,
};

const ThumbnailCard = ({
    actionItem,
    className = '',
    icon,
    shouldExpandOnHover = false,
    subtitle,
    title,
    thumbnail,
    ...rest
}: Props) => (
    <div className={classNames('thumbnail-card', className, { 'is-expandable': shouldExpandOnHover })} {...rest}>
        <ThumbnailCardThumbnail thumbnail={thumbnail} />
        <ThumbnailCardDetails actionItem={actionItem} icon={icon} subtitle={subtitle} title={title} />
    </div>
);

export default ThumbnailCard;
