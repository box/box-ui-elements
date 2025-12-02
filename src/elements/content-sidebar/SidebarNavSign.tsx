import * as React from 'react';
import { FormattedMessage } from 'react-intl';

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
// @ts-ignore Module is written in Flow
import type { TargetingApi } from '../../features/targeting/types';

export interface SignSidebarProps {
    blockedReason: string;
    enabled: boolean;
    onClick: () => void;
    onClickSignMyself: () => void;
    targetingApi?: TargetingApi;
}

export function SidebarNavSign(signSidebarProps: SignSidebarProps) {
    const {
        blockedReason: boxSignBlockedReason,
        onClick: onBoxClickRequestSignature,
        onClickSignMyself: onBoxClickSignMyself,
        targetingApi: boxSignTargetingApi,
    } = signSidebarProps;

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const handleOnDropdownOpen = () => {
        setIsDropdownOpen(true);
    };

    const handleOnDropdownClose = () => {
        setIsDropdownOpen(false);
    };

    return (
        <DropdownMenu
            isResponsive
            constrainToWindow
            isRightAligned
            onMenuOpen={handleOnDropdownOpen}
            onMenuClose={handleOnDropdownClose}
        >
            <SidebarNavSignButton
                blockedReason={boxSignBlockedReason}
                isDropdownOpen={isDropdownOpen}
                targetingApi={boxSignTargetingApi}
                data-resin-target={SIDEBAR_NAV_TARGETS.SIGN}
            />
            <Menu>
                <MenuItem onClick={onBoxClickRequestSignature}>
                    <SignMeOthers32 width={16} height={16} className="bcs-SidebarNavSign-icon" />
                    <FormattedMessage {...messages.boxSignRequestSignature} />
                </MenuItem>
                <MenuItem onClick={onBoxClickSignMyself}>
                    <SignMe32 width={16} height={16} className="bcs-SidebarNavSign-icon" />
                    <FormattedMessage {...messages.boxSignSignMyself} />
                </MenuItem>
            </Menu>
        </DropdownMenu>
    );
}

export default SidebarNavSign;
