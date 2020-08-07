// @flow
import * as React from 'react';
import Tooltip from '../tooltip';
import { useIsContentOverflowed } from '../../utils/dom';

type Props = {
    actionItem?: React.Element<any>,
    icon?: React.Node,
    subtitle?: React.Node,
    title: React.Node,
};

const RenderTitle = (title: React.Node) => {
    const textRef = React.useRef<?HTMLElement>(null);
    const isTextOverflowed = useIsContentOverflowed(textRef);

    if (isTextOverflowed) {
        return (
            <Tooltip text={title}>
                <div ref={textRef} className="thumbnail-card-title">
                    {title}
                </div>
            </Tooltip>
        );
    }
    return (
        <div ref={textRef} className="thumbnail-card-title">
            {title}
        </div>
    );
};

const ThumbnailCardDetails = ({ actionItem, icon, subtitle, title }: Props) => (
    <div className="thumbnail-card-details">
        {icon}
        <div className="thumbnail-card-details-content">
            <div className="ThumbnailCardDetails-bodyText">
                {RenderTitle(title)}
                {subtitle && <div className="thumbnail-card-subtitle">{subtitle}</div>}
            </div>
            {actionItem}
        </div>
    </div>
);

export default ThumbnailCardDetails;
