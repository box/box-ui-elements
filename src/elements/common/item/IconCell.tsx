import * as React from 'react';
import { useIntl } from 'react-intl';
import { Archive, FolderArchive } from '@box/blueprint-web-assets/icons/Content';
import AccessibleSVG from '../../../components/accessible-svg/AccessibleSVG';

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
    // Support both camelCase and snake_case for backward compatibility
    hasCollaborations?: boolean;
    has_collaborations?: boolean;
    isExternallyOwned?: boolean;
    is_externally_owned?: boolean;
    archiveType?: string;
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
    const { type, extension, has_collaborations, is_externally_owned, archive_type } = rowData;

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
            if (archive_type === 'folder_archive') {
                const title = formatMessage(messages.archivedFolder);
                return (
                    <AccessibleSVG
                        data-testid="folder-archive-icon-cell"
                        height={dimension}
                        width={dimension}
                        title={title}
                        viewBox="0 0 32 32"
                    >
                        <FolderArchive />
                    </AccessibleSVG>
                );
            }

            if (archive_type === 'archive') {
                const title = formatMessage(messages.archive);
                return (
                    <AccessibleSVG
                        data-testid="archive-icon-cell"
                        height={dimension}
                        width={dimension}
                        title={title}
                        viewBox="0 0 32 32"
                    >
                        <Archive />
                    </AccessibleSVG>
                );
            }

            const getFolderTitle = () => {
                if (has_collaborations) {
                    return formatMessage(messages.collaboratedFolder);
                }
                if (is_externally_owned) {
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
                    isExternal={is_externally_owned}
                    isCollab={has_collaborations}
                />
            );
        }
        default:
            return <FileIcon dimension={dimension} title={formatMessage(messages.file)} />;
    }
};

export default IconCell;
