// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import LabelPill from '../../components/label-pill';
import PlainButton from '../../components/plain-button';
import { Menu, SelectMenuItem } from '../../components/menu';
import { VIEW_SIZE_TYPE } from '../../components/media-query/constants';
import withMediaQuery from '../../components/media-query/withMediaQuery';
import type { TargetingApi } from '../targeting/types';

import type { permissionLevelType } from './flowTypes';
import { CAN_EDIT, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY } from './constants';
import messages from './messages';

import './SharedLinkPermissionMenu.scss';

type Props = {
    allowedPermissionLevels: Array<permissionLevelType>,
    canChangePermissionLevel: boolean,
    changePermissionLevel: (
        newPermissionLevel: permissionLevelType,
    ) => Promise<{ permissionLevel: permissionLevelType }>,
    isSharedLinkEditTooltipShown: boolean,
    permissionLevel?: permissionLevelType,
    sharedLinkEditTagTargetingApi?: TargetingApi,
    sharedLinkEditTooltipTargetingApi?: TargetingApi,
    size: string,
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
        const {
            allowedPermissionLevels,
            isSharedLinkEditTooltipShown,
            permissionLevel,
            sharedLinkEditTagTargetingApi,
            sharedLinkEditTooltipTargetingApi,
            size,
            submitting,
            trackingProps,
        } = this.props;
        const { sharedLinkPermissionsMenuButtonProps } = trackingProps;
        const canShowTag = sharedLinkEditTagTargetingApi ? sharedLinkEditTagTargetingApi.canShow : false;
        const canShowTooltip = sharedLinkEditTooltipTargetingApi ? sharedLinkEditTooltipTargetingApi.canShow : false;

        if (!permissionLevel) {
            return null;
        }

        const permissionLevels = {
            [CAN_EDIT]: {
                label: <FormattedMessage {...messages.sharedLinkPermissionsEdit} />,
            },
            [CAN_VIEW_DOWNLOAD]: {
                label: <FormattedMessage {...messages.sharedLinkPermissionsViewDownload} />,
            },
            [CAN_VIEW_ONLY]: {
                label: <FormattedMessage {...messages.sharedLinkPermissionsViewOnly} />,
            },
        };

        const isRightAligned = size === VIEW_SIZE_TYPE.small || size === VIEW_SIZE_TYPE.medium;

        return (
            <DropdownMenu
                constrainToWindow
                isRightAligned={isRightAligned}
                onMenuClose={() => {
                    if (allowedPermissionLevels.includes(CAN_EDIT) && canShowTag && sharedLinkEditTagTargetingApi) {
                        sharedLinkEditTagTargetingApi.onComplete();
                    }
                }}
                onMenuOpen={() => {
                    if (allowedPermissionLevels.includes(CAN_EDIT) && canShowTag && sharedLinkEditTagTargetingApi) {
                        sharedLinkEditTagTargetingApi.onShow();
                    }

                    // complete tooltip FTUX on opening of dropdown menu
                    if (isSharedLinkEditTooltipShown && canShowTooltip && sharedLinkEditTooltipTargetingApi) {
                        sharedLinkEditTooltipTargetingApi.onComplete();
                    }
                }}
            >
                <PlainButton
                    className={classNames('lnk', {
                        'is-disabled': submitting,
                        'bdl-is-disabled': submitting,
                    })}
                    data-testid="usm-share-permissions-toggle"
                    disabled={submitting}
                    type="button"
                    {...sharedLinkPermissionsMenuButtonProps}
                >
                    <MenuToggle>{permissionLevels[permissionLevel].label}</MenuToggle>
                </PlainButton>
                <Menu className="ums-share-permissions-menu" data-testid="usm-share-permissions-menu">
                    {allowedPermissionLevels.map(level => (
                        <SelectMenuItem
                            key={level}
                            isSelected={level === permissionLevel}
                            onClick={() => this.onChangePermissionLevel(level)}
                        >
                            <div className="ums-share-permissions-menu-item">
                                <span>{permissionLevels[level].label}</span>
                                {level === CAN_EDIT && canShowTag && (
                                    <LabelPill.Pill className="ftux-editable-shared-link" type="ftux">
                                        <LabelPill.Text>
                                            <FormattedMessage {...messages.ftuxSharedLinkPermissionsEditTag} />
                                        </LabelPill.Text>
                                    </LabelPill.Pill>
                                )}
                            </div>
                        </SelectMenuItem>
                    ))}
                </Menu>
            </DropdownMenu>
        );
    }
}

const sharedLinkPermissionMenu = withMediaQuery(SharedLinkPermissionMenu);
sharedLinkPermissionMenu.displayName = 'SharedLinkPermissionMenu';

export { SharedLinkPermissionMenu as SharedLinkPermissionMenuBase };
export default sharedLinkPermissionMenu;
