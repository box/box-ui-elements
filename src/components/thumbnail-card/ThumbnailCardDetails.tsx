import * as React from 'react';

import Tooltip from '../tooltip';
import { useIsContentOverflowed } from '../../utils/dom';

export interface ThumbnailCardDetailsProps {
    actionItem?: React.ReactElement;
    icon?: React.ReactNode;
    onKeyDown?: () => void;
    subtitle?: React.ReactNode;
    title: React.ReactNode;
}

interface TitleProps {
    onKeyDown?: () => void;
    title: React.ReactNode;
}

const Title = ({ title, onKeyDown }: TitleProps) => {
    const textRef = React.useRef<HTMLDivElement>(null);
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

const ThumbnailCardDetails = ({ actionItem, icon, subtitle, title, onKeyDown }: ThumbnailCardDetailsProps) => (
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
