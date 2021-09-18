import React from 'react';
import classnames from 'classnames';
import { injectIntl, IntlShape } from 'react-intl';
import BoxSign28 from '../../icon/logo/BoxSign28';
import PlainButton, { PlainButtonProps } from '../../components/plain-button';
// @ts-ignore Module is written in Flow
import TargetedClickThroughGuideTooltip from '../../features/targeting/TargetedClickThroughGuideTooltip';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
// @ts-ignore Module is written in Flow
import messages from './messages';
import './SidebarNavSign.scss';

export type Props = PlainButtonProps & {
    blockedReason?: string;
    intl: IntlShape;
    status?: string;
    targetingApi?: {
        canShow: boolean;
        onClose: () => void;
        onComplete: () => void;
        onShow: () => void;
    };
};

export const PlaceholderTooltip = ({ children }: { children: React.ReactNode }) => children;

export function SidebarNavSign({ blockedReason, intl, isDisabled, status, targetingApi, ...rest }: Props) {
    const isTargeted = targetingApi && targetingApi.canShow;
    const FtuxTooltip = isTargeted ? TargetedClickThroughGuideTooltip : PlaceholderTooltip;
    const label = intl.formatMessage(status === 'active' ? messages.boxSignSignature : messages.boxSignRequest);
    let tooltipMessage = label;

    let isSignDisabled = false;
    switch (blockedReason) {
        case 'shield-download':
        case 'shared-link':
            isSignDisabled = true;
            tooltipMessage = intl.formatMessage(messages.boxSignSecurityBlockedTooltip);
            break;
        case 'watermark':
            isSignDisabled = true;
            tooltipMessage = intl.formatMessage(messages.boxSignWatermarkBlockedTooltip);
            break;
        default:
    }

    const buttonClassName = classnames('bcs-SidebarNavSign', { 'bdl-is-disabled': isDisabled || isSignDisabled });

    return (
        <FtuxTooltip
            body={intl.formatMessage(messages.boxSignFtuxBody)}
            position={TooltipPosition.MIDDLE_LEFT}
            shouldTarget={isTargeted}
            title={intl.formatMessage(messages.boxSignFtuxTitle)}
            useTargetingApi={() => targetingApi}
        >
            <Tooltip isDisabled={isTargeted} position={TooltipPosition.MIDDLE_LEFT} text={tooltipMessage}>
                <PlainButton
                    aria-label={label}
                    className={buttonClassName}
                    isDisabled={isDisabled || isSignDisabled}
                    {...rest}
                >
                    <BoxSign28 className="bcs-SidebarNavSign-icon" />
                </PlainButton>
            </Tooltip>
        </FtuxTooltip>
    );
}

export default injectIntl(SidebarNavSign);
