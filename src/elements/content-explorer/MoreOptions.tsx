import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button, DropdownMenu, IconButton } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';

import Browser from '../../utils/Browser';

import {
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_RENAME,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_SHARE,
    PERMISSION_CAN_PREVIEW,
    TYPE_FILE,
    TYPE_WEBLINK,
} from '../../constants';

import { MoreOptionsFunctionProps } from '../common/types/GridTypes';
import type { BoxItem } from '../../common/types/core';

import messages from '../common/messages';

import './MoreOptionsCell.scss';

export interface MoreOptionsProps {
    canDelete: boolean;
    canDownload: boolean;
    canPreview: boolean;
    canRename: boolean;
    canShare: boolean;
    isSmall: boolean;
    item: BoxItem;
}

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
}: MoreOptionsProps & MoreOptionsFunctionProps) => {
    const { formatMessage } = useIntl();

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
        canDownload && permissions[PERMISSION_CAN_DOWNLOAD] && type === TYPE_FILE && Browser.canDownload();
    const allowed = allowDelete || allowRename || allowDownload || allowPreview || allowShare || allowOpen;

    if (!allowed) {
        return <span />;
    }

    return (
        <div className="bce-more-options">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <IconButton aria-label={formatMessage(messages.moreOptions)} icon={Ellipsis} onFocus={onFocus} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="start">
                    {(allowPreview || allowOpen) && (
                        <DropdownMenu.Item onClick={onPreview}>
                            <FormattedMessage {...(allowOpen ? messages.open : messages.preview)} />
                        </DropdownMenu.Item>
                    )}
                    {allowDelete && (
                        <DropdownMenu.Item onClick={onDelete}>
                            <FormattedMessage {...messages.delete} />
                        </DropdownMenu.Item>
                    )}
                    {allowDownload && (
                        <DropdownMenu.Item onClick={onDownload}>
                            <FormattedMessage {...messages.download} />
                        </DropdownMenu.Item>
                    )}
                    {allowRename && (
                        <DropdownMenu.Item onClick={onRename}>
                            <FormattedMessage {...messages.rename} />
                        </DropdownMenu.Item>
                    )}
                    {allowShare && (
                        <DropdownMenu.Item onClick={onShare}>
                            <FormattedMessage {...messages.share} />
                        </DropdownMenu.Item>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            {allowShare && !isSmall && (
                <Button onClick={onShare} onFocus={onFocus}>
                    {formatMessage(messages.share)}
                </Button>
            )}
        </div>
    );
};

export default MoreOptions;
