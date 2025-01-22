import React from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';

// Data Providers
import { TooltipProvider } from '@box/blueprint-web';
import { IntlProvider } from 'react-intl';
import { FeatureProvider } from '../elements/common/feature-checking';

// Mock ResizeObserver
const mockResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Add ResizeObserver to the global object
(global as unknown as { ResizeObserver: typeof mockResizeObserver }).ResizeObserver = mockResizeObserver;

jest.unmock('react-intl');

// Message types
type IntlMessage = {
    id: string;
    defaultMessage: string;
    description?: string;
};

type IntlMessages = {
    [key: string]: string | IntlMessage;
};

// Default messages with descriptions
const defaultMessages: Record<string, IntlMessage> = {
    'be.contentExplorer.title': {
        id: 'be.contentExplorer.title',
        defaultMessage: 'Content Explorer',
        description: 'Title for the content explorer component',
    },
    'be.contentExplorer.gridView': {
        id: 'be.contentExplorer.gridView',
        defaultMessage: 'Grid View',
        description: 'Label for grid view button',
    },
    'be.contentExplorer.editMetadata': {
        id: 'be.contentExplorer.editMetadata',
        defaultMessage: 'Edit Metadata',
        description: 'Label for edit metadata button',
    },
    'be.contentExplorer.upload': {
        id: 'be.contentExplorer.upload',
        defaultMessage: 'Upload',
        description: 'Label for upload button',
    },
    'be.contentExplorer.loading': {
        id: 'be.contentExplorer.loading',
        defaultMessage: 'Loading content...',
        description: 'Message shown while content is loading',
    },
    'be.contentExplorer.empty': {
        id: 'be.contentExplorer.empty',
        defaultMessage: 'This folder is empty',
        description: 'Message shown when a folder contains no items',
    },
    'be.contentExplorer.error': {
        id: 'be.contentExplorer.error',
        defaultMessage: 'Error loading content',
        description: 'Message shown when content fails to load',
    },
    'be.contentExplorer.preview': {
        id: 'be.contentExplorer.preview',
        defaultMessage: 'Preview {name}',
        description: 'Title for preview dialog with item name',
    },
    'be.contentExplorer.closePreviewAriaLabel': {
        id: 'be.contentExplorer.closePreviewAriaLabel',
        defaultMessage: 'Close preview',
        description: 'Aria label for close preview button',
    },
    'be.contentExplorer.editMetadataAriaLabel': {
        id: 'be.contentExplorer.editMetadataAriaLabel',
        defaultMessage: 'Edit metadata',
        description: 'Aria label for edit metadata button',
    },
    'be.contentExplorer.uploadFilesAriaLabel': {
        id: 'be.contentExplorer.uploadFilesAriaLabel',
        defaultMessage: 'Upload files',
        description: 'Aria label for upload files button',
    },
    'be.contentExplorer.openFolderAriaLabel': {
        id: 'be.contentExplorer.openFolderAriaLabel',
        defaultMessage: 'Open folder {name}',
        description: 'Aria label for opening a folder',
    },
    'be.contentExplorer.selectFileAriaLabel': {
        id: 'be.contentExplorer.selectFileAriaLabel',
        defaultMessage: 'Select file {name}',
        description: 'Aria label for selecting a file',
    },
    'be.contentExplorer.fileIconAriaLabel': {
        id: 'be.contentExplorer.fileIconAriaLabel',
        defaultMessage: 'File',
        description: 'Aria label for file icon',
    },
    'be.contentExplorer.folderIconAriaLabel': {
        id: 'be.contentExplorer.folderIconAriaLabel',
        defaultMessage: 'Folder',
        description: 'Aria label for folder icon',
    },
    'be.contentExplorer.thumbnailAlt': {
        id: 'be.contentExplorer.thumbnailAlt',
        defaultMessage: 'Thumbnail for {name}',
        description: 'Alt text for item thumbnail',
    },
    'be.contentExplorer.sortByNameAriaLabel': {
        id: 'be.contentExplorer.sortByNameAriaLabel',
        defaultMessage: 'Sort by name',
        description: 'Aria label for sort by name button',
    },
    'be.contentExplorer.sortByDateAriaLabel': {
        id: 'be.contentExplorer.sortByDateAriaLabel',
        defaultMessage: 'Sort by date',
        description: 'Aria label for sort by date button',
    },
    'be.contentExplorer.sortBySizeAriaLabel': {
        id: 'be.contentExplorer.sortBySizeAriaLabel',
        defaultMessage: 'Sort by size',
        description: 'Aria label for sort by size button',
    },
    'be.contentExplorer.sortName': {
        id: 'be.contentExplorer.sortName',
        defaultMessage: 'Name',
        description: 'Label for name sort option',
    },
    'be.contentExplorer.sortDate': {
        id: 'be.contentExplorer.sortDate',
        defaultMessage: 'Date',
        description: 'Label for date sort option',
    },
    'be.contentExplorer.sortSize': {
        id: 'be.contentExplorer.sortSize',
        defaultMessage: 'Size',
        description: 'Label for size sort option',
    },
    'be.contentExplorer.previewContent': {
        id: 'be.contentExplorer.previewContent',
        defaultMessage: 'Preview content',
        description: 'Label for preview content',
    },
    'be.contentExplorer.saveChangesAriaLabel': {
        id: 'be.contentExplorer.saveChangesAriaLabel',
        defaultMessage: 'Save changes',
        description: 'Aria label for save changes button',
    },
    'be.contentExplorer.amountInputAriaLabel': {
        id: 'be.contentExplorer.amountInputAriaLabel',
        defaultMessage: 'Amount',
        description: 'Aria label for amount input',
    },
    'be.close': {
        id: 'be.close',
        defaultMessage: 'Close',
        description: 'Label for close button',
    },
    'be.delete': {
        id: 'be.delete',
        defaultMessage: 'Delete',
        description: 'Label for delete button',
    },
    'be.rename': {
        id: 'be.rename',
        defaultMessage: 'Rename',
        description: 'Label for rename button',
    },
    'be.share': {
        id: 'be.share',
        defaultMessage: 'Share',
        description: 'Label for share button',
    },
    'be.cancel': {
        id: 'be.cancel',
        defaultMessage: 'Cancel',
        description: 'Label for cancel button',
    },
    'be.create': {
        id: 'be.create',
        defaultMessage: 'Create',
        description: 'Label for create button',
    },
    'be.save': {
        id: 'be.save',
        defaultMessage: 'Save',
        description: 'Label for save button',
    },
    'be.ok': {
        id: 'be.ok',
        defaultMessage: 'OK',
        description: 'Label for OK button',
    },
    'be.deleteDialogMessage': {
        id: 'be.deleteDialogMessage',
        defaultMessage: 'Are you sure you want to delete {name}?',
        description: 'Message shown in delete confirmation dialog',
    },
    'be.renameDialogTitle': {
        id: 'be.renameDialogTitle',
        defaultMessage: 'Rename',
        description: 'Title for rename dialog',
    },
    'be.renameDialogMessage': {
        id: 'be.renameDialogMessage',
        defaultMessage: 'Rename this item',
        description: 'Message shown in rename dialog',
    },
    'be.shareDialogTitle': {
        id: 'be.shareDialogTitle',
        defaultMessage: 'Share',
        description: 'Title for share dialog',
    },
    'be.shareDialogMessage': {
        id: 'be.shareDialogMessage',
        defaultMessage: 'Share this item with others',
        description: 'Message shown in share dialog',
    },
    'be.createDialogTitle': {
        id: 'be.createDialogTitle',
        defaultMessage: 'Create New Folder',
        description: 'Title for create folder dialog',
    },
    'be.createDialogMessage': {
        id: 'be.createDialogMessage',
        defaultMessage: 'Enter a name for the new folder',
        description: 'Message shown in create folder dialog',
    },
    'be.upload': {
        id: 'be.upload',
        defaultMessage: 'Upload Files',
        description: 'Label for upload files button',
    },
    'be.uploadDialogMessage': {
        id: 'be.uploadDialogMessage',
        defaultMessage: 'Upload Dialog Content',
        description: 'Message shown in upload dialog',
    },
};

const createIntlMessages = (messages: Record<string, string | IntlMessage>): Record<string, string> => {
    return Object.entries(messages).reduce(
        (acc, [id, message]) => {
            acc[id] = typeof message === 'string' ? message : message.defaultMessage;
            return acc;
        },
        {} as Record<string, string>,
    );
};

const Wrapper = ({
    children,
    features = {},
    messages = {},
}: {
    children: React.ReactNode;
    features?: Record<string, unknown>;
    messages?: IntlMessages;
}) => {
    const intlMessages = createIntlMessages({ ...defaultMessages, ...messages });
    return (
        <FeatureProvider features={features}>
            <TooltipProvider>
                <IntlProvider locale="en" messages={intlMessages} defaultLocale="en">
                    {children}
                </IntlProvider>
            </TooltipProvider>
        </FeatureProvider>
    );
};

type RenderConnectedOptions = RenderOptions & {
    wrapperProps?: {
        features?: Record<string, unknown>;
        messages?: IntlMessages;
    };
};

const renderConnected = (element: React.ReactElement, options: RenderConnectedOptions = {}): RenderResult => {
    const messages = options.wrapperProps?.messages || {};
    const mergedMessages = {
        ...defaultMessages,
        ...messages,
    };

    return render(element, {
        wrapper: options.wrapper
            ? options.wrapper
            : props => <Wrapper {...props} {...options.wrapperProps} messages={mergedMessages} />,
        ...options,
    });
};

export * from '@testing-library/react';
export { renderConnected as render };
