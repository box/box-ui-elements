// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import type { MessageDescriptor } from 'react-intl';

import Tooltip from '../../../components/tooltip';
import IconInfo from '../../../icons/general/IconInfo';
import { bdlBoxBlue, bdlYellorange } from '../../../styles/variables';
// import { Modal, ModalActions } from '../../../components/modal';

import IconSecurityClassification from '../../../icons/general/IconSecurityClassification';
// import messages from './messages';

import './SecurityControlsItem.scss';

const ICON_SIZE = 16;

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
            <IconSecurityClassification
                color={bdlYellorange}
                height={11}
                width={11}
                strokeWidth={3}
                className="reverse"
            />
            <FormattedMessage {...message} />
            {isTooltipEnabled && (
                <Tooltip className="bdl-SecurityControlsItem-tooltip" text={tooltipContent} position="middle-left">
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
