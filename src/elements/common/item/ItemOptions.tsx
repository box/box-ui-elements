import React from 'react';
import { useIntl } from 'react-intl';
import noop from 'lodash/noop';

import { ActionCell, DropdownMenu, GridList, IconButton } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';

import Browser from '../../../utils/Browser';

import {
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
    PERMISSION_CAN_RENAME,
    PERMISSION_CAN_SHARE,
    TYPE_FILE,
    TYPE_WEBLINK,
} from '../../../constants';

import messages from '../messages';

import type { BoxItem } from '../../../common/types/core';
import type { ItemAction, ItemEventHandlers, ItemEventPermissions } from './types';

export interface ItemOptionsProps extends ItemEventHandlers, ItemEventPermissions {
    isGridView?: boolean;
    item: BoxItem;
    itemActions?: ItemAction[];
}

const ItemOptions = ({
    canDelete = false,
    canDownload = false,
    canPreview = false,
    canRename = false,
    canShare = false,
    isGridView = false,
    item,
    itemActions = [],
    onItemDelete = noop,
    onItemDownload = noop,
    onItemPreview = noop,
    onItemRename = noop,
    onItemShare = noop,
}: ItemOptionsProps) => {
    const { permissions, type: itemType } = item;
    const { formatMessage } = useIntl();

    if (!permissions) {
        return null;
    }

    const isDeleteEnabled = canDelete && permissions[PERMISSION_CAN_DELETE];
    const isDownloadEnabled =
        itemType === TYPE_FILE && canDownload && permissions[PERMISSION_CAN_DOWNLOAD] && Browser.canDownload();
    const isOpenEnabled = itemType === TYPE_WEBLINK;
    const isPreviewEnabled = itemType === TYPE_FILE && canPreview && permissions[PERMISSION_CAN_PREVIEW];
    const isRenameEnabled = canRename && permissions[PERMISSION_CAN_RENAME];
    const isShareEnabled = canShare && permissions[PERMISSION_CAN_SHARE];

    const hasActions = !!itemActions.length;
    const hasOptions =
        isDeleteEnabled || isDownloadEnabled || isOpenEnabled || isPreviewEnabled || isRenameEnabled || isShareEnabled;

    if (!hasActions && !hasOptions) {
        return null;
    }

    const OptionsGroup = isGridView ? GridList.Actions : ActionCell;
    const OptionsTrigger = isGridView ? GridList.ActionIconButton : IconButton;

    return (
        <OptionsGroup>
            {/* @ts-expect-error - ActionCell doesn't seem to work with onOpenChange */}
            {onOpenChange => (
                <DropdownMenu.Root onOpenChange={onOpenChange}>
                    <DropdownMenu.Trigger>
                        <OptionsTrigger aria-label={formatMessage(messages.moreOptions)} icon={Ellipsis} />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                        {isPreviewEnabled && (
                            <DropdownMenu.Item onClick={() => onItemPreview(item)}>
                                {formatMessage(messages.preview)}
                            </DropdownMenu.Item>
                        )}
                        {isOpenEnabled && (
                            <DropdownMenu.Item onClick={() => onItemPreview(item)}>
                                {formatMessage(messages.open)}
                            </DropdownMenu.Item>
                        )}
                        {isDeleteEnabled && (
                            <DropdownMenu.Item onClick={() => onItemDelete(item)}>
                                {formatMessage(messages.delete)}
                            </DropdownMenu.Item>
                        )}
                        {isDownloadEnabled && (
                            <DropdownMenu.Item onClick={() => onItemDownload(item)}>
                                {formatMessage(messages.download)}
                            </DropdownMenu.Item>
                        )}
                        {isRenameEnabled && (
                            <DropdownMenu.Item onClick={() => onItemRename(item)}>
                                {formatMessage(messages.rename)}
                            </DropdownMenu.Item>
                        )}
                        {isShareEnabled && (
                            <DropdownMenu.Item onClick={() => onItemShare(item)}>
                                {formatMessage(messages.share)}
                            </DropdownMenu.Item>
                        )}
                        {hasActions && hasOptions && <DropdownMenu.Separator />}
                        {itemActions.map(({ label: actionLabel, onAction, type: actionType }) => {
                            if (actionType && actionType !== itemType) {
                                return null;
                            }
                            return (
                                <DropdownMenu.Item key={actionLabel + actionType} onClick={() => onAction(item)}>
                                    {actionLabel}
                                </DropdownMenu.Item>
                            );
                        })}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            )}
        </OptionsGroup>
    );
};

export default ItemOptions;
