/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import DropdownMenu from '../DropdownMenu';
import { Menu, MenuItem } from '../Menu';
import { Button } from '../Button';
import { isMobile } from '../../util/browser';
import {
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_RENAME,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_SHARE,
    PERMISSION_CAN_PREVIEW,
    TYPE_FILE,
    TYPE_WEBLINK
} from '../../constants';
import type { BoxItem } from '../../flowTypes';
import './MoreOptionsCell.scss';

export default (
    getLocalizedMessage: Function,
    canPreview: boolean,
    canShare: boolean,
    canDownload: boolean,
    canDelete: boolean,
    canRename: boolean,
    onItemSelect: Function,
    onItemDelete: Function,
    onItemDownload: Function,
    onItemRename: Function,
    onItemShare: Function,
    onItemPreview: Function,
    isSmall: boolean
) => ({ rowData }: { rowData: BoxItem }) => {
    const onFocus = () => onItemSelect(rowData);
    const onDelete = () => onItemDelete(rowData);
    const onDownload = () => onItemDownload(rowData);
    const onRename = () => onItemRename(rowData);
    const onShare = () => onItemShare(rowData);
    const onPreview = () => onItemPreview(rowData);

    const { permissions, type } = rowData;

    if (!permissions) {
        return <span />;
    }

    const allowPreview = type === TYPE_FILE && canPreview && permissions[PERMISSION_CAN_PREVIEW];
    const allowOpen = type === TYPE_WEBLINK;
    const allowDelete = canDelete && permissions[PERMISSION_CAN_DELETE];
    const allowShare = canShare && permissions[PERMISSION_CAN_SHARE];
    const allowRename = canRename && permissions[PERMISSION_CAN_RENAME];
    const allowDownload = canDownload && permissions[PERMISSION_CAN_DOWNLOAD] && type === TYPE_FILE && !isMobile();
    const allowed = allowDelete || allowRename || allowDownload || allowPreview || allowShare || allowOpen;

    if (!allowed) {
        return <span />;
    }

    return (
        <div className='bce-more-options'>
            <DropdownMenu isRightAligned constrainToScrollParent>
                <Button onFocus={onFocus} className='bce-btn-more-options'>
                    ···
                </Button>
                <Menu>
                    {allowPreview
                        ? <MenuItem onClick={onPreview}>
                            {getLocalizedMessage('buik.more.options.preview')}
                        </MenuItem>
                        : null}
                    {allowOpen
                        ? <MenuItem onClick={onPreview}>
                            {getLocalizedMessage('buik.more.options.open')}
                        </MenuItem>
                        : null}
                    {allowDelete
                        ? <MenuItem onClick={onDelete}>
                            {getLocalizedMessage('buik.more.options.delete')}
                        </MenuItem>
                        : null}
                    {allowDownload
                        ? <MenuItem onClick={onDownload}>
                            {getLocalizedMessage('buik.more.options.download')}
                        </MenuItem>
                        : null}
                    {allowRename
                        ? <MenuItem onClick={onRename}>
                            {getLocalizedMessage('buik.more.options.rename')}
                        </MenuItem>
                        : null}
                    {allowShare
                        ? <MenuItem onClick={onShare}>
                            {getLocalizedMessage('buik.item.button.share')}
                        </MenuItem>
                        : null}
                </Menu>
            </DropdownMenu>
            {allowShare && !isSmall
                ? <Button onFocus={onFocus} onClick={onShare}>
                    {getLocalizedMessage('buik.item.button.share')}
                </Button>
                : null}
        </div>
    );
};
