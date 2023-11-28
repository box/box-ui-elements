import React from 'react';
import classnames from 'classnames';
import { injectIntl, IntlShape } from 'react-intl';
import BoxSign28 from '../../icon/logo/BoxSign28';
import Sign16 from '../../icon/fill/Sign16';
import PlainButton, { PlainButtonProps } from '../../components/plain-button';
// @ts-ignore Module is written in Flow
import TargetedClickThroughGuideTooltip from '../../features/targeting/TargetedClickThroughGuideTooltip';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
// @ts-ignore Module is written in Flow
import messages from './messages';
import './SidebarNavSignButton.scss';

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
    CustomFtuxTooltip?: React.ElementType;
};

type SignButtonProps = {
    disableTooltip?: boolean;
};

export const PlaceholderTooltip = ({ children }: { children: React.ReactNode }) => children;

export function SidebarNavSignButton({ blockedReason, intl, status, targetingApi, CustomFtuxTooltip, ...rest }: Props) {
    const isSignDisabled = !!blockedReason;
    const isTargeted = targetingApi && targetingApi.canShow;
    const FtuxTooltip = !isSignDisabled && isTargeted ? TargetedClickThroughGuideTooltip : PlaceholderTooltip;
    const label = intl.formatMessage(status === 'active' ? messages.boxSignSignature : messages.boxSignRequest);
    const buttonClassName = classnames('bcs-SidebarNavSignButton', { 'bdl-is-disabled': isSignDisabled });
    const ftuxTitle = intl.formatMessage(messages.boxSignFtuxTitle);
    const ftuxBody = intl.formatMessage(messages.boxSignFtuxBody);

    let tooltipMessage = label;

    switch (blockedReason) {
        case 'shield-download':
        case 'shared-link':
        case 'shield-sign':
            tooltipMessage = intl.formatMessage(messages.boxSignSecurityBlockedTooltip);
            break;
        case 'watermark':
            tooltipMessage = intl.formatMessage(messages.boxSignWatermarkBlockedTooltip);
            break;
        default:
    }

    const SignButton = ({ disableTooltip = false }: SignButtonProps) => (
        <Tooltip isDisabled={disableTooltip} position={TooltipPosition.MIDDLE_LEFT} text={tooltipMessage}>
            <PlainButton
                aria-label={label}
                className={buttonClassName}
                data-testid="sign-button"
                isDisabled={isSignDisabled}
                {...rest}
            >
                <BoxSign28 className="bcs-SidebarNavSignButton-icon" />
                <Sign16 width={20} height={20} className="bcs-SidebarNavSignButton-icon--grayscale" />
            </PlainButton>
        </Tooltip>
    );

    if (CustomFtuxTooltip) {
        return (
            <CustomFtuxTooltip
                body={ftuxBody}
                disabled={isSignDisabled}
                renderAnchor={({ disableTooltip }: SignButtonProps = {}) => (
                    <SignButton disableTooltip={disableTooltip} />
                )}
                title={ftuxTitle}
            />
        );
    }

    return (
        <FtuxTooltip
            body={ftuxBody}
            position={TooltipPosition.MIDDLE_LEFT}
            shouldTarget={isTargeted}
            title={ftuxTitle}
            useTargetingApi={() => targetingApi}
        >
            <SignButton disableTooltip={isTargeted} />
        </FtuxTooltip>
    );
}

export default injectIntl(SidebarNavSignButton);
