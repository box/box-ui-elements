// @flow
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import ThumbnailCardDetails from './ThumbnailCardDetails';
import ThumbnailCardThumbnail from './ThumbnailCardThumbnail';

import './ThumbnailCard.scss';

type Props = {
    className?: string,
    icon?: React.Node,
    id?: number,
    setIsCardInFocus?: (isInFocus: number) => void,
    shadowOnHover?: boolean,
    subtitle?: React.Node,
    thumbnail: React.Node,
    title: React.Node,
};

const ThumbnailCard = ({
    className = '',
    icon,
    id,
    shadowOnHover = false,
    setIsCardInFocus = noop,
    subtitle,
    title,
    thumbnail,
    ...rest
}: Props) => (
    <div
        onFocus={() => id && setIsCardInFocus(id)}
        onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsCardInFocus(-1);
            }
        }}
        role="button"
        tabIndex="0"
        className={classNames('thumbnail-card', className, { 'is-shadow-applied': shadowOnHover })}
        {...rest}
    >
        <ThumbnailCardThumbnail thumbnail={thumbnail} />
        <ThumbnailCardDetails icon={icon} subtitle={subtitle} title={title} />
    </div>
);

export default ThumbnailCard;
