/**
 * @flow strict
 * @file Sidebar Toggle component
 * @author Box
 */

import * as React from 'react';
import { type RouterHistory } from 'react-router-dom';
import { withRouterIfEnabled } from '../common/routing';
import SidebarToggleButton from '../../components/sidebar-toggle-button/SidebarToggleButton';
import { SIDEBAR_NAV_TARGETS } from '../common/interactionTargets';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';

type Props = {
    history?: RouterHistory,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isOpen?: boolean,
    routerDisabled?: boolean,
};

const SidebarToggle = ({ 
    history, 
    internalSidebarNavigation,
    internalSidebarNavigationHandler,
    isOpen,
    routerDisabled = false,
}: Props) => {
    const handleToggleClick = event => {
        event.preventDefault();
        
        if (routerDisabled) {
            // Use internal navigation handler when router is disabled
            if (internalSidebarNavigationHandler && internalSidebarNavigation) {
                internalSidebarNavigationHandler({
                    ...internalSidebarNavigation,
                    open: !isOpen,
                }, true); // Always use replace for toggle
            }
        } else if (history) {
            history.replace({ state: { open: !isOpen } });
        }
    };

    return (
        <SidebarToggleButton
            data-resin-target={SIDEBAR_NAV_TARGETS.TOGGLE}
            data-testid="sidebartoggle"
            // $FlowFixMe
            isOpen={isOpen}
            onClick={handleToggleClick}
        />
    );
};

export { SidebarToggle as SidebarToggleComponent };
export default withRouterIfEnabled(SidebarToggle);
