// @flow
import * as React from 'react';
import { FormattedMessage, type MessageDescriptor } from 'react-intl';

import { bdlYellorange, bdlYellorange10 } from '../../../styles/variables';
import IconSecurityClassificationSolid from '../../../icons/general/IconSecurityClassificationSolid';
import { SECURITY_CONTROLS_FORMAT } from '../constants';
import type { ControlsFormat } from '../flowTypes';

import './SecurityControlsItem.scss';

type Props = {
    controlsFormat: ControlsFormat,
    fillColor?: string,
    message: MessageDescriptor,
    strokeColor?: string,
};

const ICON_SIZE = 13;

const SecurityControlsItem = ({ controlsFormat, fillColor, message, strokeColor }: Props) => {
    const shouldRenderIcon = controlsFormat !== SECURITY_CONTROLS_FORMAT.FULL;

    return (
        <li className="bdl-SecurityControlsItem">
            {shouldRenderIcon && (
                <span className="bdl-SecurityControlsItem-icon">
                    <IconSecurityClassificationSolid
                        fillColor={fillColor}
                        strokeColor={strokeColor}
                        height={ICON_SIZE}
                        width={ICON_SIZE}
                        strokeWidth={3}
                    />
                </span>
            )}
            <FormattedMessage {...message} />
        </li>
    );
};

SecurityControlsItem.defaultProps = {
    fillColor: bdlYellorange10,
    strokeColor: bdlYellorange,
};

export default SecurityControlsItem;
