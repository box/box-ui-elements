import * as React from 'react';
import { useIntl } from 'react-intl';
import { Archive, FolderArchive } from '@box/blueprint-web-assets/icons/Content';

import FileIcon from '../../../icons/file-icon/FileIcon';
import FolderIcon from '../../../icons/folder-icon/FolderIcon';
import BookmarkIcon from '../../../icons/bookmark-icon/BookmarkIcon';
import messages from '../messages';
import { ITEM_TYPE_FILE, ITEM_TYPE_FOLDER, ITEM_TYPE_WEBLINK } from '../../../common/constants';

import './IconCell.scss';

import type { ItemType } from '../../../common/types/core';

export type BoxItem = {
    type: ItemType;
    extension?: string;
    has_collaborations?: boolean;
    is_externally_owned?: boolean;
    archive_type?: string;
};

type IconCellProps = {
    /** Data for the row being rendered */
    rowData: BoxItem;
    /** Dimension of the icon */
    dimension?: number;
};

const IconCell = ({ rowData, dimension = 32 }: IconCellProps): JSX.Element => {
    const { formatMessage } = useIntl();
    const {
        type,
        extension,
        has_collaborations: hasCollaborations,
        is_externally_owned: isExternallyOwned,
        archive_type: archiveType,
    } = rowData;

    switch (type) {
        case ITEM_TYPE_FILE:
            return (
                <FileIcon
                    aria-label={formatMessage(messages.file)}
                    dimension={dimension}
                    extension={extension}
                    title={formatMessage(messages.file)}
                />
            );
        case ITEM_TYPE_WEBLINK:
            return (
                <BookmarkIcon
                    aria-label={formatMessage(messages.bookmark)}
                    className="icon-bookmark"
                    height={dimension}
                    title={formatMessage(messages.bookmark)}
                    width={dimension}
                />
            );
        case ITEM_TYPE_FOLDER: {
            if (archiveType === 'folder_archive') {
                return (
                    <FolderArchive
                        width={dimension}
                        height={dimension}
                        role="img"
                        aria-label={formatMessage(messages.archivedFolder)}
                    />
                );
            }

            if (archiveType === 'archive') {
                return (
                    <Archive
                        width={dimension}
                        height={dimension}
                        role="img"
                        aria-label={formatMessage(messages.archive)}
                    />
                );
            }

            const getFolderTitle = () => {
                if (hasCollaborations) {
                    return formatMessage(messages.collaboratedFolder);
                }
                if (isExternallyOwned) {
                    return formatMessage(messages.externalFolder);
                }
                return formatMessage(messages.personalFolder);
            };
            const title = getFolderTitle();

            return (
                <FolderIcon
                    dimension={dimension}
                    role="img"
                    title={title}
                    aria-label={title}
                    isExternal={isExternallyOwned}
                    isCollab={hasCollaborations}
                />
            );
        }
        default:
            return <FileIcon dimension={dimension} title={formatMessage(messages.file)} />;
    }
};

export default IconCell;
