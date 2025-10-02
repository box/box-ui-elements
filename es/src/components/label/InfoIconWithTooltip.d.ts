import * as React from 'react';
export interface InfoIconWithTooltipProps {
    /** Custom class for the icon */
    className?: string;
    /** Optional props for the icon */
    iconProps?: Record<string, any>;
    /** Optional tooltip text for the label */
    tooltipText: React.ReactNode;
}
declare const InfoIconWithTooltip: ({ className, iconProps, tooltipText }: InfoIconWithTooltipProps) => React.JSX.Element;
export default InfoIconWithTooltip;
