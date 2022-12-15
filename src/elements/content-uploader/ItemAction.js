/**
 * @flow
 * @file Item action component displayed on the upload toast, e.g. cancel/resume
 */

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import IconInProgress from './IconInProgress';
import IconRetry from '../../icons/general/IconRetry';
import LoadingIndicator from '../../components/loading-indicator';
import PlainButton from '../../components/plain-button/PlainButton';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import Tooltip from '../../components/tooltip';
import messages from '../common/messages';
import {
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
} from '../../constants';
import type { UploadStatus } from '../../common/types/upload';

import './ItemAction.scss';

const ICON_CHECK_COLOR = '#26C281';

type Props = {
    error?: Object,
    isFolder?: boolean,
    isResumableUploadsEnabled: boolean,
    onClick: Function,
    onUpgradeCTAClick?: Function,
    status: UploadStatus,
} & InjectIntlProvidedProps;

const ItemAction = ({
    error = {},
    intl,
    isFolder = false,
    isResumableUploadsEnabled,
    onClick,
    onUpgradeCTAClick,
    status,
}: Props) => {
    let icon = <IconClose />;
    let tooltip;
    const { code } = error;
    const { formatMessage } = intl;

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

    if (status === STATUS_ERROR && code === ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED && !!onUpgradeCTAClick) {
        return (
            <PrimaryButton
                onClick={onUpgradeCTAClick}
                data-resin-target="large_version_error_inline_upgrade_cta"
                type="button"
            >
                <FormattedMessage {...messages.uploadsFileSizeLimitExceededUpgradeMessageForUpgradeCta} />
            </PrimaryButton>
        );
    }
    const isDisabled = status === STATUS_STAGED;
    const tooltipText = tooltip && formatMessage(tooltip);

    return (
        <div className="bcu-item-action">
            {tooltip ? (
                <Tooltip position="top-left" text={tooltipText}>
                    <PlainButton aria-label={tooltipText} isDisabled={isDisabled} onClick={onClick} type="button">
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
