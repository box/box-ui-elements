// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, SelectMenuItem } from '../../components/menu';
import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import type { ItemType } from '../../common/types/core';

import SharedLinkAccessLabel from './SharedLinkAccessLabel';
import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import messages from './messages';
import type { accessLevelType, accessLevelsDisabledReasonType, allowedAccessLevelsType } from './flowTypes';

const accessLevels = [ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM];

type Props = {
    accessLevel?: accessLevelType,
    accessLevelsDisabledReason: accessLevelsDisabledReasonType,
    allowedAccessLevels: allowedAccessLevelsType,
    changeAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>,
    enterpriseName?: string,
    itemType: ItemType,
    onDismissTooltip: () => void,
    submitting: boolean,
    tooltipContent: React.Node,
    trackingProps: {
        onChangeSharedLinkAccessLevel?: Function,
        onSharedLinkAccessMenuOpen?: Function,
        sharedLinkAccessMenuButtonProps?: Object,
    },
};

class SharedLinkAccessMenu extends React.Component<Props> {
    static defaultProps = {
        accessLevelsDisabledReason: {},
        allowedAccessLevels: {},
        trackingProps: {},
    };

    onChangeAccessLevel = (newAccessLevel: accessLevelType) => {
        const { accessLevel, changeAccessLevel, trackingProps } = this.props;
        const { onChangeSharedLinkAccessLevel } = trackingProps;

        if (accessLevel !== newAccessLevel) {
            changeAccessLevel(newAccessLevel);

            if (onChangeSharedLinkAccessLevel) {
                onChangeSharedLinkAccessLevel(newAccessLevel);
            }
        }
    };

    renderMenu() {
        const { accessLevel, accessLevelsDisabledReason, allowedAccessLevels, enterpriseName, itemType } = this.props;
        return (
            <Menu className="usm-share-access-menu">
                {accessLevels.map(level => {
                    const isDisabled = !allowedAccessLevels[level];
                    const isDisabledByAccessPolicy = accessLevelsDisabledReason[level] === 'access_policy';
                    const isDisabledByMaliciousContent = accessLevelsDisabledReason[level] === 'malicious_content';
                    const isDisabledByPolicy = isDisabledByAccessPolicy || isDisabledByMaliciousContent;
                    const tooltipMessage = isDisabledByMaliciousContent
                        ? messages.disabledMaliciousContentShareLinkPermission
                        : messages.disabledShareLinkPermission;

                    // If an access level is disabled for reasons other than access policy enforcement
                    // then we just don't show that menu item. If it is disabled because of an access policy
                    // instead, then we show the menu item in a disabled state and with a tooltip.
                    if (isDisabled && !isDisabledByPolicy) {
                        return null;
                    }

                    return (
                        <Tooltip
                            isDisabled={!isDisabledByPolicy}
                            key={`tooltip-${level}`}
                            position="top-center"
                            text={<FormattedMessage {...tooltipMessage} />}
                        >
                            <SelectMenuItem
                                key={level}
                                isDisabled={isDisabled}
                                isSelected={level === accessLevel}
                                onClick={() => this.onChangeAccessLevel(level)}
                            >
                                <SharedLinkAccessLabel
                                    accessLevel={level}
                                    enterpriseName={enterpriseName}
                                    hasDescription
                                    itemType={itemType}
                                />
                            </SelectMenuItem>
                        </Tooltip>
                    );
                })}
            </Menu>
        );
    }

    render() {
        const {
            accessLevel,
            enterpriseName,
            itemType,
            onDismissTooltip,
            submitting,
            tooltipContent,
            trackingProps,
        } = this.props;
        const { onSharedLinkAccessMenuOpen, sharedLinkAccessMenuButtonProps } = trackingProps;

        return (
            <Tooltip
                className="usm-ftux-tooltip"
                isShown={!!tooltipContent}
                onDismiss={onDismissTooltip}
                position="middle-left"
                showCloseButton
                text={tooltipContent}
                theme="callout"
            >
                <DropdownMenu onMenuOpen={onSharedLinkAccessMenuOpen} constrainToWindow>
                    <PlainButton
                        className={classNames('lnk', {
                            'is-disabled': submitting,
                            'bdl-is-disabled': submitting,
                        })}
                        disabled={submitting}
                        {...sharedLinkAccessMenuButtonProps}
                    >
                        <MenuToggle>
                            <SharedLinkAccessLabel
                                accessLevel={accessLevel}
                                enterpriseName={enterpriseName}
                                hasDescription={false}
                                itemType={itemType}
                            />
                        </MenuToggle>
                    </PlainButton>
                    {this.renderMenu()}
                </DropdownMenu>
            </Tooltip>
        );
    }
}

export default SharedLinkAccessMenu;
