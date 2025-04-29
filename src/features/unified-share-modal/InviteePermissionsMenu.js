// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import PlainButton from '../../components/plain-button';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, SelectMenuItem } from '../../components/menu';
import Tooltip from '../../components/tooltip';
import { ITEM_TYPE_WEBLINK } from '../../common/constants';
import type { ItemType } from '../../common/types/core';

import getDefaultPermissionLevel from './utils/defaultPermissionLevel';
import InviteePermissionsLabel from './InviteePermissionsLabel';
import messages from './messages';

import type { inviteePermissionType } from './flowTypes';

type Props = {
    changeInviteePermissionLevel: Function,
    disabled: boolean,
    inviteePermissionLevel: string,
    inviteePermissions: Array<inviteePermissionType>,
    inviteePermissionsButtonProps?: Object,
    itemType: ItemType,
};

class InviteePermissionsMenu extends Component<Props> {
    static defaultProps = {
        disabled: false,
        inviteePermissions: [],
        inviteePermissionsButtonProps: {},
    };

    onChangeInviteePermissionsLevel = (newInviteePermissionLevel: string) => {
        const { inviteePermissionLevel, changeInviteePermissionLevel } = this.props;

        if (inviteePermissionLevel !== newInviteePermissionLevel) {
            changeInviteePermissionLevel(newInviteePermissionLevel);
        }
    };

    renderMenu() {
        const { inviteePermissionLevel, inviteePermissions, itemType } = this.props;

        const defaultPermissionLevel = getDefaultPermissionLevel(inviteePermissions);
        const selectedPermissionLevel = inviteePermissionLevel || defaultPermissionLevel;

        return (
            <Menu className="usm-share-access-menu">
                {inviteePermissions.map(level =>
                    level.value ? (
                        <SelectMenuItem
                            key={level.value}
                            isDisabled={level.disabled}
                            isSelected={level.value === selectedPermissionLevel}
                            onClick={() => this.onChangeInviteePermissionsLevel(level.value)}
                        >
                            <InviteePermissionsLabel
                                hasDescription
                                inviteePermissionDescription={level.description}
                                inviteePermissionLevel={level.value}
                                inviteePermissions
                                itemType={itemType}
                            />
                        </SelectMenuItem>
                    ) : null,
                )}
            </Menu>
        );
    }

    render() {
        const { inviteePermissions, inviteePermissionsButtonProps, inviteePermissionLevel, disabled, itemType } =
            this.props;
        const defaultPermissionLevel = getDefaultPermissionLevel(inviteePermissions);
        const selectedPermissionLevel = inviteePermissionLevel || defaultPermissionLevel;
        const disabledTooltip =
            itemType === ITEM_TYPE_WEBLINK ? (
                <FormattedMessage {...messages.inviteDisabledWeblinkTooltip} />
            ) : (
                <FormattedMessage {...messages.inviteDisabledTooltip} />
            );

        const plainButton = (
            <PlainButton
                className={classNames('lnk', {
                    'is-disabled': disabled,
                    'bdl-is-disabled': disabled,
                })}
                data-target-id="PlainButton-InviteePermissionsMenuToggle"
                disabled={disabled}
                type="button"
                {...inviteePermissionsButtonProps}
            >
                <MenuToggle>
                    {selectedPermissionLevel && (
                        <InviteePermissionsLabel
                            hasDescription={false}
                            inviteePermissionLevel={selectedPermissionLevel}
                            itemType={itemType}
                        />
                    )}
                </MenuToggle>
            </PlainButton>
        );

        const plainButtonWrap = disabled ? (
            <Tooltip position="bottom-center" text={disabledTooltip}>
                <div className="tooltip-target">{plainButton}</div>
            </Tooltip>
        ) : (
            plainButton
        );

        // TODO: `DropdownMenu` doesn't currently handle a scenario where the menu is taller than
        // the available vertical space. cannot use the constraint props here in short windows.
        return (
            <div className="be invitee-menu-wrap">
                <DropdownMenu>
                    {plainButtonWrap}
                    {this.renderMenu()}
                </DropdownMenu>
            </div>
        );
    }
}

export default InviteePermissionsMenu;
