/**
 * @flow
 * @file Open With dropdown menu item
 * @author Box
 */

import * as React from 'react';
import MenuItem from 'box-react-ui/lib/components/menu/MenuItem';
import IconFileDefault from 'box-react-ui/lib/icons/file/IconFileDefault';
import { FormattedMessage } from 'react-intl';
import ICON_FILE_MAP from './IconFileMap';
import messages from '../messages';

type Props = {
    integration: Integration,
    onClick: Function,
};

const OpenWithDropdownMenuItem = ({ integration, onClick }: Props) => {
    const { displayName, displayDescription, isDisabled, disabledReasons } = integration;
    const Icon = ICON_FILE_MAP[displayName] || IconFileDefault;
    // Use the first disabled reason as the description if the integration is disabled.
    const errorDescription = disabledReasons[0] || <FormattedMessage {...messages.errorOpenWithDescription} />;
    const description = isDisabled ? errorDescription : displayDescription;
    return (
        <MenuItem isDisabled={isDisabled} onClick={() => onClick(integration)}>
            <Icon />
            <span>
                <p className="bcow-menu-item-title">{displayName}</p>
                <p className="bcow-menu-item-description">{description}</p>
            </span>
        </MenuItem>
    );
};

export default OpenWithDropdownMenuItem;
