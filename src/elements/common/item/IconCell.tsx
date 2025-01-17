import * as React from 'react';
import { useIntl } from 'react-intl';
import { Archive, FolderArchive } from '@box/blueprint-web-assets/icons/Content';
import AccessibleSVG from '../../../components/accessible-svg/AccessibleSVG';
import FileIcon from '../../../icons/file-icon/FileIcon';
import BookmarkIcon from '../../../icons/bookmark-icon/BookmarkIcon';
import FolderShared32 from '../../../icon/content/FolderShared32';
import FolderExternal32 from '../../../icon/content/FolderExternal32';
import FolderPersonal32 from '../../../icon/content/FolderPersonal32';
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
    const {
        type,
        extension,
        has_collaborations,
        hasCollaborations,
        is_externally_owned,
        isExternallyOwned,
        archive_type,
        archiveType,
    } = rowData;
    const effectiveArchiveType = archive_type || archiveType;
    const isExternallyOwnedFlag = is_externally_owned || isExternallyOwned;
    const hasCollaborationsFlag = has_collaborations || hasCollaborations;

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
                    className="icon-bookmark"
                    height={dimension}
                    width={dimension}
                    title={formatMessage(messages.bookmark)}
                    aria-label={formatMessage(messages.bookmark)}
                    role="img"
                />
            );
        case ITEM_TYPE_FOLDER: {
            if (effectiveArchiveType === 'folder_archive') {
                const title = formatMessage(messages.archivedFolder);
                return (
                    <AccessibleSVG
                        className="icon-folder-archive"
                        data-testid="folder-archive-icon-cell"
                        height={dimension}
                        width={dimension}
                        title={title}
                        role="img"
                        viewBox="0 0 32 32"
                        aria-label={title}
                    >
                        <FolderArchive aria-hidden="true" height={dimension} width={dimension} />
                    </AccessibleSVG>
                );
            }

            if (effectiveArchiveType === 'archive') {
                const title = formatMessage(messages.archive);
                return (
                    <AccessibleSVG
                        className="icon-archive"
                        data-testid="archive-icon-cell"
                        height={dimension}
                        width={dimension}
                        title={title}
                        role="img"
                        viewBox="0 0 32 32"
                        aria-label={title}
                    >
                        <Archive aria-hidden="true" height={dimension} width={dimension} />
                    </AccessibleSVG>
                );
            }

            let title;
            let IconComponent;
            let className;

            if (isExternallyOwnedFlag) {
                title = formatMessage(messages.externalFolder);
                IconComponent = FolderExternal32;
                className = 'icon-folder-external';
            } else if (hasCollaborationsFlag) {
                title = formatMessage(messages.collaboratedFolder);
                IconComponent = FolderShared32;
                className = 'icon-folder-shared';
            } else {
                title = formatMessage(messages.personalFolder);
                IconComponent = FolderPersonal32;
                className = 'icon-folder-personal';
            }

            return (
                <IconComponent
                    className={className}
                    height={dimension}
                    width={dimension}
                    title={title}
                    viewBox="0 0 32 32"
                    role="img"
                    aria-label={title}
                />
            );
        }
        default:
            return (
                <FileIcon
                    dimension={dimension}
                    title={formatMessage(messages.file)}
                    aria-label={formatMessage(messages.file)}
                    role="img"
                />
            );
    }
};

export default IconCell;
