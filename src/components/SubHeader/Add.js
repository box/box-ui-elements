/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import DropdownMenu from '../DropdownMenu';
import { Menu, MenuItem } from '../Menu';
import { Button } from '../Button';
import IconPlus from '../icons/IconPlus';
import './Add.scss';

type Props = {
    showUpload: boolean,
    showCreate: boolean,
    onUpload: Function,
    onCreate: Function,
    isLoaded: boolean
};

const Add = ({ onUpload, onCreate, isLoaded, showUpload = true, showCreate = true }: Props) =>
    <DropdownMenu isRightAligned constrainToScrollParent className='buik-dropdown-add'>
        <Button className='buik-btn-add' isDisabled={!isLoaded}>
            <IconPlus />
        </Button>
        <Menu className='buik-menu-add'>
            {showUpload &&
                <MenuItem onClick={onUpload}>
                    <FormattedMessage {...messages.upload} />
                </MenuItem>}
            {showCreate &&
                <MenuItem onClick={onCreate}>
                    <FormattedMessage {...messages.newFolder} />
                </MenuItem>}
        </Menu>
    </DropdownMenu>;

export default Add;
