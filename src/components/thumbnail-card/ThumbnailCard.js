// @flow
import * as React from 'react';

import ThumbnailCardDetails from './ThumbnailCardDetails';
import ThumbnailCardThumbnail from './ThumbnailCardThumbnail';

import './ThumbnailCard.scss';

type Props = {
    className?: string,
    icon?: React.Node,
    subtitle?: React.Node,
    thumbnail: React.Node,
    title: React.Node,
};

const ThumbnailCard = ({ className = '', icon, subtitle, title, thumbnail, ...rest }: Props) => (
    <div className={`thumbnail-card ${className}`} {...rest}>
        <ThumbnailCardThumbnail thumbnail={thumbnail} />
        <ThumbnailCardDetails icon={icon} subtitle={subtitle} title={title} />
    </div>
);

export default ThumbnailCard;
