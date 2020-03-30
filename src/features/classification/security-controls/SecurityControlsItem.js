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

const SecurityControlsItem = ({ message, tooltipMessage }: Props) => (
    <li className="bdl-SecurityControlsItem">
        <FormattedMessage {...message} />
        {tooltipMessage && (
            <Tooltip
                className="bdl-SecurityControlsItem-tooltip"
                text={<FormattedMessage {...tooltipMessage} />}
                position="middle-right"
                isTabbable={false}
            >
                <span className="bdl-SecurityControlsItem-tooltipIcon">
                    <IconInfo color={bdlBoxBlue} width={ICON_SIZE} height={ICON_SIZE} />
                </span>
            </Tooltip>
        )}
    </li>
);

export default SecurityControlsItem;
