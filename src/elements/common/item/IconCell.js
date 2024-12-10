/**
 * @flow
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import { Archive, FolderArchive } from '@box/blueprint-web-assets/icons/Content';
import FileIcon from '../../../icons/file-icon/FileIcon';
import FolderIcon from '../../../icons/folder-icon/FolderIcon';
import BookmarkIcon from '../../../icons/bookmark-icon/BookmarkIcon';
import type { BoxItem } from '../../../common/types/core';

import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../../../constants';
import messages from '../messages';

import './IconCell.scss';

type Props = { dimension?: number, intl: IntlShape, rowData: BoxItem };

const IconCell = ({ intl, rowData, dimension }: Props) => {
    const { type, extension, has_collaborations, is_externally_owned, archive_type }: BoxItem = rowData;
    let title;
    const is_archive = archive_type === 'archive';
    const is_archive_folder = archive_type === 'folder_archive';
    switch (type) {
        case TYPE_FILE:
            title = intl.formatMessage(messages.file);
            return <FileIcon dimension={dimension} extension={extension} title={title} />;
        case TYPE_FOLDER:
            if (is_archive) {
                return (
                    <Archive
                        aria-label={intl.formatMessage(messages.archive)}
                        data-testid="archive-icon-cell"
                        height={dimension}
                        width={dimension}
                    />
                );
            }
            if (is_archive_folder) {
                return (
                    <FolderArchive
                        aria-label={intl.formatMessage(messages.archivedFolder)}
                        data-testid="folder-archive-icon-cell"
                        height={dimension}
                        width={dimension}
                    />
                );
            }
            if (has_collaborations) {
                title = intl.formatMessage(messages.collaboratedFolder);
            } else if (is_externally_owned) {
                title = intl.formatMessage(messages.externalFolder);
            } else {
                title = intl.formatMessage(messages.personalFolder);
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
            title = intl.formatMessage(messages.bookmark);
            return <BookmarkIcon height={dimension} width={dimension} title={title} />;
        default:
            title = intl.formatMessage(messages.file);
            return <FileIcon dimension={dimension} title={title} />;
    }
};

export { IconCell as IconCellBase };
export default injectIntl(IconCell);
