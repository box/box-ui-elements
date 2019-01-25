/**
 * @flow
 * @file Open With dropdown menu
 * @author Box
 */

import * as React from 'react';
import DropdownMenu from 'components/dropdown-menu/DropdownMenu';
import Menu from 'components/menu/Menu';
import OpenWithDropdownMenuItem from './OpenWithDropdownMenuItem';
import MultipleIntegrationsOpenWithButton from './MultipleIntegrationsOpenWithButton';

type Props = {
    integrations: Array<Integration>,
    dropdownAlignment: Alignment,
    onClick: Function,
};

const RIGHT_ALIGNMENT = 'right';

const OpenWithDropdownMenu = ({ dropdownAlignment = RIGHT_ALIGNMENT, integrations, onClick }: Props) => (
    <DropdownMenu isRightAligned={dropdownAlignment === RIGHT_ALIGNMENT}>
        <MultipleIntegrationsOpenWithButton />
        <Menu className="bcow-menu">
            {integrations.map(integration => (
                <OpenWithDropdownMenuItem
                    integration={integration}
                    onClick={onClick}
                    key={integration.appIntegrationId}
                />
            ))}
        </Menu>
    </DropdownMenu>
);

export default OpenWithDropdownMenu;
