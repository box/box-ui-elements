/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'box-react-ui/lib/components/button/Button';
import DropdownMenu from 'box-react-ui/lib/components/dropdown-menu/DropdownMenu';
import Menu from 'box-react-ui/lib/components/menu/Menu';
import MenuItem from 'box-react-ui/lib/components/menu/MenuItem';
import messages from '../messages';
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
        <Button type='button' className='buik-btn-add' isDisabled={!isLoaded}>
            <IconPlus />
        </Button>
        <Menu>
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
