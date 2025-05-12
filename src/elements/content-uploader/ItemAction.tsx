import * as React from 'react';
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import { useIntl } from 'react-intl';
import { AxiosError } from 'axios';
import { Button, IconButton, LoadingIndicator, Tooltip } from '@box/blueprint-web';
import { ArrowCurveForward, Checkmark, XMark } from '@box/blueprint-web-assets/icons/Fill';
import { Size5, SurfaceStatusSurfaceSuccess } from '@box/blueprint-web-assets/tokens/tokens';
import IconInProgress from './IconInProgress';

import {
    ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED,
    STATUS_COMPLETE,
    STATUS_ERROR,
    STATUS_IN_PROGRESS,
    STATUS_PENDING,
    STATUS_STAGED,
} from '../../constants';

import messages from '../common/messages';

import type { UploadStatus } from '../../common/types/upload';

import './ItemAction.scss';

export interface ItemActionProps {
    error?: Partial<AxiosError>;
    isFolder?: boolean;
    isResumableUploadsEnabled: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    onUpgradeCTAClick?: () => void;
    status: UploadStatus;
}

type IconComponent = ForwardRefExoticComponent<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>;

const ItemAction = ({
    error,
    isFolder = false,
    isResumableUploadsEnabled,
    onClick,
    onUpgradeCTAClick,
    status,
}: ItemActionProps) => {
    const { formatMessage } = useIntl();
    const { code } = error || {};

    const LoadingIndicatorIcon = React.forwardRef<SVGSVGElement>(() => (
        <LoadingIndicator aria-label={formatMessage(messages.loading)} className="bcu-ItemAction-loading" />
    ));

    let Icon: IconComponent = XMark;
    let tooltip;

    if (isFolder && status !== STATUS_PENDING) {
        return null;
    }

    switch (status) {
        case STATUS_COMPLETE:
            Icon = React.forwardRef<SVGSVGElement>(() => (
                <Checkmark
                    aria-label={formatMessage(messages.complete)}
                    color={SurfaceStatusSurfaceSuccess}
                    height={Size5}
                    width={Size5}
                />
            ));
            if (!isResumableUploadsEnabled) {
                tooltip = messages.remove;
            }
            break;
        case STATUS_ERROR:
            Icon = ArrowCurveForward;
            tooltip = isResumableUploadsEnabled ? messages.resume : messages.retry;
            break;
        case STATUS_IN_PROGRESS:
        case STATUS_STAGED:
            if (isResumableUploadsEnabled) {
                Icon = LoadingIndicatorIcon;
            } else {
                Icon = IconInProgress as IconComponent;
                tooltip = messages.uploadsCancelButtonTooltip;
            }
            break;
        case STATUS_PENDING:
        default:
            if (isResumableUploadsEnabled) {
                Icon = LoadingIndicatorIcon;
            } else {
                tooltip = messages.uploadsCancelButtonTooltip;
            }
            break;
    }

    if (status === STATUS_ERROR && code === ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED && !!onUpgradeCTAClick) {
        return (
            <Button
                onClick={onUpgradeCTAClick}
                data-resin-target="large_version_error_inline_upgrade_cta"
                variant="primary"
            >
                {formatMessage(messages.uploadsFileSizeLimitExceededUpgradeMessageForUpgradeCta)}
            </Button>
        );
    }

    const isDisabled = status === STATUS_STAGED;
    const tooltipText = tooltip && formatMessage(tooltip);

    return (
        <div className="bcu-item-action">
            {tooltip ? (
                <Tooltip content={tooltipText}>
                    <IconButton aria-label={tooltipText} disabled={isDisabled} icon={Icon} onClick={onClick} />
                </Tooltip>
            ) : (
                <Icon />
            )}
        </div>
    );
};

export default ItemAction;
