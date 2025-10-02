// @flow
import * as React from 'react';

import Tooltip from '../tooltip';
import { useIsContentOverflowed } from '../../utils/dom';

type Props = {
    actionItem?: React.Element<any>,
    icon?: React.Node,
    onKeyDown?: () => void,
    subtitle?: React.Node,
    title: React.Node,
};

type TitleProps = {
    onKeyDown?: () => void,
    title: React.Node,
};

const Title = ({ title, onKeyDown }: TitleProps) => {
    const textRef: { current: null | HTMLElement } = React.useRef(null);
    const isTextOverflowed = useIsContentOverflowed(textRef);

    return (
        <Tooltip isDisabled={!isTextOverflowed} text={title}>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-static-element-interactions */}
            <div ref={textRef} role="link" className="thumbnail-card-title" tabIndex={0} onKeyDown={onKeyDown}>
                {title}
            </div>
        </Tooltip>
    );
};

const ThumbnailCardDetails = ({ actionItem, icon, subtitle, title, onKeyDown }: Props) => (
    <div className="thumbnail-card-details">
        {icon}
        <div className="thumbnail-card-details-content">
            <div className="ThumbnailCardDetails-bodyText">
                <Title title={title} onKeyDown={onKeyDown} />
                {subtitle && <div className="thumbnail-card-subtitle">{subtitle}</div>}
            </div>
            {actionItem}
        </div>
    </div>
);

export default ThumbnailCardDetails;
