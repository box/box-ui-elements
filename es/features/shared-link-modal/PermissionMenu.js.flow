/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import PlainButton from '../../components/plain-button';
import { Menu, SelectMenuItem } from '../../components/menu';

import { permissionLevelPropType } from './propTypes';
import { CAN_VIEW, CAN_EDIT } from './constants';
import messages from './messages';

const permissionLevels = [CAN_VIEW, CAN_EDIT];

type Props = {
    changePermissionLevel?: Function,
    permissionLevel?: permissionLevelPropType,
    submitting?: boolean,
};

const PermissionMenu = (props: Props) => {
    const { changePermissionLevel, permissionLevel, submitting } = props;

    if (!changePermissionLevel || !permissionLevel) {
        return null;
    }

    const permissionLabels = {
        [CAN_VIEW]: <FormattedMessage {...messages.canView} />,
        [CAN_EDIT]: <FormattedMessage {...messages.canEdit} />,
    };

    return (
        <DropdownMenu>
            <PlainButton
                className={classNames('lnk', {
                    'is-disabled bdl-is-disabled': submitting,
                })}
                disabled={submitting}
            >
                <MenuToggle>{permissionLabels[permissionLevel]}</MenuToggle>
            </PlainButton>
            <Menu>
                {permissionLevels.map(level => (
                    <SelectMenuItem
                        key={level}
                        isSelected={level === permissionLevel}
                        onClick={() => changePermissionLevel(level)}
                    >
                        {permissionLabels[level]}
                    </SelectMenuItem>
                ))}
            </Menu>
        </DropdownMenu>
    );
};

PermissionMenu.displayName = 'PermissionMenu';

export default PermissionMenu;
