// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { bdlBoxBlue } from '../../../styles/variables';
import Tooltip from '../../../components/tooltip';
import IconInfo from '../../../icons/general/IconInfo';
import type { MessageItem } from '../flowTypes';

import './SecurityControlsItem.scss';

type Props = MessageItem;

const ICON_SIZE = 13;

const SecurityControlsItem = ({ message, tooltipMessage }: Props) => {
    return (
        <li className="bdl-SecurityControlsItem">
            {/* $FlowFixMe */}
            {React.isValidElement(message) ? message : <FormattedMessage {...message} />}
            {tooltipMessage && (
                <Tooltip
                    className="bdl-SecurityControlsItem-tooltip"
                    isTabbable={false}
                    position="middle-right"
                    text={<FormattedMessage {...tooltipMessage} />}
                >
                    <span className="bdl-SecurityControlsItem-tooltipIcon">
                        <IconInfo color={bdlBoxBlue} height={ICON_SIZE} width={ICON_SIZE} />
                    </span>
                </Tooltip>
            )}
        </li>
    );
};

export default SecurityControlsItem;
