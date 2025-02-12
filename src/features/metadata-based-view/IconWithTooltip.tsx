import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import ButtonAdapter from '../../components/button/ButtonAdapter';
import Tooltip from '../../components/tooltip';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import IconPencil from '../../icons/general/IconPencil';

import { bdlGray65 } from '../../styles/variables';

import { CANCEL_ICON_TYPE, EDIT_ICON_TYPE, SAVE_ICON_TYPE } from './constants';

type IconType = typeof CANCEL_ICON_TYPE | typeof EDIT_ICON_TYPE | typeof SAVE_ICON_TYPE;

interface Props {
    className?: string;
    isUpdating?: boolean;
    onClick: () => void;
    tooltipText: React.ReactElement<typeof FormattedMessage> & { props: MessageDescriptor & { defaultMessage: string } };
    type?: IconType;
}

const IconWithTooltip = ({
    className,
    isUpdating,
    onClick,
    tooltipText,
    type,
}: Props): React.ReactElement | null => {
    const intl = useIntl();
    let iconBtn;

    switch (type) {
        case CANCEL_ICON_TYPE:
            iconBtn = (
                <ButtonAdapter 
                    className={className} 
                    type="button" 
                    onClick={onClick}
                    aria-label={intl.formatMessage(tooltipText.props)}
                >
                    {intl.formatMessage(tooltipText.props)}
                </ButtonAdapter>
            );
            break;
        case EDIT_ICON_TYPE:
            iconBtn = (
                <ButtonAdapter 
                    className={className} 
                    type="button" 
                    onClick={onClick}
                    aria-label={intl.formatMessage(tooltipText.props)}
                >
                    {intl.formatMessage(tooltipText.props)}
                </ButtonAdapter>
            );
            break;
        case SAVE_ICON_TYPE:
            iconBtn = (
                <ButtonAdapter 
                    className={className} 
                    isLoading={isUpdating} 
                    type="button" 
                    onClick={onClick}
                    aria-label={intl.formatMessage(tooltipText.props)}
                >
                    {intl.formatMessage(tooltipText.props)}
                </ButtonAdapter>
            );
            break;
        default:
            return null;
    }

    return <Tooltip text={tooltipText}>{iconBtn}</Tooltip>;
};

export default IconWithTooltip;
