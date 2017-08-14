/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import DropdownMenu from '../DropdownMenu';
import { Menu, MenuItem } from '../Menu';
import { Button } from '../Button';
import IconPlus from '../icons/IconPlus';
import './Add.scss';

type Props = {
    onUpload: Function,
    onCreate: Function,
    isLoaded: boolean,
    getLocalizedMessage: Function
};

const Add = ({ onUpload, onCreate, isLoaded, getLocalizedMessage }: Props) =>
    <DropdownMenu isRightAligned constrainToScrollParent>
        <Button className='buik-btn-add' isDisabled={!isLoaded}>
            <IconPlus />
        </Button>
        <Menu className='buik-sort'>
            <MenuItem onClick={onUpload}>
                {getLocalizedMessage('buik.header.button.upload')}
            </MenuItem>
            <MenuItem onClick={onCreate}>
                {getLocalizedMessage('buik.header.button.create')}
            </MenuItem>
        </Menu>
    </DropdownMenu>;

export default Add;
