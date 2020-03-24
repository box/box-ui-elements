// @flow
import * as React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import { bdlBoxBlue } from '../../../styles/variables';
import Tooltip from '../../../components/tooltip';
import IconInfo from '../../../icons/general/IconInfo';
import './SecurityControlsItem.scss';

type Props = {
    appNames: ?MessageDescriptor,
    message: MessageDescriptor,
};

const ICON_SIZE = 13;

const SecurityControlsItem = ({ message, appNames }: Props) => (
    <li className="bdl-SecurityControlsItem">
        <FormattedMessage {...message} />
        {appNames && (
            <Tooltip
                className="bdl-SecurityControlsItem-tooltip"
                text={<FormattedMessage {...appNames} />}
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
