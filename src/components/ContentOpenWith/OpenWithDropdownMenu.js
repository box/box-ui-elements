/**
 * @flow
 * @file Open With dropdown menu
 * @author Box
 */

import * as React from 'react';
import DropdownMenu from 'box-react-ui/lib/components/dropdown-menu/DropdownMenu';
import Menu from 'box-react-ui/lib/components/menu/Menu';
import OpenWithDropdownMenuItem from './OpenWithDropdownMenuItem';
import MultipleIntegrationsOpenWithButton from './MultipleIntegrationsOpenWithButton';

type Props = {
    integrations: ?Array<Integration>,
    isRightAligned: boolean,
    onClick: Function,
};

const OpenWithDropdownMenu = ({ isRightAligned = true, integrations, onClick }: Props) => (
    <DropdownMenu isRightAligned={isRightAligned}>
        <MultipleIntegrationsOpenWithButton />
        <Menu className="bcow-menu">
            {integrations &&
                integrations.map(integration => (
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
