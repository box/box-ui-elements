/**
 * @flow
 * @file Item action component
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import assign from 'lodash/assign';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import IconInProgress from './IconInProgress';
import IconRetry from '../../icons/general/IconRetry';
import LoadingIndicator from '../../components/loading-indicator';
import PlainButton from '../../components/plain-button/PlainButton';
import Tooltip from '../../components/tooltip';
import messages from '../common/messages';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_STAGED, STATUS_COMPLETE, STATUS_ERROR } from '../../constants';

import './ItemAction.scss';

const ICON_CHECK_COLOR = '#26C281';

type Props = {
    isFolder?: boolean,
    isResumableUploadsEnabled: boolean,
    onClick: Function,
    overrideSettings?: {},
    status: UploadStatus,
} & InjectIntlProvidedProps;

const ItemAction = ({
    status,
    onClick,
    intl,
    isResumableUploadsEnabled,
    isFolder = false,
    overrideSettings = {},
}: Props) => {
    if (isFolder && status !== STATUS_PENDING) {
        return null;
    }

    const defaultSetting = {
        icon: isResumableUploadsEnabled ? <LoadingIndicator /> : <IconClose />,
        tooltip: !isResumableUploadsEnabled ? messages.uploadsCancelButtonTooltip : null,
        tooltipPosition: 'top-left',
        target: null,
    };

    const setting = {
        [STATUS_COMPLETE]: {
            icon: <IconCheck color={ICON_CHECK_COLOR} />,
            tooltip: !isResumableUploadsEnabled ? messages.remove : null,
        },
        [STATUS_ERROR]: {
            icon: <IconRetry height={24} width={24} />,
            tooltip: isResumableUploadsEnabled ? messages.resume : messages.retry,
            target: 'uploadretry',
        },
        [STATUS_IN_PROGRESS]: {
            icon: isResumableUploadsEnabled ? <LoadingIndicator /> : <IconInProgress />,
            tooltip: !isResumableUploadsEnabled ? messages.uploadsCancelButtonTooltip : null,
            target: 'uploadcancel',
        },
        [STATUS_STAGED]: {
            icon: isResumableUploadsEnabled ? <LoadingIndicator /> : <IconInProgress />,
            tooltip: !isResumableUploadsEnabled ? messages.uploadsCancelButtonTooltip : null,
            target: 'uploadcancel',
        },
    };

    // default icon, target, tooltip settings are overriden by 'setting' of respective 'status'
    // these options can be further overriden by 'overrideSettings' passed in as argument to the component
    const { icon, target, tooltip, tooltipPosition } = assign(
        defaultSetting,
        setting[status],
        overrideSettings[status],
    );

    const resin = target ? { 'data-resin-target': target } : {};

    return (
        <div className="bcu-item-action">
            {tooltip ? (
                <Tooltip position={tooltipPosition} text={intl.formatMessage(tooltip)}>
                    <PlainButton onClick={onClick} type="button" isDisabled={status === STATUS_STAGED} {...resin}>
                        {icon}
                    </PlainButton>
                </Tooltip>
            ) : (
                icon
            )}
        </div>
    );
};

export { ItemAction as ItemActionForTesting };
export default injectIntl(ItemAction);
