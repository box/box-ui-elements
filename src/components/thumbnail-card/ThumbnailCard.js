// @flow
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import ThumbnailCardDetails from './ThumbnailCardDetails';
import ThumbnailCardThumbnail from './ThumbnailCardThumbnail';

import './ThumbnailCard.scss';

type Props = {
    actionItem?: React.Node,
    className?: string,
    expandOnHover?: boolean,
    icon?: React.Node,
    id?: string,
    setIsCardInFocus: (isInFocus: string) => void,
    subtitle?: React.Node,
    thumbnail: React.Node,
    title: React.Node,
};

const ThumbnailCard = ({
    actionItem,
    className = '',
    icon,
    id,
    expandOnHover = false,
    setIsCardInFocus = noop,
    subtitle,
    title,
    thumbnail,
    ...rest
}: Props) => (
    <div
        onFocus={() => setIsCardInFocus(id)}
        onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsCardInFocus('');
            }
        }}
        role="button"
        tabIndex="0"
        className={classNames('thumbnail-card', className, { 'is-expanded': expandOnHover })}
        {...rest}
    >
        <ThumbnailCardThumbnail thumbnail={thumbnail} />
        <ThumbnailCardDetails actionItem={actionItem} icon={icon} subtitle={subtitle} title={title} />
    </div>
);

export default ThumbnailCard;
