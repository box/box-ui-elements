/**
 * @flow
 * @file Open With dropdown menu item
 * @author Box
 */

import * as React from 'react';
import MenuItem from 'box-react-ui/lib/components/menu/MenuItem';
import { FormattedMessage } from 'react-intl';
import getIcon from './IconFileMap';
import messages from '../messages';

type Props = {
    integration: Integration,
    onClick: Function,
};

const OpenWithDropdownMenuItem = ({ integration, onClick }: Props) => {
    const { displayName, displayDescription, isDisabled, extension, disabledReasons } = integration;
    const Icon = getIcon(displayName);
    // Use the first disabled reason as the description if the integration is disabled.
    const errorDescription = disabledReasons[0] || <FormattedMessage {...messages.errorOpenWithDescription} />;
    const description = isDisabled ? errorDescription : displayDescription;
    return (
        <MenuItem isDisabled={isDisabled} onClick={() => onClick(integration)}>
            <Icon extension={extension} />
            <span>
                <p className="bcow-menu-item-title">{displayName}</p>
                <p className="bcow-menu-item-description">{description}</p>
            </span>
        </MenuItem>
    );
};

export default OpenWithDropdownMenuItem;
