/**
 * @flow
 * @file Open With dropdown menu item
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import MenuItem from '../../components/menu/MenuItem';
import messages from '../common/messages';
import { OPEN_WITH_MENU_ITEM_ICON_SIZE } from '../../constants';
import getIcon from './IconFileMap';
import utils from './openWithUtils';
import type { Integration, DisabledReason } from '../../common/types/integrations';
import './OpenWithDropdownMenuItem.scss';

type Props = {
    integration: Integration,
    onClick: Function,
};

function getErrorMessage(disabledReasons: Array<DisabledReason> = []): React.Node {
    let message;
    // Use the first disabled reason as the description if the integration is disabled.
    const code = disabledReasons[0];
    const defaultErrorMessage = <FormattedMessage {...messages.errorOpenWithDescription} />;

    switch (code) {
        case 'blocked_by_shield_access_policy':
            message = <FormattedMessage {...messages.boxEditErrorBlockedByPolicy} />;
            break;
        case 'collaborators_hidden':
            message = defaultErrorMessage;
            break;
        default:
            message = disabledReasons[0] || defaultErrorMessage;
    }
    return message;
}

const OpenWithDropdownMenuItem = ({ integration, onClick }: Props) => {
    const { displayName, displayDescription, isDisabled, extension, disabledReasons } = integration;
    const Icon = getIcon(displayName);
    const description = isDisabled ? getErrorMessage(disabledReasons) : displayDescription;
    const className = classNames({
        'bcow-box-tools-uninstalled': utils.isDisabledBecauseBoxToolsIsNotInstalled(integration),
    });

    return (
        <MenuItem className={className} isDisabled={isDisabled} onClick={() => onClick(integration)}>
            <Icon
                dimension={OPEN_WITH_MENU_ITEM_ICON_SIZE}
                extension={extension}
                height={OPEN_WITH_MENU_ITEM_ICON_SIZE}
                width={OPEN_WITH_MENU_ITEM_ICON_SIZE}
            />
            <span>
                <p className="bcow-menu-item-title">{displayName}</p>
                <p className="bcow-menu-item-description">{description}</p>
            </span>
        </MenuItem>
    );
};

export default OpenWithDropdownMenuItem;
