/**
 * @flow
 * @file Add component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import AddButton from './AddButton';
import DropdownMenu from '../../../components/dropdown-menu/DropdownMenu';
import Menu from '../../../components/menu/Menu';
import MenuItem from '../../../components/menu/MenuItem';
import messages from '../messages';

type Props = {
    onCreate: Function,
    onUpload: Function,
    showCreate: boolean,
    showUpload: boolean,
};

const Add = ({ onUpload, onCreate, showUpload = true, showCreate = true }: Props) => (
    <DropdownMenu isRightAligned>
        <AddButton />
        <Menu>
            {showUpload && (
                <MenuItem onClick={onUpload}>
                    <FormattedMessage {...messages.upload} />
                </MenuItem>
            )}
            {showCreate && (
                <MenuItem onClick={onCreate}>
                    <FormattedMessage {...messages.newFolder} />
                </MenuItem>
            )}
        </Menu>
    </DropdownMenu>
);

export default Add;
