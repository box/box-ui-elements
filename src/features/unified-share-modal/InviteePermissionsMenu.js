// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import PlainButton from '../../components/plain-button';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, SelectMenuItem } from '../../components/menu';
import Tooltip from '../../components/tooltip';
import { ITEM_TYPE_WEBLINK } from '../../common/constants';
import type { itemType as ItemType } from '../../common/box-types';

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

        return (
            <Menu className="usm-share-access-menu">
                {inviteePermissions.map(level =>
                    level.value ? (
                        <SelectMenuItem
                            key={level.value}
                            isDisabled={level.disabled}
                            isSelected={level.value === inviteePermissionLevel}
                            onClick={() => this.onChangeInviteePermissionsLevel(level.value)}
                        >
                            <InviteePermissionsLabel
                                hasDescription
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
        const { inviteePermissionsButtonProps, inviteePermissionLevel, disabled, itemType } = this.props;

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
                })}
                disabled={disabled}
                {...inviteePermissionsButtonProps}
            >
                <MenuToggle>
                    <InviteePermissionsLabel
                        hasDescription={false}
                        inviteePermissionLevel={inviteePermissionLevel}
                        itemType={itemType}
                    />
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

        return (
            <div className="invitee-menu-wrap">
                <DropdownMenu>
                    {plainButtonWrap}
                    {this.renderMenu()}
                </DropdownMenu>
            </div>
        );
    }
}

export default InviteePermissionsMenu;
