/* @flow */
import React, { Component } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../components/plain-button';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, MenuSeparator, MenuSectionHeader, SelectMenuItem } from '../../components/menu';

import messages from './messages';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import { accessLevelPropType, allowedAccessLevelsPropType } from './propTypes';
import AccessLabel from './AccessLabel';
import RemoveLinkConfirmModal from './RemoveLinkConfirmModal';

const accessLevels = [PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM];

type Props = {
    accessDropdownMenuProps?: Object,
    accessLevel: accessLevelPropType,
    accessMenuButtonProps?: Object,
    allowedAccessLevels: allowedAccessLevelsPropType,
    canRemoveLink?: boolean,
    changeAccessLevel: Function,
    enterpriseName?: string,
    itemType: string,
    removeLink: Function,
    removeLinkButtonProps?: Object,
    submitting?: boolean,
};

type State = {
    isConfirmModalOpen: boolean,
};

class AccessMenu extends Component<Props, State> {
    static defaultProps = {
        accessDropdownMenuProps: {},
        accessMenuButtonProps: {},
        removeLinkButtonProps: {},
    };

    state = {
        isConfirmModalOpen: false,
    };

    openConfirmModal = () => {
        this.setState({ isConfirmModalOpen: true });
    };

    closeConfirmModal = () => {
        this.setState({ isConfirmModalOpen: false });
    };

    renderMenu() {
        const {
            accessLevel,
            allowedAccessLevels,
            canRemoveLink,
            changeAccessLevel,
            enterpriseName,
            itemType,
            removeLinkButtonProps,
        } = this.props;

        return (
            <Menu className="share-access-menu">
                <MenuSectionHeader>
                    <FormattedMessage {...messages.accessTypeTitle} />
                </MenuSectionHeader>
                {accessLevels.map(level =>
                    allowedAccessLevels[level] ? (
                        <SelectMenuItem
                            key={level}
                            isSelected={level === accessLevel}
                            onClick={() => changeAccessLevel(level)}
                        >
                            <AccessLabel accessLevel={level} enterpriseName={enterpriseName} itemType={itemType} />
                        </SelectMenuItem>
                    ) : null,
                )}
                {canRemoveLink && <MenuSeparator />}
                {canRemoveLink && (
                    <SelectMenuItem onClick={this.openConfirmModal} {...removeLinkButtonProps}>
                        <FormattedMessage {...messages.removeLink} />
                    </SelectMenuItem>
                )}
            </Menu>
        );
    }

    render() {
        const {
            accessDropdownMenuProps,
            accessLevel,
            accessMenuButtonProps,
            enterpriseName,
            itemType,
            removeLink,
            submitting,
        } = this.props;
        const { isConfirmModalOpen } = this.state;

        return (
            <span>
                <DropdownMenu {...accessDropdownMenuProps}>
                    <PlainButton
                        className={classNames('lnk', {
                            'is-disabled bdl-is-disabled': submitting,
                        })}
                        disabled={submitting}
                        {...accessMenuButtonProps}
                    >
                        <MenuToggle>
                            <AccessLabel
                                accessLevel={accessLevel}
                                enterpriseName={enterpriseName}
                                itemType={itemType}
                            />
                        </MenuToggle>
                    </PlainButton>
                    {this.renderMenu()}
                </DropdownMenu>
                <RemoveLinkConfirmModal
                    isOpen={isConfirmModalOpen}
                    onRequestClose={this.closeConfirmModal}
                    removeLink={removeLink}
                    submitting={submitting}
                />
            </span>
        );
    }
}

export default AccessMenu;
