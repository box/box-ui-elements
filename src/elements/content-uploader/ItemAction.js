/**
 * @flow
 * @file Item action component
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import IconInProgress from './IconInProgress';
import IconRetry from '../../icons/general/IconRetry';
import LoadingIndicator from '../../components/loading-indicator';
import PlainButton from '../../components/plain-button/PlainButton';
import Tooltip from '../../components/tooltip';
import messages from '../common/messages';
import { STATUS_PENDING, STATUS_IN_PROGRESS, STATUS_STAGED, STATUS_COMPLETE, STATUS_ERROR } from '../../constants';
import type { UploadStatus } from '../../common/types/upload';

import './ItemAction.scss';

const ICON_CHECK_COLOR = '#26C281';

type Props = {
    isFolder?: boolean,
    isResumableUploadsEnabled: boolean,
    onClick: Function,
    status: UploadStatus,
} & InjectIntlProvidedProps;

const ItemAction = ({ status, onClick, intl, isResumableUploadsEnabled, isFolder = false }: Props) => {
    let icon = <IconClose />;
    let tooltip;

    if (isFolder && status !== STATUS_PENDING) {
        return null;
    }

    switch (status) {
        case STATUS_COMPLETE:
            icon = <IconCheck color={ICON_CHECK_COLOR} />;
            if (!isResumableUploadsEnabled) {
                tooltip = messages.remove;
            }
            break;
        case STATUS_ERROR:
            icon = <IconRetry height={24} width={24} />;
            tooltip = isResumableUploadsEnabled ? messages.resume : messages.retry;
            break;
        case STATUS_IN_PROGRESS:
        case STATUS_STAGED:
            if (isResumableUploadsEnabled) {
                icon = <LoadingIndicator />;
            } else {
                icon = <IconInProgress />;
                tooltip = messages.uploadsCancelButtonTooltip;
            }
            break;
        case STATUS_PENDING:
        default:
            if (isResumableUploadsEnabled) {
                icon = <LoadingIndicator />;
            } else {
                tooltip = messages.uploadsCancelButtonTooltip;
            }
            break;
    }

    return (
        <div className="bcu-item-action">
            {tooltip ? (
                <Tooltip position="top-left" text={intl.formatMessage(tooltip)}>
                    <PlainButton onClick={onClick} type="button" isDisabled={status === STATUS_STAGED}>
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
