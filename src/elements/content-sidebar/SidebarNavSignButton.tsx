import * as React from 'react';
import classnames from 'classnames';
import { injectIntl, IntlShape } from 'react-intl';
import SignIcon from '@box/blueprint-web-assets/icons/Medium/Sign';
import { IconIconBlue, Size5 } from '@box/blueprint-web-assets/tokens/tokens';
import { Tooltip as BPTooltip } from '@box/blueprint-web';
import BoxSign28 from '../../icon/logo/BoxSign28';
import Sign16 from '../../icon/fill/Sign16';
import PlainButton, { PlainButtonProps } from '../../components/plain-button';
// @ts-ignore Module is written in Flow
import TargetedClickThroughGuideTooltip from '../../features/targeting/TargetedClickThroughGuideTooltip';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
import { useFeatureConfig } from '../common/feature-checking';
// @ts-ignore Module is written in Flow
import messages from './messages';
import './SidebarNavSignButton.scss';

export type Props = PlainButtonProps & {
    blockedReason?: string;
    isDropdownOpen: boolean;
    intl: IntlShape;
    targetingApi?: {
        canShow: boolean;
        onClose: () => void;
        onComplete: () => void;
        onShow: () => void;
    };
};

export const PlaceholderTooltip = ({ children }: { children: React.ReactNode }) => children;

export function SidebarNavSignButton({ blockedReason, intl, isDropdownOpen, targetingApi, ...rest }: Props) {
    const isSignDisabled = !!blockedReason;
    const isTargeted = targetingApi?.canShow;
    const FtuxTooltip = !isSignDisabled && isTargeted ? TargetedClickThroughGuideTooltip : PlaceholderTooltip;
    const label = intl.formatMessage(messages.boxSignRequest);
    const buttonClassName = classnames('bcs-SidebarNavSignButton', { 'bdl-is-disabled': isSignDisabled });
    const { enabled: isPreviewModernizationEnabled } = useFeatureConfig('previewModernization');

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

    const renderButtonWithTooltip = () => {
        // Use Blueprint tooltip when modernization is enabled
        if (isPreviewModernizationEnabled) {
            const modernizedButton = (
                <PlainButton
                    aria-label={label}
                    className={buttonClassName}
                    data-testid="sign-button"
                    isDisabled={isSignDisabled}
                    {...rest}
                >
                    <SignIcon height={Size5} width={Size5} color={isDropdownOpen ? IconIconBlue : undefined} />
                </PlainButton>
            );

            if (isTargeted) {
                return modernizedButton;
            }

            return (
                <BPTooltip content={tooltipMessage} side="left">
                    {/* Workaround to attach BP tooltip to legacy button, remove span when buttons are migrated to BP */}
                    <span>{modernizedButton}</span>
                </BPTooltip>
            );
        }

        // Use legacy tooltip by default
        return (
            <Tooltip position={TooltipPosition.MIDDLE_LEFT} text={tooltipMessage} isDisabled={isTargeted}>
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
    };

    return (
        <FtuxTooltip
            body={intl.formatMessage(messages.boxSignFtuxBody)}
            position={TooltipPosition.MIDDLE_LEFT}
            shouldTarget={isTargeted}
            title={intl.formatMessage(messages.boxSignFtuxTitle)}
            useTargetingApi={() => targetingApi}
        >
            {renderButtonWithTooltip()}
        </FtuxTooltip>
    );
}

export default injectIntl(SidebarNavSignButton);
