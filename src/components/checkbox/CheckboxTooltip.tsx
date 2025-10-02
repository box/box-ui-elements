import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tooltip, TooltipProvider } from '@box/blueprint-web';
import IconInfo from '../../icons/general/IconInfo';

const messages = defineMessages({
    checkboxTooltipIconInfoText: {
        defaultMessage: 'Info',
        description: 'Icon to display more information on the checkbox',
        id: 'boxui.checkboxTooltip.iconInfoText',
    },
});

export interface CheckboxTooltipProps {
    tooltip: string;
}

const CheckboxTooltip = ({ tooltip }: CheckboxTooltipProps) => (
    <div className="checkbox-tooltip-wrapper">
        <TooltipProvider>
            <Tooltip content={tooltip}>
                <div className="info-tooltip">
                    <IconInfo
                        height={16}
                        title={<FormattedMessage {...messages.checkboxTooltipIconInfoText} />}
                        width={16}
                    />
                </div>
            </Tooltip>
        </TooltipProvider>
    </div>
);

export default CheckboxTooltip;
