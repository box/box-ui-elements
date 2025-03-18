import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '../../../test-utils/testing-library';
import { ContentExplorerComponent as ContentExplorer, ContentExplorerProps } from '../ContentExplorer';
import { mockRecentItems, mockRootFolder, mockRootFolderSharedLink } from '../../common/__mocks__/mockRootFolder';
import { mockMetadata, mockSchema } from '../../common/__mocks__/mockMetadata';
import mockSubFolder from '../../common/__mocks__/mockSubfolder';

jest.mock('../../../utils/Xhr', () => {
    return jest.fn().mockImplementation(() => {
        return {
            get: jest.fn(({ url }) => {
                switch (url) {
                    case 'https://api.box.com/2.0/folders/69083462919':
                        return Promise.resolve({ data: mockRootFolder });
                    case 'https://api.box.com/2.0/folders/73426618530':
                        return Promise.resolve({
                            data: mockSubFolder,
                        });
                    case 'https://api.box.com/2.0/metadata_templates/enterprise/templateName/schema':
                        return Promise.resolve({ data: mockSchema });
                    case 'https://api.box.com/2.0/recent_items':
                        return Promise.resolve({ data: mockRecentItems });
                    default:
                        return Promise.reject(new Error('Not Found'));
                }
            }),
            post: jest.fn(({ url }) => {
                switch (url) {
                    case 'https://api.box.com/2.0/metadata_queries/execute_read':
                        return Promise.resolve({ data: mockMetadata });
                    default:
                        return Promise.reject(new Error('Not Found'));
                }
            }),
            put: jest.fn(({ url }) => {
                switch (url) {
                    case 'https://api.box.com/2.0/folders/73426618530':
                        return Promise.resolve({
                            data: mockRootFolderSharedLink,
                        });
                    default:
                        return Promise.reject(new Error('Not Found'));
                }
            }),
            delete: jest.fn(({ url }) => {
                switch (url) {
                    case 'https://api.box.com/2.0/folders/73426618530?recursive=true':
                        return Promise.resolve({ data: {} });
                    default:
                        return Promise.reject(new Error('Not Found'));
                }
            }),
            abort: jest.fn(),
        };
    });
});

jest.mock(
    '@box/react-virtualized/dist/es/AutoSizer',
    () =>
        ({ children }) =>
            children({ height: 600, width: 1200 }),
);

jest.mock('../../common/preview-dialog/PreviewDialog', () => props => {
    props.onPreview();
    return 'mock-content-preview';
});

describe('elements/content-explorer/ContentExplorer', () => {
    let rootElement: HTMLDivElement;

    const renderComponent = (props: Partial<ContentExplorerProps> = {}) => {
        return render(<ContentExplorer defaultView="list" rootFolderId="69083462919" token="token" {...props} />);
    };

    beforeEach(() => {
        rootElement = document.createElement('div');
        rootElement.appendChild(document.createElement('div'));
        document.body.appendChild(rootElement);
    });

    afterEach(() => {
        jest.clearAllMocks();
        document.body.removeChild(rootElement);
    });

    describe('render', () => {
        test('should render the component', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            expect(screen.getByRole('button', { name: 'Preview Test Folder' })).toBeInTheDocument();
            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Modified')).toBeInTheDocument();
            expect(screen.getByText('Size')).toBeInTheDocument();
            expect(screen.getByText('An Ordered Folder')).toBeInTheDocument();
            expect(screen.getByText('Modified Tue Apr 16 2019 by Preview')).toBeInTheDocument();
            expect(screen.getByRole('gridcell', { name: '191.33 MB' })).toBeInTheDocument();
        });

        test('shoulder render grid view mode', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            expect(screen.getByRole('button', { name: 'Preview Test Folder' })).toBeInTheDocument();

            const gridButton = screen.getByRole('button', { name: 'Switch to Grid View' });
            await userEvent.click(gridButton);

            expect(screen.queryByText('Name')).not.toBeInTheDocument();
            expect(screen.queryByText('Modified')).not.toBeInTheDocument();
            expect(screen.queryByText('Size')).not.toBeInTheDocument();

            expect(screen.getByText('An Ordered Folder')).toBeInTheDocument();
            expect(screen.getByText(/Apr 16, 2019\s+by Preview/)).toBeInTheDocument();
        });
    });

    describe('Upload', () => {
        test('should upload a new item', async () => {
            renderComponent({ canUpload: true });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: 'Add' });
            await userEvent.click(addButton);

            const uploadButton = screen.getByText('Upload');
            await userEvent.click(uploadButton);

            expect(screen.getByText('Drag and drop files')).toBeInTheDocument();
            expect(screen.getByText('Browse your device')).toBeInTheDocument();
        });

        test('should not render upload button when canUpload is false', async () => {
            renderComponent({ canUpload: false });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: 'Add' });
            await userEvent.click(addButton);

            expect(screen.queryByText('Upload')).not.toBeInTheDocument();
        });
    });

    describe('New Folder', () => {
        test('should open new folder dialog', async () => {
            const onCreate = jest.fn();
            renderComponent({ canCreateNewFolder: true, onCreate });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: 'Add' });
            await userEvent.click(addButton);

            const uploadButton = screen.getByText('New Folder');
            await userEvent.click(uploadButton);

            expect(screen.getByText('Please enter a name.')).toBeInTheDocument();

            expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });

        test('should not render new folder button when canCreateNewFolder is false', async () => {
            renderComponent({ canCreateNewFolder: false });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: 'Add' });
            await userEvent.click(addButton);

            expect(screen.queryByText('New Folder')).not.toBeInTheDocument();
        });
    });

    describe('Rename item', () => {
        test('should open rename dialog', async () => {
            const onRename = jest.fn();
            renderComponent({ onRename });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const moreOptionsButton = screen.getAllByRole('button', { name: 'More options' })[0];
            await userEvent.click(moreOptionsButton);
            let renameButton = screen.getByText('Rename');
            expect(renameButton).toBeInTheDocument();
            await userEvent.click(renameButton);

            const input = screen.getByRole('textbox', { name: 'Please enter a new name for An Ordered Folder:' });
            expect(input).toBeInTheDocument();

            renameButton = screen.getByRole('button', { name: 'Rename' });
            expect(renameButton).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            await userEvent.clear(input);
            await userEvent.type(input, 'New Ordered Folder');
            await userEvent.click(renameButton);

            expect(onRename).toHaveBeenCalledWith({
                ...mockRootFolder.item_collection.entries[0],
                selected: true,
                thumbnailUrl: null,
            });
        });

        test('should not render rename button when canRename is false', async () => {
            renderComponent({ canRename: false });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const moreOptionsButton = screen.getAllByRole('button', { name: 'More options' })[0];
            await userEvent.click(moreOptionsButton);

            expect(screen.queryByText('Rename')).not.toBeInTheDocument();
        });
    });

    describe('Share', () => {
        test('should create share link', async () => {
            renderComponent({ isSmall: true });

            await waitFor(() => {
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const moreOptionsButton = screen.getAllByRole('button', { name: 'More options' })[0];
            await userEvent.click(moreOptionsButton);

            const shareButton = within(screen.getByRole('menu')).getByText('Share');
            expect(shareButton).toBeInTheDocument();
            await userEvent.click(shareButton);

            expect(screen.getByText('Shared Link:')).toBeInTheDocument();
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('https://example.com/share-link');
            expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
        });

        test('should not render share button when canShare is false', async () => {
            renderComponent({ canShare: false });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const moreOptionsButton = screen.getAllByRole('button', { name: 'More options' })[0];
            await userEvent.click(moreOptionsButton);

            expect(screen.queryByText('Share')).not.toBeInTheDocument();
        });
    });

    describe('Delete', () => {
        test('should delete item', async () => {
            const onDelete = jest.fn();
            renderComponent({ canCreateNewFolder: true, onDelete });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const moreOptionsButton = screen.getAllByRole('button', { name: 'More options' })[0];
            await userEvent.click(moreOptionsButton);
            const deleteButton = screen.getByText('Delete');
            expect(deleteButton).toBeInTheDocument();
            await userEvent.click(deleteButton);

            expect(
                screen.getByText('Are you sure you want to delete An Ordered Folder and all its contents?'),
            ).toBeInTheDocument();

            const deleteButtonConfirm = screen.getByRole('button', { name: 'Delete' });
            expect(deleteButtonConfirm).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

            await userEvent.click(deleteButtonConfirm);

            expect(onDelete).toHaveBeenCalledWith([
                { ...mockRootFolder.item_collection.entries[0], selected: true, thumbnailUrl: null },
            ]);
        });

        test('should not render delete button when canDelete is false', async () => {
            renderComponent({ canDelete: false });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const moreOptionsButton = screen.getAllByRole('button', { name: 'More options' })[0];
            await userEvent.click(moreOptionsButton);

            expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        });
    });

    describe('Download', () => {
        test('should download item', async () => {
            const onDownload = jest.fn();
            renderComponent({ canDownload: true, onDownload });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const moreOptionsButton = screen.getAllByRole('button', { name: 'More options' })[2];
            await userEvent.click(moreOptionsButton);

            const downloadButton = screen.getByText('Download');
            expect(downloadButton).toBeInTheDocument();
            await userEvent.click(downloadButton);

            expect(onDownload).toHaveBeenCalledWith([
                {
                    ...mockRootFolder.item_collection.entries[3],
                    selected: true,
                    thumbnailUrl:
                        'https://dl.boxcloud.com/api/2.0/internal_files/416044542013/versions/439751948413/representations/jpg_1024x1024/content/?access_token=token',
                },
            ]);
        });

        test('should not render download button when canDownload is false', async () => {
            renderComponent({ canDownload: false });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const moreOptionsButton = screen.getAllByRole('button', { name: 'More options' })[3];
            await userEvent.click(moreOptionsButton);

            expect(screen.queryByText('Download')).not.toBeInTheDocument();
        });
    });

    describe('Metadata View', () => {
        test('should render metadata view', async () => {
            const templateName = 'templateName';
            const metadataSource = `enterprise_0.${templateName}`;
            const metadataSourceFieldName = `metadata.${metadataSource}`;
            const metadataQuery = {
                from: metadataSource,
                ancestor_folder_id: 0,
                fields: [`${metadataSourceFieldName}.industry`, `${metadataSourceFieldName}.last_contacted_at`],
            };
            const fieldsToShow = [
                { key: `${metadataSourceFieldName}.industry`, canEdit: false, displayName: 'Industry Alias' },
                { key: `${metadataSourceFieldName}.last_contacted_at`, canEdit: true },
            ];

            renderComponent({
                metadataQuery,
                fieldsToShow,
                defaultView: 'metadata',
            });
            // two separate promises need to be resolved before the component is ready
            await waitFor(() => {
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
            });

            expect(screen.getByText('Name')).toBeInTheDocument();
            expect(screen.getByText('Industry Alias')).toBeInTheDocument();
            expect(screen.getByText('Last Contacted At')).toBeInTheDocument();
            expect(screen.getByText('File1')).toBeInTheDocument();
            expect(screen.getByText('File2')).toBeInTheDocument();
            expect(screen.getByText('Technology')).toBeInTheDocument();
            expect(screen.getByText('November 16, 2023')).toBeInTheDocument();
            expect(screen.getByText('Healthcare')).toBeInTheDocument();
            expect(screen.getByText('November 1, 2023')).toBeInTheDocument();
        });
    });

    describe('Preview', () => {
        test('should render preview', async () => {
            const onPreview = jest.fn();
            renderComponent({ onPreview });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });
            const firstRow = screen.getByRole('row', { name: 'An Ordered Folder' });
            expect(firstRow).toBeInTheDocument();
            await userEvent.click(firstRow);

            const textFile = screen.getByRole('row', { name: 'XSS.txt' });
            expect(textFile).toBeInTheDocument();
            await userEvent.click(textFile);

            expect(onPreview).toHaveBeenCalled();
        });
    });

    // describe('Search', () => {
    //     test('should search', async () => {});
    // });

    describe('OnKeyDown', () => {
        test('should focus search input on "/" key press', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('/');

            expect(screen.getByRole('searchbox')).toHaveFocus();
        });

        test('should focus search input on "arrowdown" key press', async () => {
            renderComponent();
            const contentExplorer = screen.getByTestId('content-explorer');
            await waitFor(() => {
                expect(contentExplorer).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });
            await userEvent.click(screen.getByRole('button', { name: 'Switch to List View' }));
            contentExplorer.focus();
            await userEvent.keyboard('[ArrowDown]');
            // row 0 is the header row
            expect(screen.getAllByRole('row')[1]).toHaveFocus();
        });

        test('should focus search input on "b" key press', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gb');

            expect(
                screen.getByRole('button', {
                    name: 'Preview Test Folder',
                }),
            ).toHaveFocus();
        });

        test('should focus search input on "u" key press', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gu');

            expect(screen.getByLabelText('Upload')).toHaveFocus();
        });

        test('should show recents on "r" key press with global modifier', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gr');

            expect(screen.getByText('Recents')).toBeInTheDocument();
        });

        test('should open create folder dialog on "n" key press with global modifier', async () => {
            renderComponent({ canCreateNewFolder: true });

            await waitFor(() => {
                expect(screen.getByTestId('content-explorer')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gn');

            expect(screen.getByText('Please enter a name.')).toBeInTheDocument();
        });
    });
});
