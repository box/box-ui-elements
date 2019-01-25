// @flow
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

type Props = {
    label: React.Node,
    tooltip: string,
};

const CheckboxTooltip = ({ label, tooltip }: Props) => (
    <div className="checkbox-tooltip-wrapper">
        {label}
        <Tooltip text={tooltip}>
            <div className="info-tooltip">
                <IconInfo
                    height={16}
                    width={16}
                    title={<FormattedMessage {...messages.checkboxTooltipIconInfoText} />}
                />
            </div>
        </Tooltip>
    </div>
);

export default CheckboxTooltip;
