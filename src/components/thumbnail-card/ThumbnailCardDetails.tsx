import * as React from 'react';

import Tooltip from '../tooltip';
import { useIsContentOverflowed } from '../../utils/dom';

interface ThumbnailCardDetailsProps {
    /** Optional action element rendered beside the title/subtitle */
    actionItem?: React.ReactElement;
    /** Optional icon rendered before the details content */
    icon?: React.ReactNode;
    /** Keydown handler attached to the title element */
    onKeyDown?: () => void;
    /** Optional subtitle rendered below the title */
    subtitle?: React.ReactNode;
    /** Title content; shows a tooltip when overflowed */
    title: React.ReactNode;
}

interface ThumbnailCardTitleProps {
    /** Keydown handler attached to the title element */
    onKeyDown?: () => void;
    /** Title content; shows a tooltip when overflowed */
    title: React.ReactNode;
}

const Title = ({ title, onKeyDown }: ThumbnailCardTitleProps) => {
    const textRef = React.useRef<HTMLDivElement>(null);
    const isTextOverflowed = useIsContentOverflowed(textRef);

    return (
        <Tooltip isDisabled={!isTextOverflowed} text={title}>
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
