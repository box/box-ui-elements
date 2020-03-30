// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import PlainButton from '../../components/plain-button';
import { Menu, SelectMenuItem } from '../../components/menu';

import type { permissionLevelType } from './flowTypes';
import { CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY } from './constants';
import messages from './messages';

type Props = {
    allowedPermissionLevels: Array<permissionLevelType>,
    canChangePermissionLevel: boolean,
    changePermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>,
    permissionLevel?: permissionLevelType,
    submitting: boolean,
    trackingProps: {
        onChangeSharedLinkPermissionLevel?: Function,
        sharedLinkPermissionsMenuButtonProps?: Object,
    },
};

class SharedLinkPermissionMenu extends Component<Props> {
    static defaultProps = {
        trackingProps: {},
    };

    onChangePermissionLevel = (newPermissionLevel: permissionLevelType) => {
        const { changePermissionLevel, permissionLevel, trackingProps } = this.props;
        const { onChangeSharedLinkPermissionLevel } = trackingProps;

        if (permissionLevel !== newPermissionLevel) {
            changePermissionLevel(newPermissionLevel);

            if (onChangeSharedLinkPermissionLevel) {
                onChangeSharedLinkPermissionLevel(newPermissionLevel);
            }
        }
    };

    render() {
        const { allowedPermissionLevels, permissionLevel, submitting, trackingProps } = this.props;
        const { sharedLinkPermissionsMenuButtonProps } = trackingProps;

        if (!permissionLevel) {
            return null;
        }

        const permissionLevels = {
            [CAN_VIEW_DOWNLOAD]: {
                label: <FormattedMessage {...messages.sharedLinkPermissionsViewDownload} />,
                description: <FormattedMessage {...messages.sharedLinkPermissionsViewDownloadDescription} />,
            },
            [CAN_VIEW_ONLY]: {
                label: <FormattedMessage {...messages.sharedLinkPermissionsViewOnly} />,
                description: <FormattedMessage {...messages.sharedLinkPermissionsViewOnlyDescription} />,
            },
        };

        return (
            <DropdownMenu constrainToWindow>
                <PlainButton
                    className={classNames('lnk', {
                        'is-disabled': submitting,
                        'bdl-is-disabled': submitting,
                    })}
                    disabled={submitting}
                    {...sharedLinkPermissionsMenuButtonProps}
                >
                    <MenuToggle>{permissionLevels[permissionLevel].label}</MenuToggle>
                </PlainButton>
                <Menu className="ums-share-permissions-menu">
                    {allowedPermissionLevels.map(level => (
                        <SelectMenuItem
                            key={level}
                            isSelected={level === permissionLevel}
                            onClick={() => this.onChangePermissionLevel(level)}
                        >
                            <div>
                                <strong>{permissionLevels[level].label}</strong>
                                <small className="usm-menu-description"> {permissionLevels[level].description} </small>
                            </div>
                        </SelectMenuItem>
                    ))}
                </Menu>
            </DropdownMenu>
        );
    }
}

export default SharedLinkPermissionMenu;
