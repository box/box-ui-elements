// @flow
import * as React from 'react';
import Tooltip from '../tooltip';
import { useIsContentOverflowed } from '../../utils/dom';

type Props = {
    actionItem?: React.Element<any>,
    icon?: React.Node,
    shouldShowTooltipOnTitleHover: boolean,
    subtitle?: React.Node,
    title: React.Node,
};

const RenderTitle = (shouldShowTooltipOnTitleHover: boolean, title: React.Node) => {
    const textRef = React.useRef<?HTMLElement>(null);
    const isTextOverflowed = useIsContentOverflowed(textRef);

    if (isTextOverflowed && shouldShowTooltipOnTitleHover) {
        return (
            <Tooltip className="thumbnail-card-title-tooltip" text={title}>
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

const ThumbnailCardDetails = ({ actionItem, icon, shouldShowTooltipOnTitleHover, subtitle, title }: Props) => (
    <div className="thumbnail-card-details">
        {icon}
        <div className="thumbnail-card-details-content">
            <div className="ThumbnailCardDetails-bodyText">
                {RenderTitle(shouldShowTooltipOnTitleHover, title)}
                {subtitle && <div className="thumbnail-card-subtitle">{subtitle}</div>}
            </div>
            {actionItem}
        </div>
    </div>
);

export default ThumbnailCardDetails;
