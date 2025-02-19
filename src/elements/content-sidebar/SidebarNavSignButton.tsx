import * as React from 'react';
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
    targetingApi?: {
        canShow: boolean;
        onClose: () => void;
        onComplete: () => void;
        onShow: () => void;
    };
};

export const PlaceholderTooltip = ({ children }: { children: React.ReactNode }) => children;

export function SidebarNavSignButton({ blockedReason, intl, targetingApi, ...rest }: Props) {
    const isSignDisabled = !!blockedReason;
    const isTargeted = targetingApi?.canShow;
    const FtuxTooltip = !isSignDisabled && isTargeted ? TargetedClickThroughGuideTooltip : PlaceholderTooltip;
    const label = intl.formatMessage(messages.boxSignRequest);
    const buttonClassName = classnames('bcs-SidebarNavSignButton', { 'bdl-is-disabled': isSignDisabled });

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
                    data-testid="sign-button"
                    isDisabled={isSignDisabled}
                    {...rest}
                >
                    <BoxSign28 className="bcs-SidebarNavSignButton-icon" />
                    <Sign16 width={20} height={20} className="bcs-SidebarNavSignButton-icon--grayscale" />
                </PlainButton>
            </Tooltip>
        </FtuxTooltip>
    );
}

export default injectIntl(SidebarNavSignButton);
