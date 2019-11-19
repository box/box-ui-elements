// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import type { MessageDescriptor } from 'react-intl';
import type { Position } from '../../../components/tooltip';

import Tooltip from '../../../components/tooltip';
import IconInfo from '../../../icons/general/IconInfo';
import { bdlBoxBlue } from '../../../styles/variables';

import './SecurityControlsItem.scss';

const ICON_SIZE = 14;

type Props = {
    message: MessageDescriptor,
    tooltipItems: Array<MessageDescriptor>,
    tooltipPosition?: Position,
};

const SecurityControlsItem = ({ message, tooltipItems, tooltipPosition }: Props) => {
    const isTooltipEnabled = tooltipItems.length > 0;

    const tooltipContent = (
        <div className="bdl-SecurityControlsItem-tooltipContent">
            {tooltipItems.map((itemMessage, index) => (
                <FormattedMessage key={index} tagName="p" {...itemMessage} />
            ))}
        </div>
    );

    return (
        <li className="bdl-SecurityControlsItem">
            <FormattedMessage {...message} />
            {isTooltipEnabled && (
                <Tooltip text={tooltipContent} position={tooltipPosition}>
                    <span className="bdl-SecurityControlsItem-tooltipIcon">
                        <IconInfo color={bdlBoxBlue} width={ICON_SIZE} height={ICON_SIZE} />
                    </span>
                </Tooltip>
            )}
        </li>
    );
};

SecurityControlsItem.defaultProps = {
    tooltipItems: [],
};

export default SecurityControlsItem;
