/**
 * @flow
 * @file Content sub header component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'components/button/Button';
import DropdownMenu from 'components/dropdown-menu/DropdownMenu';
import Menu from 'components/menu/Menu';
import MenuItem from 'components/menu/MenuItem';
import IconAddThin from 'icons/general/IconAddThin';
import messages from '../messages';
import './Add.scss';

type Props = {
    isLoaded: boolean,
    onCreate: Function,
    onUpload: Function,
    showCreate: boolean,
    showUpload: boolean,
};

const Add = ({ onUpload, onCreate, isLoaded, showUpload = true, showCreate = true }: Props) => (
    <DropdownMenu constrainToScrollParent isRightAligned>
        <Button className="be-btn-add" isDisabled={!isLoaded} type="button">
            <IconAddThin />
        </Button>
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
