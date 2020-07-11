// @flow
import * as React from 'react';

type Props = {
    actionItem?: React.Node,
    icon?: React.Node,
    subtitle?: React.Node,
    title: React.Node,
};

const ThumbnailCardDetails = ({ actionItem, icon, subtitle, title }: Props) => (
    <div className="thumbnail-card-details">
        {icon}
        <div className="thumbnail-card-details-content">
            <div className="thumbnail-card-details-body">
                <div className="thumbnail-card-title">{title}</div>
                {subtitle && <div className="thumbnail-card-subtitle">{subtitle}</div>}
            </div>
            {actionItem}
        </div>
    </div>
);

export default ThumbnailCardDetails;
