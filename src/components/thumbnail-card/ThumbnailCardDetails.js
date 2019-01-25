// @flow
import * as React from 'react';

type Props = {
    icon?: React.Node,
    subtitle?: React.Node,
    title: React.Node,
};

const ThumbnailCardDetails = ({ icon, subtitle, title }: Props) => (
    <div className="thumbnail-card-details">
        {icon}
        <div className="thumbnail-card-details-content">
            <div className="thumbnail-card-title">{title}</div>
            {subtitle && <div className="thumbnail-card-subtitle">{subtitle}</div>}
        </div>
    </div>
);

export default ThumbnailCardDetails;
