Object.defineProperty(exports, '__esModule', { value: true });
exports.IconCellBase = void 0;
const React = require('react');
const react_intl_1 = require('react-intl');
const Content_1 = require('@box/blueprint-web-assets/icons/Content');
const FileIcon_1 = require('../../../icons/file-icon/FileIcon');
const FolderIcon_1 = require('../../../icons/folder-icon/FolderIcon');
const BookmarkIcon_1 = require('../../../icons/bookmark-icon/BookmarkIcon');
const messages_1 = require('../messages');
const constants_1 = require('../../../common/constants');
require('./IconCell.scss');

const IconCell = function (_a) {
    const { intl } = _a;
    const { rowData } = _a;
    const _b = _a.dimension;
    const dimension = _b === void 0 ? 32 : _b;
    const { type } = rowData;
    const { extension } = rowData;
    const hasCollaborations = rowData.has_collaborations;
    const isExternallyOwned = rowData.is_externally_owned;
    const archiveType = rowData.archive_type;
    const { formatMessage } = intl;
    switch (type) {
        case constants_1.ITEM_TYPE_FILE:
            return (
                <FileIcon_1.default
                    aria-label={formatMessage(messages_1.default.file)}
                    dimension={dimension}
                    extension={extension}
                    title={formatMessage(messages_1.default.file)}
                />
            );
        case constants_1.ITEM_TYPE_WEBLINK:
            return (
                <BookmarkIcon_1.default
                    aria-label={formatMessage(messages_1.default.bookmark)}
                    className="icon-bookmark"
                    height={dimension}
                    title={formatMessage(messages_1.default.bookmark)}
                    width={dimension}
                />
            );
        case constants_1.ITEM_TYPE_FOLDER: {
            let title = void 0;
            if (archiveType === 'folder_archive') {
                return (
                    <Content_1.FolderArchive
                        {...{
                            'aria-label': formatMessage(messages_1.default.archivedFolder),
                            'data-testid': 'folder-archive-icon-cell',
                            height: dimension,
                            width: dimension,
                            role: 'img',
                        }}
                    />
                );
            }
            if (archiveType === 'archive') {
                return (
                    <Content_1.Archive
                        {...{
                            'aria-label': formatMessage(messages_1.default.archive),
                            'data-testid': 'archive-icon-cell',
                            height: dimension,
                            width: dimension,
                            role: 'img',
                        }}
                    />
                );
            }
            title = isExternallyOwned
                ? formatMessage(messages_1.default.externalFolder)
                : hasCollaborations
                  ? formatMessage(messages_1.default.collaboratedFolder)
                  : formatMessage(messages_1.default.personalFolder);
            return (
                <FolderIcon_1.default
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
            return <FileIcon_1.default dimension={dimension} title={formatMessage(messages_1.default.file)} />;
    }
};
exports.IconCellBase = IconCell;
exports.default = (0, react_intl_1.injectIntl)(IconCell);
