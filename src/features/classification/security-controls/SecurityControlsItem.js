// @flow
import * as React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import { bdlYellorange } from '../../../styles/variables';
import IconSecurityClassificationSolid from '../../../icons/general/IconSecurityClassificationSolid';
import { SECURITY_CONTROLS_FORMAT } from '../constants';
import type { ControlsFormat } from '../flowTypes';

import './SecurityControlsItem.scss';

type Props = {
    controlsFormat: ControlsFormat,
    message: MessageDescriptor,
};

const SecurityControlsItem = ({ controlsFormat, message }: Props) => {
    const shouldRenderIcon = controlsFormat !== SECURITY_CONTROLS_FORMAT.FULL;

    return (
        <li className="bdl-SecurityControlsItem">
            {shouldRenderIcon && (
                <IconSecurityClassificationSolid color={bdlYellorange} height={11} width={11} strokeWidth={3} />
            )}
            <FormattedMessage {...message} />
        </li>
    );
};

export default SecurityControlsItem;
