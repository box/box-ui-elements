/**
 * @flow strict
 * @file Sidebar Toggle component
 * @author Box
 */

import * as React from 'react';
import withRouter from '../common/routing/withRouter';
import { RouterHistory } from '../common/routing/flowTypes';
import SidebarToggleButton from '../../components/sidebar-toggle-button/SidebarToggleButton';
import { SIDEBAR_NAV_TARGETS } from '../common/interactionTargets';

type Props = {
    history: RouterHistory,
    isOpen?: boolean,
};

const SidebarToggle = ({ history, isOpen }: Props) => {
    return (
        <SidebarToggleButton
            data-resin-target={SIDEBAR_NAV_TARGETS.TOGGLE}
            data-testid="sidebartoggle"
            // $FlowFixMe
            isOpen={isOpen}
            onClick={event => {
                event.preventDefault();
                history.replace({ state: { open: !isOpen } });
            }}
        />
    );
};

export { SidebarToggle as SidebarToggleComponent };
export default withRouter(SidebarToggle);
