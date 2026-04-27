import * as React from 'react';

import { Focusable, Tooltip, TooltipProvider } from '@box/blueprint-web';
import { InfoBadge } from '@box/blueprint-web-assets/icons/Fill';

import { bdlBoxBlue } from 'src/styles/variables';

export interface CheckboxTooltipProps {
    tooltip: string;
}

const CheckboxTooltip = ({ tooltip }: CheckboxTooltipProps) => (
    <div className="checkbox-tooltip-wrapper">
        <TooltipProvider>
            <Tooltip content={tooltip}>
                <Focusable>
                    <InfoBadge
                        aria-label={tooltip}
                        color={bdlBoxBlue}
                        className="info-tooltip"
                        height={16}
                        width={16}
                    />
                </Focusable>
            </Tooltip>
        </TooltipProvider>
    </div>
);

export default CheckboxTooltip;
