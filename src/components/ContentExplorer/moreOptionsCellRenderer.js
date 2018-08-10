/**
 * @flow
 * @file Function to render the date table cell
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'box-react-ui/lib/components/button/Button';
import DropdownMenu from 'box-react-ui/lib/components/dropdown-menu/DropdownMenu';
import Menu from 'box-react-ui/lib/components/menu/Menu';
import MenuItem from 'box-react-ui/lib/components/menu/MenuItem';
import Browser from '../../util/Browser';
import messages from '../messages';
import {
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_RENAME,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_SHARE,
    PERMISSION_CAN_PREVIEW,
    TYPE_FILE,
    TYPE_WEBLINK,
} from '../../constants';

import './MoreOptionsCell.scss';

export default (
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
    const allowDownload =
        canDownload && permissions[PERMISSION_CAN_DOWNLOAD] && type === TYPE_FILE && !Browser.isMobile();
    const allowed = allowDelete || allowRename || allowDownload || allowPreview || allowShare || allowOpen;

    if (!allowed) {
        return <span />;
    }

    return (
        <div className="bce-more-options">
            <DropdownMenu isRightAligned constrainToScrollParent>
                <Button type="button" onFocus={onFocus} className="bce-btn-more-options">
                    ···
                </Button>
                <Menu>
                    {allowPreview ? (
                        <MenuItem onClick={onPreview}>
                            <FormattedMessage {...messages.preview} />
                        </MenuItem>
                    ) : null}
                    {allowOpen ? (
                        <MenuItem onClick={onPreview}>
                            <FormattedMessage {...messages.open} />
                        </MenuItem>
                    ) : null}
                    {allowDelete ? (
                        <MenuItem onClick={onDelete}>
                            <FormattedMessage {...messages.delete} />
                        </MenuItem>
                    ) : null}
                    {allowDownload ? (
                        <MenuItem onClick={onDownload}>
                            <FormattedMessage {...messages.download} />
                        </MenuItem>
                    ) : null}
                    {allowRename ? (
                        <MenuItem onClick={onRename}>
                            <FormattedMessage {...messages.rename} />
                        </MenuItem>
                    ) : null}
                    {allowShare ? (
                        <MenuItem onClick={onShare}>
                            <FormattedMessage {...messages.share} />
                        </MenuItem>
                    ) : null}
                </Menu>
            </DropdownMenu>
            {allowShare && !isSmall ? (
                <Button type="button" onFocus={onFocus} onClick={onShare}>
                    <FormattedMessage {...messages.share} />
                </Button>
            ) : null}
        </div>
    );
};
