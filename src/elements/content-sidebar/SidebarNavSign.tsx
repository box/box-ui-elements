import React from 'react';
import { FormattedMessage } from 'react-intl';

// @ts-ignore Module is written in Flow
import { useFeatureConfig } from '../common/feature-checking';
// @ts-ignore Module is written in Flow
import { SIDEBAR_NAV_TARGETS } from '../common/interactionTargets';

// @ts-ignore Module is written in Flow
import DropdownMenu from '../../components/dropdown-menu';
import SidebarNavSignButton from './SidebarNavSignButton';
import SignMe32 from '../../icon/fill/SignMe32';
import SignMeOthers32 from '../../icon/fill/SignMeOthers32';
import { Menu, MenuItem } from '../../components/menu';

// @ts-ignore Module is written in Flow
import messages from './messages';

import './SidebarNavSign.scss';

export function SidebarNavSign() {
    const {
        blockedReason: boxSignBlockedReason,
        onClick: onBoxClickRequestSignature,
        onClickSignMyself: onBoxClickSignMyself,
        status: boxSignStatus,
        targetingApi: boxSignTargetingApi,
        isSignRemoveInterstitialEnabled,
    } = useFeatureConfig('boxSign');

    return (
        <>
            {isSignRemoveInterstitialEnabled ? (
                <DropdownMenu constrainToWindow isResponsive isRightAligned>
                    <SidebarNavSignButton
                        blockedReason={boxSignBlockedReason}
                        data-resin-target={SIDEBAR_NAV_TARGETS.SIGN}
                        status={boxSignStatus}
                        targetingApi={boxSignTargetingApi}
                    />
                    <Menu>
                        <MenuItem data-testid="sign-request-signature-button" onClick={onBoxClickRequestSignature}>
                            <SignMeOthers32 className="bcs-SidebarNavSign-icon" height={16} width={16} />
                            <FormattedMessage {...messages.boxSignRequestSignature} />
                        </MenuItem>
                        <MenuItem data-testid="sign-sign-myself-button" onClick={onBoxClickSignMyself}>
                            <SignMe32 className="bcs-SidebarNavSign-icon" height={16} width={16} />
                            <FormattedMessage {...messages.boxSignSignMyself} />
                        </MenuItem>
                    </Menu>
                </DropdownMenu>
            ) : (
                <SidebarNavSignButton
                    blockedReason={boxSignBlockedReason}
                    data-resin-target={SIDEBAR_NAV_TARGETS.SIGN}
                    onClick={onBoxClickRequestSignature}
                    status={boxSignStatus}
                    targetingApi={boxSignTargetingApi}
                />
            )}
        </>
    );
}

export default SidebarNavSign;
