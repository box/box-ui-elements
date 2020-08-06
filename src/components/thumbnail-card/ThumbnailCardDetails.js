// @flow
import * as React from 'react';
import Tooltip from '../tooltip';

type Props = {
    actionItem?: React.Element<any>,
    icon?: React.Node,
    shouldShowTooltipOnTitleHover: boolean,
    subtitle?: React.Node,
    title: React.Node,
};

const renderTitle = (shouldShowTooltipOnTitleHover: boolean, title: React.Node) => {
    return shouldShowTooltipOnTitleHover ? (
        <Tooltip className="thumbnail-card-title-tooltip" text={title}>
            <div className="thumbnail-card-title">{title}</div>
        </Tooltip>
    ) : (
        <div className="thumbnail-card-title">{title}</div>
    );
};

const ThumbnailCardDetails = ({ actionItem, icon, shouldShowTooltipOnTitleHover, subtitle, title }: Props) => (
    <div className="thumbnail-card-details">
        {icon}
        <div className="thumbnail-card-details-content">
            <div className="ThumbnailCardDetails-bodyText">
                {renderTitle(shouldShowTooltipOnTitleHover, title)}
                {subtitle && <div className="thumbnail-card-subtitle">{subtitle}</div>}
            </div>
            {actionItem}
        </div>
    </div>
);

export default ThumbnailCardDetails;
