import * as React from 'react';
import { useIntl } from 'react-intl';
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
                    role="img"
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
            // Handle archive types first
            if (effectiveArchiveType === 'folder_archive') {
                const title = formatMessage(messages.archivedFolder);
                return (
                    <AccessibleSVG
                        className="icon-folder-archive"
                        data-testid="folder-archive-icon-cell"
                        height={dimension}
                        width={dimension}
                        title={title}
                        aria-label={title}
                        role="img"
                        viewBox="0 0 32 32"
                    >
                        <g fill="none" fillRule="evenodd">
                            <path
                                fill="#6B4FCC"
                                fillRule="evenodd"
                                d="M6 6h6c2 0 1.5 2 4 2h10a3 3 0 013 3v13a3 3 0 01-3 3H6a3 3 0 01-3-3V9a3 3 0 013-3Z"
                                clipRule="evenodd"
                            />
                            <path fill="#fff" fillOpacity={0.6} d="M14.5 19a.5.5 0 000 1h3a.5.5 0 000-1h-3Z" />
                            <path
                                fill="#fff"
                                fillOpacity={0.6}
                                fillRule="evenodd"
                                d="M26 11H6a3 3 0 00-3 3v10a3 3 0 003 3h20a3 3 0 003-3V14a3 3 0 00-3-3Zm-15.5 4.8a.8.8 0 01.8-.8h9.4a.8.8 0 01.8.8v.4a.8.8 0 01-.8.8h-9.4a.8.8 0 01-.8-.8v-.4ZM21 18H11v5a1 1 0 001 1h8a1 1 0 001-1v-5Z"
                                clipRule="evenodd"
                            />
                        </g>
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
                        aria-label={title}
                        role="img"
                        viewBox="0 0 32 32"
                    >
                        <g fill="none" fillRule="evenodd">
                            <path
                                fill="#6B4FCC"
                                d="M3 7.5A1.5 1.5 0 014.5 6h23A1.5 1.5 0 0129 7.5v2a1.5 1.5 0 01-1.5 1.5h-23A1.5 1.5 0 013 9.5v-2Z"
                            />
                            <path fill="#A392E0" d="M4.5 11h23v13a3 3 0 01-3 3h-17a3 3 0 01-3-3V11Z" />
                            <path
                                fill="white"
                                d="M12 15a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-1 1h-6a1 1 0 01-1-1v-1Z"
                            />
                        </g>
                    </AccessibleSVG>
                );
            }

            // Handle regular folder types
            const getFolderConfig = () => {
                // Priority: Collaboration > External > Personal
                if (hasCollaborationsFlag) {
                    return {
                        title: formatMessage(messages.collaboratedFolder),
                        IconComponent: FolderShared32,
                        className: 'icon-folder-shared',
                    };
                }
                if (isExternallyOwnedFlag && !hasCollaborationsFlag) {
                    return {
                        title: formatMessage(messages.externalFolder),
                        IconComponent: FolderExternal32,
                        className: 'icon-folder-external',
                    };
                }
                return {
                    title: formatMessage(messages.personalFolder),
                    IconComponent: FolderPersonal32,
                    className: 'icon-folder-personal',
                };
            };

            const { title, IconComponent, className } = getFolderConfig();

            return (
                <AccessibleSVG
                    className={className}
                    height={dimension}
                    width={dimension}
                    aria-label={title}
                    viewBox="0 0 32 32"
                >
                    <IconComponent height={dimension} width={dimension} />
                </AccessibleSVG>
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
