import * as React from 'react';

import Info16 from '../../icon/fill/Info16';
import Tooltip, { TooltipPosition } from '../tooltip';

export interface InfoIconWithTooltipProps {
    /** Custom class for the icon */
    className?: string;
    /** Optional props for the icon */
    iconProps?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    /** Optional tooltip text for the label */
    tooltipText: React.ReactNode;
}

const InfoIconWithTooltip = ({ className = '', iconProps, tooltipText }: InfoIconWithTooltipProps) => (
    <span key="infoIcon" className={`${className} tooltip-icon-container`}>
        <Tooltip position={TooltipPosition.TOP_CENTER} text={tooltipText}>
            <span className="info-icon-container">
                <Info16 {...iconProps} />
            </span>
        </Tooltip>
    </span>
);

export default InfoIconWithTooltip;
