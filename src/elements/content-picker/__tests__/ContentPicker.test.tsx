import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../test-utils/testing-library';
import { ContentPickerComponent as ContentPicker } from '../ContentPicker';
import { mockRecentItems, mockRootFolder } from '../../common/__mocks__/mockRootFolder';

jest.mock('../../../utils/Xhr', () => {
    return jest.fn().mockImplementation(() => {
        return {
            get: jest.fn(({ url }) => {
                switch (url) {
                    case 'https://api.box.com/2.0/folders/69083462919':
                        return Promise.resolve({ data: mockRootFolder });
                    case 'https://api.box.com/2.0/recent_items':
                        return Promise.resolve({ data: mockRecentItems });
                    default:
                        return Promise.reject(new Error('Not Found'));
                }
            }),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
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

describe('elements/content-picker/ContentPicker', () => {
    let rootElement: HTMLDivElement;

    const renderComponent = (props = {}) => {
        return render(<ContentPicker defaultView="list" rootFolderId="69083462919" token="token" {...props} />);
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
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            expect(screen.getByRole('button', { name: 'Preview Test Folder' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
            expect(screen.getByRole('searchbox')).toBeInTheDocument();
            expect(screen.getByText('An Ordered Folder')).toBeInTheDocument();
            expect(screen.getByText('Modified Tue Apr 16 2019 by Preview')).toBeInTheDocument();
            expect(screen.getByText('191.33 MB')).toBeInTheDocument();
        });
    });

    describe('Upload', () => {
        test('should open upload dialog when clicking upload button', async () => {
            renderComponent({ canUpload: true });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
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
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: 'Add' });
            await userEvent.click(addButton);

            expect(screen.queryByText('Upload')).not.toBeInTheDocument();
        });
    });

    describe('Item Selection', () => {
        test('should select and choose items', async () => {
            const onChoose = jest.fn();
            renderComponent({ onChoose });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
            });

            const itemRow = screen.getByRole('row', {
                name: 'PDF File Book Sample.pdf Modified Wed Dec 7 2022 by Preview 141.09 KB Book Sample.pdf',
            });
            await userEvent.click(itemRow);

            const chooseButton = screen.getByRole('button', { name: 'Choose' });
            await userEvent.click(chooseButton);

            expect(onChoose).toHaveBeenCalledWith([
                expect.objectContaining({
                    name: 'Book Sample.pdf',
                }),
            ]);
        });

        test('should respect maxSelectable limit', async () => {
            const onChoose = jest.fn();
            renderComponent({ maxSelectable: 2, onChoose });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
            });

            const firstItemRow = screen.getByRole('row', {
                name: 'PDF File Book Sample.pdf Modified Wed Dec 7 2022 by Preview 141.09 KB Book Sample.pdf',
            });

            await userEvent.click(firstItemRow);

            const secondItemRow = screen.getByRole('row', {
                name: 'PDF File Document (PDF).pdf Modified Sat Dec 17 2022 by Preview 774.11 KB Document (PDF).pdf',
            });
            await userEvent.click(secondItemRow);

            const thirdItemRow = screen.getByRole('row', {
                name: 'PPTX File Document (Powerpoint).pptx Modified Mon Mar 4 2019 by Preview 56.59 KB',
            });
            await userEvent.click(thirdItemRow);

            const chooseButton = screen.getByRole('button', { name: 'Choose' });
            await userEvent.click(chooseButton);

            expect(onChoose).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: 'Book Sample.pdf',
                    }),
                    expect.objectContaining({
                        name: 'Document (PDF).pdf',
                    }),
                ]),
            );
        });
    });

    describe('Search', () => {
        test('should update search query when typing in search input', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
            });

            const searchInput = screen.getByRole('searchbox');
            await userEvent.type(searchInput, 'test');

            expect(searchInput).toHaveValue('test');
        });
    });

    describe('Cancel', () => {
        test('should call onCancel when clicking cancel button', async () => {
            const onCancel = jest.fn();
            renderComponent({ onCancel });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
            });

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await userEvent.click(cancelButton);

            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe('Create Folder', () => {
        test('should open create folder dialog when clicking new folder button', async () => {
            renderComponent({ canCreateNewFolder: true });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: 'Add' });
            await userEvent.click(addButton);

            const newFolderButton = screen.getByText('New Folder');
            await userEvent.click(newFolderButton);

            expect(screen.getByText('Please enter a name.')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });

        test('should not render new folder button when canCreateNewFolder is false', async () => {
            renderComponent({ canCreateNewFolder: false });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
            });

            const addButton = screen.getByRole('button', { name: 'Add' });
            await userEvent.click(addButton);

            expect(screen.queryByText('New Folder')).not.toBeInTheDocument();
        });
    });

    describe('Keyboard Navigation', () => {
        test('should focus search input on "/" key press', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('/');

            expect(screen.getByRole('searchbox')).toHaveFocus();
        });

        test('should choose items on "c" key press with global modifier', async () => {
            const onChoose = jest.fn();
            renderComponent({ onChoose });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gc');

            expect(onChoose).toHaveBeenCalled();
        });

        test('should cancel on "x" key press with global modifier', async () => {
            const onCancel = jest.fn();
            renderComponent({ onCancel });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gx');

            expect(onCancel).toHaveBeenCalled();
        });

        test('should show selected items on "s" key press with global modifier', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gs');

            expect(screen.getByText('Selected Items')).toBeInTheDocument();
        });

        test('should open upload dialog on "u" key press with global modifier', async () => {
            renderComponent({ canUpload: true });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gu');

            expect(screen.getByLabelText('Upload')).toHaveFocus();
        });

        test('should show recents on "r" key press with global modifier', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gr');

            expect(screen.getByText('Recents')).toBeInTheDocument();
        });

        test('should open create folder dialog on "n" key press with global modifier', async () => {
            renderComponent({ canCreateNewFolder: true });

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            await userEvent.tab();
            await userEvent.keyboard('gn');

            expect(screen.getByText('Please enter a name.')).toBeInTheDocument();
        });

        test('should navigate through items with arrow keys', async () => {
            renderComponent();

            await waitFor(() => {
                expect(screen.getByTestId('content-picker')).toBeInTheDocument();
                expect(screen.getByText('Please wait while the items load...')).toBeInTheDocument();
            });

            const contentPicker = screen.getByTestId('content-picker');
            contentPicker.focus();

            await userEvent.tab();
            await userEvent.keyboard('[ArrowDown]');
            expect(screen.getAllByRole('row')[0]).toHaveFocus();

            await userEvent.keyboard('[ArrowDown]');
            expect(screen.getAllByRole('row')[1]).toHaveFocus();

            await userEvent.keyboard('[ArrowUp]');
            expect(screen.getAllByRole('row')[0]).toHaveFocus();
        });
    });
});
