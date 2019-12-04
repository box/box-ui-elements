// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button/Button';
import DropdownMenu from '../../components/dropdown-menu/DropdownMenu';
import Menu from '../../components/menu/Menu';
import MenuItem from '../../components/menu/MenuItem';
import Browser from '../../utils/Browser';
import IconEllipsis from '../../icons/general/IconEllipsis';
import { bdlGray50 } from '../../styles/variables';
import messages from '../common/messages';
import {
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_RENAME,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_SHARE,
    PERMISSION_CAN_PREVIEW,
    TYPE_FILE,
    TYPE_WEBLINK,
} from '../../constants';

import type { CommonGridViewFunctions } from './flowTypes';
import type { BoxItem } from '../../common/types/core';
import './MoreOptionsCell.scss';

type Props = {
    canDelete: boolean,
    canDownload: boolean,
    canPreview: boolean,
    canRename: boolean,
    canShare: boolean,
    isSmall: boolean,
    item: BoxItem,
    ...$Exact<CommonGridViewFunctions>,
};

const MoreOptions = ({
    canPreview,
    canShare,
    canDownload,
    canDelete,
    canRename,
    onItemSelect,
    onItemDelete,
    onItemDownload,
    onItemRename,
    onItemShare,
    onItemPreview,
    isSmall,
    item,
}: Props) => {
    const onFocus = () => onItemSelect(item);
    const onDelete = () => onItemDelete(item);
    const onDownload = () => onItemDownload(item);
    const onRename = () => onItemRename(item);
    const onShare = () => onItemShare(item);
    const onPreview = () => onItemPreview(item);

    const { permissions, type } = item;

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
            <DropdownMenu constrainToScrollParent isRightAligned>
                <Button
                    className="bce-btn-more-options"
                    data-testid="bce-btn-more-options"
                    onFocus={onFocus}
                    type="button"
                >
                    <IconEllipsis color={bdlGray50} height={10} width={16} />
                </Button>
                <Menu>
                    {allowPreview && (
                        <MenuItem onClick={onPreview}>
                            <FormattedMessage {...messages.preview} />
                        </MenuItem>
                    )}
                    {allowOpen && (
                        <MenuItem onClick={onPreview}>
                            <FormattedMessage {...messages.open} />
                        </MenuItem>
                    )}
                    {allowDelete && (
                        <MenuItem onClick={onDelete}>
                            <FormattedMessage {...messages.delete} />
                        </MenuItem>
                    )}
                    {allowDownload && (
                        <MenuItem onClick={onDownload}>
                            <FormattedMessage {...messages.download} />
                        </MenuItem>
                    )}
                    {allowRename && (
                        <MenuItem onClick={onRename}>
                            <FormattedMessage {...messages.rename} />
                        </MenuItem>
                    )}
                    {allowShare && (
                        <MenuItem onClick={onShare}>
                            <FormattedMessage {...messages.share} />
                        </MenuItem>
                    )}
                </Menu>
            </DropdownMenu>
            {allowShare && !isSmall && (
                <Button onClick={onShare} onFocus={onFocus} type="button">
                    <FormattedMessage {...messages.share} />
                </Button>
            )}
        </div>
    );
};

export default MoreOptions;
