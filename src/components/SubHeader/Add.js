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
import IconAddThin from 'box-react-ui/lib/icons/general/IconAddThin';
import messages from '../messages';
import './Add.scss';

type Props = {
    showUpload: boolean,
    showCreate: boolean,
    onUpload: Function,
    onCreate: Function,
    isLoaded: boolean,
};

const Add = ({ onUpload, onCreate, isLoaded, showUpload = true, showCreate = true }: Props) => (
    <DropdownMenu isRightAligned constrainToScrollParent>
        <Button type="button" className="be-btn-add" isDisabled={!isLoaded}>
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
