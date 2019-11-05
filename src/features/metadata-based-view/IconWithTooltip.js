// @flow strict

import React, { type Element } from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import IconPencil from '../../icons/general/IconPencil';

import { bdlGray62 } from '../../styles/variables';

import { CANCEL_ICON_TYPE, EDIT_ICON_TYPE, SAVE_ICON_TYPE } from './constants';

type IconType = typeof CANCEL_ICON_TYPE | typeof EDIT_ICON_TYPE | typeof SAVE_ICON_TYPE;
type Props = {
    className?: string,
    onClick: void => void,
    tooltipText: Element<typeof FormattedMessage>,
    type?: IconType,
};

const IconWithTooltip = ({ className, onClick, tooltipText, type }: Props): Element<typeof Tooltip> | null => {
    let icon;

    switch (type) {
        case CANCEL_ICON_TYPE:
            icon = <IconClose color={bdlGray62} width={16} height={16} />;
            break;
        case EDIT_ICON_TYPE:
            icon = <IconPencil color={bdlGray62} />;
            break;
        case SAVE_ICON_TYPE:
            icon = <IconCheck color={bdlGray62} width={16} height={16} />;
            break;
        default:
            return null;
    }

    return (
        <Tooltip text={tooltipText}>
            <PlainButton className={className} type="button" onClick={onClick}>
                {icon}
            </PlainButton>
        </Tooltip>
    );
};

export default IconWithTooltip;
