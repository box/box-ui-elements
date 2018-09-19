/**
 * @flow
 * @file Open With dropdown menu item
 * @author Box
 */

import * as React from 'react';
import MenuItem from 'box-react-ui/lib/components/menu/MenuItem';
import IconFileDefault from 'box-react-ui/lib/icons/file/IconFileDefault';
import ICON_FILE_MAP from './IconFileMap';

type Props = {
    integration: Integration,
    onClick: Function,
};

const OpenWithDropdownMenuItem = ({
    integration: { displayName, displayDescription, appIntegrationId },
    onClick,
}: Props) => {
    const Icon = ICON_FILE_MAP[displayName] || IconFileDefault;
    return (
        <MenuItem onClick={() => onClick(appIntegrationId)}>
            <Icon />
            <span>
                <p className="bcow-menu-item-title">{displayName}</p>
                <p className="bcow-menu-item-description">
                    {displayDescription}
                </p>
            </span>
        </MenuItem>
    );
};

export default OpenWithDropdownMenuItem;
