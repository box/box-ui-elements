import React from 'react';
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

export function SidebarNavSign({ intl, status, targetingApi, ...rest }: Props) {
    const isTargeted = targetingApi && targetingApi.canShow;
    const FtuxTooltip = isTargeted ? TargetedClickThroughGuideTooltip : PlaceholderTooltip;
    const label = intl.formatMessage(status === 'active' ? messages.boxSignSignature : messages.boxSignRequest);

    return (
        <FtuxTooltip
            body={intl.formatMessage(messages.boxSignFtuxBody)}
            position={TooltipPosition.MIDDLE_LEFT}
            shouldTarget={isTargeted}
            title={intl.formatMessage(messages.boxSignFtuxTitle)}
            useTargetingApi={() => targetingApi}
        >
            <Tooltip isDisabled={isTargeted} position={TooltipPosition.MIDDLE_LEFT} text={label}>
                <PlainButton aria-label={label} className="bcs-SidebarNavSign" {...rest}>
                    <BoxSign28 className="bcs-SidebarNavSign-icon" />
                </PlainButton>
            </Tooltip>
        </FtuxTooltip>
    );
}

export default injectIntl(SidebarNavSign);
