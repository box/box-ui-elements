import * as React from 'react';
import { Focusable, Tooltip, TooltipProvider } from '@box/blueprint-web';

import InfoBadge16 from '../../icon/fill/InfoBadge16';

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
        <TooltipProvider>
            <Tooltip content={tooltipText}>
                <Focusable>
                    <span className="info-icon-container">
                        <InfoBadge16 {...iconProps} />
                    </span>
                </Focusable>
            </Tooltip>
        </TooltipProvider>
    </span>
);

export default InfoIconWithTooltip;
