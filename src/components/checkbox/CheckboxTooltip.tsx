import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import IconInfo from '../../icons/general/IconInfo';
import Tooltip from '../tooltip';

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
        <Tooltip text={tooltip}>
            <div className="info-tooltip">
                <IconInfo
                    height={16}
                    title={<FormattedMessage {...messages.checkboxTooltipIconInfoText} />}
                    width={16}
                />
            </div>
        </Tooltip>
    </div>
);

export default CheckboxTooltip;
