/**
 * @flow
 * @file Open With dropdown menu
 * @author Box
 */

import * as React from 'react';
import DropdownMenu from '../../components/dropdown-menu/DropdownMenu';
import Menu from '../../components/menu/Menu';
import OpenWithDropdownMenuItem from './OpenWithDropdownMenuItem';
import MultipleIntegrationsOpenWithButton from './MultipleIntegrationsOpenWithButton';
import type { Alignment } from '../common/flowTypes';
import type { Integration } from '../../common/types/integrations';

type Props = {
    dropdownAlignment: Alignment,
    integrations: Array<Integration>,
    onClick: Function,
};

const RIGHT_ALIGNMENT = 'right';

const OpenWithDropdownMenu = ({ dropdownAlignment = RIGHT_ALIGNMENT, integrations, onClick }: Props) => (
    <DropdownMenu isRightAligned={dropdownAlignment === RIGHT_ALIGNMENT}>
        <MultipleIntegrationsOpenWithButton />
        <Menu className="bcow-menu">
            {integrations.map(integration => (
                <OpenWithDropdownMenuItem
                    key={integration.appIntegrationId}
                    integration={integration}
                    onClick={onClick}
                />
            ))}
        </Menu>
    </DropdownMenu>
);

export default OpenWithDropdownMenu;
