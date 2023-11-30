// @flow strict

import React, { type Element } from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../components/plain-button';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import IconPencil from '../../icons/general/IconPencil';

import { bdlGray65 } from '../../styles/variables';

import { CANCEL_ICON_TYPE, EDIT_ICON_TYPE, SAVE_ICON_TYPE } from './constants';

type IconType = typeof CANCEL_ICON_TYPE | typeof EDIT_ICON_TYPE | typeof SAVE_ICON_TYPE;
type Props = {
    className?: string,
    isUpdating?: boolean,
    onClick: void => void,
    tooltipText: Element<typeof FormattedMessage>,
    type?: IconType,
};

const IconWithTooltip = ({
    className,
    isUpdating,
    onClick,
    tooltipText,
    type,
}: Props): Element<typeof Tooltip> | null => {
    let iconBtn;

    switch (type) {
        case CANCEL_ICON_TYPE:
            iconBtn = (
                <PlainButton className={className} onClick={onClick} type="button">
                    <IconClose color={bdlGray65} height={16} width={16} />
                </PlainButton>
            );
            break;
        case EDIT_ICON_TYPE:
            iconBtn = (
                <PlainButton className={className} onClick={onClick} type="button">
                    <IconPencil color={bdlGray65} />
                </PlainButton>
            );
            break;
        case SAVE_ICON_TYPE:
            iconBtn = (
                <Button className={className} isLoading={isUpdating} onClick={onClick} type="button">
                    <IconCheck color={bdlGray65} height={16} width={16} />
                </Button>
            );
            break;
        default:
            return null;
    }

    return <Tooltip text={tooltipText}>{iconBtn}</Tooltip>;
};

export default IconWithTooltip;
