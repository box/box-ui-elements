import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import noop from 'lodash/noop';
import type { BoxItem, Collection } from '../../../common/types/core';

export const MockTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div data-testid="tooltip-provider">{children}</div>
);

export const MockFeatureProvider: React.FC<{ children: React.ReactNode; features: Record<string, unknown> }> = ({
    children,
    features,
}) => (
    <div data-testid="feature-provider" data-features={JSON.stringify(features)}>
        {children}
    </div>
);

export const MockHeader: React.FC<{
    onUpload: () => void;
    onViewModeChange: (mode: 'grid' | 'list') => void;
}> = ({ onUpload, onViewModeChange }) => {
    const intl = useIntl();
    return (
        <header role="banner">
            <h1>
                <FormattedMessage
                    id="be.contentExplorer.title"
                    defaultMessage="Content Explorer"
                    description="Title displayed at the top of the content explorer"
                />
            </h1>
            <div role="toolbar">
                <button
                    onClick={() => onViewModeChange('grid')}
                    type="button"
                    aria-label={intl.formatMessage({
                        id: 'be.contentExplorer.switchToGridView',
                        defaultMessage: 'Switch to grid view',
                        description: 'Aria label for button that switches view mode to grid layout',
                    })}
                    data-testid="view-mode-grid"
                >
                    <FormattedMessage
                        id="be.contentExplorer.gridView"
                        defaultMessage="Grid View"
                        description="Label for button that switches to grid view mode"
                    />
                </button>
                <button
                    onClick={noop}
                    type="button"
                    aria-label={intl.formatMessage({
                        id: 'be.contentExplorer.editMetadataAriaLabel',
                        defaultMessage: 'Edit metadata',
                        description: 'Aria label for edit metadata button',
                    })}
                    data-testid="edit-metadata"
                >
                    <FormattedMessage
                        id="be.contentExplorer.editMetadata"
                        defaultMessage="Edit Metadata"
                        description="Label for button that opens metadata editor"
                    />
                </button>
                <button
                    onClick={onUpload}
                    type="button"
                    aria-label={intl.formatMessage({
                        id: 'be.contentExplorer.uploadFilesAriaLabel',
                        defaultMessage: 'Upload files',
                        description: 'Aria label for upload button',
                    })}
                    data-testid="upload-button"
                >
                    <FormattedMessage
                        id="be.contentExplorer.upload"
                        defaultMessage="Upload"
                        description="Label for upload button"
                    />
                </button>
            </div>
        </header>
    );
};

export const MockSubHeader: React.FC<{
    onSave?: () => void;
}> = ({ onSave }) => {
    const intl = useIntl();
    return (
        <div role="toolbar" data-testid="sub-header">
            <div>
                <button
                    onClick={noop}
                    aria-label={intl.formatMessage({
                        id: 'be.contentExplorer.sortByNameAriaLabel',
                        defaultMessage: 'Sort by name',
                        description: 'Aria label for sort by name button',
                    })}
                >
                    <FormattedMessage
                        id="be.contentExplorer.sortName"
                        defaultMessage="Name"
                        description="Label for name sort button"
                    />
                </button>
                <button
                    onClick={noop}
                    aria-label={intl.formatMessage({
                        id: 'be.contentExplorer.sortByDateAriaLabel',
                        defaultMessage: 'Sort by date',
                        description: 'Aria label for date sort button',
                    })}
                >
                    <FormattedMessage
                        id="be.contentExplorer.sortDate"
                        defaultMessage="Date"
                        description="Label for date sort button"
                    />
                </button>
                <button
                    onClick={noop}
                    aria-label={intl.formatMessage({
                        id: 'be.contentExplorer.sortBySizeAriaLabel',
                        defaultMessage: 'Sort by size',
                        description: 'Aria label for size sort button',
                    })}
                >
                    <FormattedMessage
                        id="be.contentExplorer.sortSize"
                        defaultMessage="Size"
                        description="Label for size sort button"
                    />
                </button>
            </div>
            <button
                onClick={onSave}
                aria-label={intl.formatMessage({
                    id: 'be.contentExplorer.saveChangesAriaLabel',
                    defaultMessage: 'Save changes',
                    description: 'Aria label for save changes button',
                })}
                data-testid="save-button"
            >
                <FormattedMessage id="be.save" defaultMessage="Save" description="Label for save button" />
            </button>
            <input
                type="text"
                aria-label={intl.formatMessage({
                    id: 'be.contentExplorer.amountInputAriaLabel',
                    defaultMessage: 'Amount',
                    description: 'Aria label for amount input field',
                })}
                defaultValue="100.34"
                data-testid="amount-input"
            />
        </div>
    );
};

export const MockContent: React.FC<{
    currentCollection?: Collection;
    viewMode?: 'grid' | 'list';
    onItemClick?: (item: BoxItem) => void;
    onItemSelect?: (item: BoxItem) => void;
    view?: string;
}> = ({ currentCollection, viewMode, onItemClick, onItemSelect, view }) => {
    const intl = useIntl();
    const items = currentCollection?.items || [];
    const isLoading = currentCollection?.percentLoaded !== 100;
    const hasError = view === 'error';

    if (hasError) {
        return (
            <div role="alert" data-testid="content-error">
                <FormattedMessage
                    id="be.contentExplorer.error"
                    defaultMessage="Error loading content"
                    description="Message shown when there is an error loading content"
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div role="status" aria-busy="true" data-testid="content-loading">
                <FormattedMessage
                    id="be.contentExplorer.loading"
                    defaultMessage="Loading content..."
                    description="Message shown while content is being loaded"
                />
            </div>
        );
    }

    return (
        <div
            role="grid"
            aria-label={items.length === 0 ? 'Empty folder' : 'Folder contents'}
            style={{ gridTemplateColumns: viewMode === 'grid' ? 'repeat(7, 1fr)' : 'none' }}
            data-testid="content-grid"
        >
            {items.length === 0 ? (
                <div role="row">
                    <div role="gridcell">
                        <FormattedMessage
                            id="be.contentExplorer.empty"
                            defaultMessage="This folder is empty"
                            description="Message shown when a folder contains no items"
                        />
                    </div>
                </div>
            ) : (
                items.map((item: BoxItem) => (
                    <div
                        key={item.id}
                        role="row"
                        aria-selected={item.selected ? 'true' : 'false'}
                        data-testid={`row-${item.id}`}
                    >
                        <div role="gridcell">
                            <button
                                onClick={() => {
                                    if (item.type === 'folder') {
                                        onItemClick?.(item);
                                    } else {
                                        onItemSelect?.(item);
                                    }
                                }}
                                type="button"
                                data-testid={`item-${item.id}`}
                                aria-label={
                                    item.type === 'folder'
                                        ? intl.formatMessage(
                                              {
                                                  id: 'be.contentExplorer.openFolderAriaLabel',
                                                  defaultMessage: 'Open folder {name}',
                                                  description:
                                                      'Aria label for button that opens a folder, {name} is replaced with folder name',
                                              },
                                              { name: item.name },
                                          )
                                        : intl.formatMessage(
                                              {
                                                  id: 'be.contentExplorer.selectFileAriaLabel',
                                                  defaultMessage: 'Select file {name}',
                                                  description:
                                                      'Aria label for button that selects a file, {name} is replaced with file name',
                                              },
                                              { name: item.name },
                                          )
                                }
                            >
                                {item.type === 'file' && (
                                    <span
                                        role="img"
                                        aria-label={intl.formatMessage({
                                            id: 'be.contentExplorer.fileIconAriaLabel',
                                            defaultMessage: 'File',
                                            description: 'Aria label for file icon',
                                        })}
                                        data-testid="file-icon"
                                    />
                                )}
                                {item.type === 'folder' && (
                                    <span
                                        role="img"
                                        aria-label={intl.formatMessage({
                                            id: 'be.contentExplorer.folderIconAriaLabel',
                                            defaultMessage: 'Folder',
                                            description: 'Aria label for folder icon',
                                        })}
                                        data-testid="folder-icon"
                                    />
                                )}
                                <span>{item.name}</span>
                                {item.thumbnailUrl && (
                                    <img
                                        src={item.thumbnailUrl}
                                        alt={intl.formatMessage(
                                            {
                                                id: 'be.contentExplorer.thumbnailAlt',
                                                defaultMessage: 'Thumbnail for {name}',
                                                description: 'Alt text for item thumbnail image',
                                            },
                                            { name: item.name },
                                        )}
                                        data-testid={`thumbnail-${item.id}`}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
export const MockUploadDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    contentUploaderProps?: Record<string, unknown>;
}> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title" data-testid="upload-dialog">
            <h2 id="upload-dialog-title">
                <FormattedMessage id="be.upload" defaultMessage="Upload Files" description="Title for upload dialog" />
            </h2>
            <div>
                <FormattedMessage
                    id="be.uploadDialogMessage"
                    defaultMessage="Upload Dialog Content"
                    description="Content message in upload dialog"
                />
            </div>
            <button onClick={onClose} type="button" data-testid="close-upload-dialog">
                <FormattedMessage id="be.close" defaultMessage="Close" description="Label for close button" />
            </button>
        </div>
    );
};

export const MockCreateFolderDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}> = ({ isOpen, onClose, onCreate }) => {
    if (!isOpen) return null;
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-folder-dialog-title"
            data-testid="create-folder-dialog"
        >
            <h2 id="create-folder-dialog-title">
                <FormattedMessage
                    id="be.createDialogTitle"
                    defaultMessage="Create New Folder"
                    description="Title for create folder dialog"
                />
            </h2>
            <div>
                <FormattedMessage
                    id="be.createDialogMessage"
                    defaultMessage="Enter a name for the new folder"
                    description="Instructions for creating a new folder"
                />
            </div>
            <button onClick={onClose} type="button" data-testid="cancel-create-folder">
                <FormattedMessage id="be.cancel" defaultMessage="Cancel" description="Label for cancel button" />
            </button>
            <button onClick={() => onCreate('New Folder')} type="button" data-testid="confirm-create-folder">
                <FormattedMessage id="be.create" defaultMessage="Create" description="Label for create button" />
            </button>
        </div>
    );
};

export const MockDeleteConfirmationDialog: React.FC<{
    isOpen: boolean;
    onCancel: () => void;
    onDelete: () => void;
    item?: BoxItem;
}> = ({ isOpen, onCancel, onDelete, item }) => {
    if (!isOpen) return null;
    return (
        <div role="dialog" data-testid="delete-confirmation-dialog" aria-label="Delete Confirmation" aria-modal="true">
            <div className="modal-content">
                <p>
                    <FormattedMessage
                        id="be.deleteDialogMessage"
                        defaultMessage="Are you sure you want to delete {name}?"
                        description="Confirmation message for deleting an item, {name} is replaced with item name"
                        values={{ name: item?.name }}
                    />
                </p>
                <div className="modal-footer">
                    <button onClick={onCancel} type="button" data-testid="cancel-delete">
                        <FormattedMessage
                            id="be.cancel"
                            defaultMessage="Cancel"
                            description="Label for cancel button in delete dialog"
                        />
                    </button>
                    <button onClick={onDelete} type="button" data-testid="confirm-delete">
                        <FormattedMessage
                            id="be.delete"
                            defaultMessage="Delete"
                            description="Label for delete confirmation button"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const MockRenameDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onRename: (item: BoxItem, newName: string) => void;
    item?: BoxItem;
}> = ({ isOpen, onClose, onRename, item }) => {
    if (!isOpen) return null;
    return (
        <div role="dialog" data-testid="rename-dialog" aria-labelledby="rename-dialog-title" aria-modal="true">
            <h2 id="rename-dialog-title">
                <FormattedMessage
                    id="be.renameDialogTitle"
                    defaultMessage="Rename"
                    description="Title for rename dialog"
                />
            </h2>
            <div>
                <FormattedMessage
                    id="be.renameDialogMessage"
                    defaultMessage="Rename this item"
                    description="Instructions for renaming an item"
                />
            </div>
            <button onClick={onClose} data-testid="cancel-rename">
                <FormattedMessage
                    id="be.cancel"
                    defaultMessage="Cancel"
                    description="Label for cancel button in rename dialog"
                />
            </button>
            <button onClick={() => onRename(item!, 'New Name')} data-testid="confirm-rename">
                <FormattedMessage
                    id="be.rename"
                    defaultMessage="Rename"
                    description="Label for rename confirmation button"
                />
            </button>
        </div>
    );
};

export const MockShareDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    item?: BoxItem;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
}> = ({ isOpen, onClose, item }) => {
    if (!isOpen) return null;
    return (
        <div role="dialog" data-testid="share-dialog" aria-labelledby="share-dialog-title" aria-modal="true">
            <h2 id="share-dialog-title">
                <FormattedMessage
                    id="be.shareDialogTitle"
                    defaultMessage="Share"
                    description="Title for share dialog"
                />
            </h2>
            <div>
                <FormattedMessage
                    id="be.shareDialogMessage"
                    defaultMessage="Share this item with others"
                    description="Instructions for sharing an item"
                />
            </div>
            <button onClick={onClose} data-testid="close-share-dialog">
                <FormattedMessage
                    id="be.close"
                    defaultMessage="Close"
                    description="Label for close button in share dialog"
                />
            </button>
        </div>
    );
};

export const MockPreviewDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    item?: BoxItem;
}> = ({ isOpen, onClose, item }) => {
    const intl = useIntl();
    if (!isOpen) return null;
    return (
        <div role="dialog" data-testid="preview-dialog" aria-labelledby="preview-dialog-title" aria-modal="true">
            <h2 id="preview-dialog-title">
                <FormattedMessage
                    id="be.contentExplorer.preview"
                    defaultMessage="Preview {name}"
                    description="Title for preview dialog, {name} is replaced with item name"
                    values={{ name: item?.name }}
                />
            </h2>
            <div>
                <FormattedMessage
                    id="be.contentExplorer.previewContent"
                    defaultMessage="Preview content"
                    description="Content area label in preview dialog"
                />
            </div>
            <button
                onClick={onClose}
                data-testid="close-preview-dialog"
                aria-label={intl.formatMessage({
                    id: 'be.contentExplorer.closePreviewAriaLabel',
                    defaultMessage: 'Close preview',
                    description: 'Aria label for close preview button',
                })}
            >
                <FormattedMessage
                    id="be.close"
                    defaultMessage="Close"
                    description="Label for close button in preview dialog"
                />
            </button>
        </div>
    );
};
