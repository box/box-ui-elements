import * as React from 'react';
import { useIntl } from 'react-intl';

import { Archive, FolderArchive, FileBookmark } from '@box/blueprint-web-assets/icons/Content';
import FileIcon from '../../../icons/file-icon/FileIcon';
import FolderIcon from '../../../icons/folder-icon/FolderIcon';

import type { BoxItem } from '../../../common/types/core';

import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../../../constants';
import messages from '../messages';

import './IconCell.scss';

export interface IconCellProps {
    dimension?: number;
    rowData: BoxItem;
}

const IconCell = ({ rowData, dimension }: IconCellProps) => {
    const { formatMessage } = useIntl();
    const { type, extension, has_collaborations, is_externally_owned, archive_type }: BoxItem = rowData;
    const is_archive = archive_type === 'archive';
    const is_archive_folder = archive_type === 'folder_archive';
    switch (type) {
        case TYPE_FILE:
            return <FileIcon dimension={dimension} extension={extension} />;
        case TYPE_FOLDER:
            if (is_archive) {
                return (
                    <Archive
                        aria-label={formatMessage(messages.archive)}
                        data-testid="archive-icon-cell"
                        height={dimension}
                        width={dimension}
                    />
                );
            }
            if (is_archive_folder) {
                return (
                    <FolderArchive
                        aria-label={formatMessage(messages.archivedFolder)}
                        data-testid="folder-archive-icon-cell"
                        height={dimension}
                        width={dimension}
                    />
                );
            }
            return <FolderIcon dimension={dimension} isCollab={has_collaborations} isExternal={is_externally_owned} />;
        case TYPE_WEBLINK:
            return <FileBookmark height={dimension} width={dimension} aria-label={formatMessage(messages.bookmark)} />;
        default:
            return <FileIcon dimension={dimension} />;
    }
};

export default IconCell;
