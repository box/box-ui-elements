// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import type { MessageDescriptor } from 'react-intl';

import Tooltip from '../../../components/tooltip';
import IconInfo from '../../../icons/general/IconInfo';
import { bdlBoxBlue } from '../../../styles/variables';

import './SecurityControlsItem.scss';

const ICON_SIZE = 14;

type Props = {
    message: MessageDescriptor,
    tooltipItems: Array<MessageDescriptor>,
};

const SecurityControlsItem = ({ message, tooltipItems }: Props) => {
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
                <Tooltip text={tooltipContent} position="middle-left">
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
