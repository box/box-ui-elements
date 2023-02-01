/**
 * @flow
 * @file Function to render the icon table cell
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import FileIcon from '../../../icons/file-icon/FileIcon';
import FolderIcon from '../../../icons/folder-icon/FolderIcon';
import BookmarkIcon from '../../../icons/bookmark-icon/BookmarkIcon';
import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../../../constants';
import type { BoxItem } from '../../../common/types/core';
import messages from '../messages';

import './IconCell.scss';

export function getIcon(rowData: BoxItem, dimension?: number) {
    const { type, extension, has_collaborations, is_externally_owned }: BoxItem = rowData;
    let title;
    switch (type) {
        case TYPE_FOLDER:
            if (has_collaborations) {
                title = <FormattedMessage {...messages.collaboratedFolder} />;
            } else if (is_externally_owned) {
                title = <FormattedMessage {...messages.externalFolder} />;
            } else {
                title = <FormattedMessage {...messages.personalFolder} />;
            }
            return (
                <FolderIcon
                    dimension={dimension}
                    isCollab={has_collaborations}
                    isExternal={is_externally_owned}
                    title={title}
                />
            );
        case TYPE_WEBLINK:
            title = <FormattedMessage {...messages.bookmark} />;
            return <BookmarkIcon height={dimension} width={dimension} title={title} />;
        case TYPE_FILE:
        default:
            title = <FormattedMessage {...messages.file} />;
            return <FileIcon dimension={dimension} extension={extension} title={title} />;
    }
}

export default (dimension: number = 32): Function => ({ rowData }: { rowData: BoxItem }) => (
    <div className="be-item-icon">{getIcon(rowData, dimension)}</div>
);
