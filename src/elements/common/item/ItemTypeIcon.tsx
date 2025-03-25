import React from 'react';
import { useIntl } from 'react-intl';

import { ItemIcon } from '@box/item-icon';
import type { ItemIconProps } from '@box/item-icon';

import { getFileIconType } from './utils';

import { TYPE_FILE, TYPE_FOLDER, TYPE_WEBLINK } from '../../../constants';

import messages from './messages';

import type { BoxItem } from '../../../common/types/core';

export interface ItemTypeIconProps extends Partial<ItemIconProps> {
    item: BoxItem;
}

const ItemTypeIcon = ({ item, ...rest }: ItemTypeIconProps) => {
    const {
        archive_type: archiveType,
        extension = '',
        has_collaborations: hasCollabs,
        is_externally_owned: isExternal,
        type,
    } = item;

    const { formatMessage } = useIntl();

    let iconType = 'default';
    let message = messages.file;

    if (type === TYPE_FILE) {
        iconType = getFileIconType(extension.toLowerCase());
        message = iconType === 'default' ? messages.file : messages.fileExtension;
    } else if (type === TYPE_FOLDER) {
        if (archiveType === 'archive') {
            iconType = 'archive';
            message = messages.archive;
        } else if (archiveType === 'folder_archive') {
            iconType = 'folder-archive';
            message = messages.archiveFolder;
        } else if (isExternal) {
            iconType = 'folder-external';
            message = messages.externalFolder;
        } else if (hasCollabs) {
            iconType = 'folder-collab';
            message = messages.collaboratedFolder;
        } else {
            iconType = 'folder-plain';
            message = messages.personalFolder;
        }
    } else if (type === TYPE_WEBLINK) {
        iconType = 'bookmark';
        message = messages.bookmark;
    }

    return (
        <ItemIcon
            ariaLabel={formatMessage(message, { extension: extension.toUpperCase() })}
            iconType={iconType}
            {...rest}
        />
    );
};

export default ItemTypeIcon;
