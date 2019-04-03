// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, SelectMenuItem } from '../../components/menu';
import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import type { itemType as ItemType } from '../../common/box-types';

import SharedLinkAccessLabel from './SharedLinkAccessLabel';
import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import messages from './messages';
import type { accessLevelType, allowedAccessLevelsType } from './flowTypes';

const accessLevels = [ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM];

type Props = {
    accessLevel?: accessLevelType,
    allowedAccessLevels: allowedAccessLevelsType,
    changeAccessLevel: (newAccessLevel: accessLevelType) => Promise<{ accessLevel: accessLevelType }>,
    classificationName?: string,
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
        const { accessLevel, allowedAccessLevels, classificationName, enterpriseName, itemType } = this.props;

        return (
            <Menu className="usm-share-access-menu">
                {accessLevels.map(level => {
                    const isDisabled = !allowedAccessLevels[level];
                    const isDisabledByClassification = isDisabled && classificationName;
                    let menuItem = null;
                    if (!isDisabled || isDisabledByClassification) {
                        menuItem = (
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
                        );
                    }
                    if (menuItem && isDisabledByClassification) {
                        return (
                            <Tooltip
                                key={`tooltip-${level}`}
                                position="top-center"
                                text={
                                    <FormattedMessage
                                        {...messages.disabledShareLinkPermission}
                                        values={{
                                            classification: classificationName,
                                        }}
                                    />
                                }
                            >
                                {menuItem}
                            </Tooltip>
                        );
                    }
                    return menuItem;
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
                <DropdownMenu onMenuOpen={onSharedLinkAccessMenuOpen}>
                    <PlainButton
                        className={classNames('lnk', {
                            'is-disabled': submitting,
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
