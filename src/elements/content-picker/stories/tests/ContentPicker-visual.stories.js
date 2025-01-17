// @flow
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import ContentPicker from '../../ContentPicker';
import { mockRootFolder, mockEmptyRootFolder } from '../../../content-explorer/stories/__mocks__/mockRootFolder';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Verify initial UI state
        const basicInitialChooseButton = canvas.getByLabelText('Choose');
        expect(basicInitialChooseButton).toBeDisabled();
        expect(canvas.getByLabelText('Cancel')).toBeInTheDocument();

        // Wait for content to load and verify complete UI state
        await waitFor(() => {
            expect(canvas.getByText('All Files')).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
            expect(canvas.getByRole('grid')).toBeInTheDocument();
            const basicLoadedChooseButton = canvas.getByLabelText('Choose');
            expect(basicLoadedChooseButton).toBeDisabled();
        });
    },
};

export const selectedEmptyState = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Verify initial UI state
        const emptyInitialChooseButton = canvas.getByLabelText('Choose');
        expect(emptyInitialChooseButton).toBeDisabled();

        // Wait for folder content to load
        await waitFor(() => {
            expect(canvas.getByText('An Ordered Folder')).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state
        const selectedButton = canvas.getByRole('button', { name: '0 Selected' });
        expect(selectedButton).toBeInTheDocument();
        const emptyFolderChooseButton = canvas.getByLabelText('Choose');
        expect(emptyFolderChooseButton).toBeDisabled();

        // Click selected button to view empty selection state
        await userEvent.click(selectedButton);

        // Verify transition to selected view
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument(); // No loading in selected view
            expect(canvas.getByText("You haven't selected any items yet.")).toBeInTheDocument();
            expect(canvas.queryByRole('row')).not.toBeInTheDocument(); // No items in empty selection
            const emptySelectedChooseButton = canvas.getByLabelText('Choose');
            expect(emptySelectedChooseButton).toBeDisabled();
        });
    },
};

export const emptyFolder = {
    args: {
        rootFolderId: '74729718131',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            expect(canvas.getByText('There are no items in this folder.')).toBeInTheDocument();
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    },
};

export const emptySelectionMode = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const emptyModeChooseButton = canvas.getByLabelText('Choose');
        await userEvent.click(emptyModeChooseButton);
        expect(emptyModeChooseButton).toBeDisabled();
    },
};

export const withError = {
    args: {
        rootFolderId: '191354690948',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            expect(canvas.getByText('A network error has occurred while trying to load.')).toBeInTheDocument();
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    },
};

export const hitSelectionLimit = {
    args: {
        maxSelectable: 2,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for items to load and verify initial state
        await waitFor(() => {
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1); // Header row + at least one item
        });

        // Navigate into "An Ordered Folder"
        const orderedFolder = await canvas.findByText('An Ordered Folder');
        await userEvent.dblClick(orderedFolder);

        // Wait for folder contents to load
        await waitFor(() => {
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();
        const hitLimitInitialChooseButton = canvas.getByLabelText('Choose');
        expect(hitLimitInitialChooseButton).toBeDisabled();

        const items = canvas.getAllByRole('row');

        // Select first item and verify visual feedback
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');

        // Verify selection count and button state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const hitLimitFirstSelectionChooseButton = canvas.getByLabelText('Choose');
            expect(hitLimitFirstSelectionChooseButton).toBeEnabled();
        });

        // Select second item to hit limit
        await userEvent.click(items[2]);
        expect(items[2]).toHaveClass('bcp-item-row-selected');

        // Verify max selection state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', { name: /2 Selected/i });
            expect(selectedButton).toBeInTheDocument();
            expect(canvas.getByText('(max)')).toBeInTheDocument();
            const hitLimitMaxChooseButton = canvas.getByLabelText('Choose');
            expect(hitLimitMaxChooseButton).toBeEnabled();
        });

        // Try to select beyond limit
        if (items.length > 3) {
            await userEvent.click(items[3]);

            // Verify selection remains at max
            await waitFor(() => {
                expect(canvas.getByText('2 Selected')).toBeInTheDocument();
                expect(canvas.getByText('(max)')).toBeInTheDocument();
                const hitLimitBeyondMaxChooseButton = canvas.getByLabelText('Choose');
                expect(hitLimitBeyondMaxChooseButton).toBeEnabled();
                expect(items[3]).not.toHaveClass('bcp-item-row-selected');
            });
        }
    },
};

export const cancelUnselectsItems = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for initial loading state
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for items to load
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1); // Header row + at least one item
        });

        // Navigate into "An Ordered Folder"
        const orderedFolder = await canvas.findByText('An Ordered Folder');
        await userEvent.dblClick(orderedFolder);

        // Wait for folder contents to load
        await waitFor(() => {
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();
        const cancelInitialChooseButton = canvas.getByLabelText('Choose');
        expect(cancelInitialChooseButton).toBeDisabled();

        const items = canvas.getAllByRole('row');

        // Select first item and verify visual feedback
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');

        // Verify selection state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const cancelSelectedChooseButton = canvas.getByLabelText('Choose');
            expect(cancelSelectedChooseButton).toBeEnabled();
        });

        // Click cancel button to unselect items
        const cancelButton = canvas.getByLabelText('Cancel');
        await userEvent.click(cancelButton);

        // Verify item is unselected
        await waitFor(() => {
            expect(items[1]).not.toHaveClass('bcp-item-row-selected');
            const unselectedButton = canvas.getByRole('button', {
                name: text => text.includes('0') && text.includes('Selected'),
            });
            expect(unselectedButton).toBeInTheDocument();
            const cancelUnselectedChooseButton = canvas.getByLabelText('Choose');
            expect(cancelUnselectedChooseButton).toBeDisabled();
        });
    },
};

export const singleSelectWithItems = {
    args: {
        maxSelectable: 1,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for initial loading state
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for items to load
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1); // Header row + at least one item
        });

        // Navigate into "An Ordered Folder"
        const orderedFolder = await canvas.findByText('An Ordered Folder');
        await userEvent.dblClick(orderedFolder);

        // Wait for folder contents to load
        await waitFor(() => {
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();
        const singleInitialChooseButton = canvas.getByLabelText('Choose');
        expect(singleInitialChooseButton).toBeDisabled();

        const items = canvas.getAllByRole('row');

        // Select first item and verify visual feedback
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');

        // Verify selection state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const singleFirstChooseButton = canvas.getByLabelText('Choose');
            expect(singleFirstChooseButton).toBeEnabled();
        });

        // Select second item (should replace previous selection)
        if (items.length > 2) {
            await userEvent.click(items[2]);

            // Verify first item is unselected and second item is selected
            await waitFor(() => {
                expect(items[1]).not.toHaveClass('bcp-item-row-selected');
                expect(items[2]).toHaveClass('bcp-item-row-selected');
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const singleSecondChooseButton = canvas.getByLabelText('Choose');
                expect(singleSecondChooseButton).toBeEnabled();
            });
        }

        // Select third item (should replace previous selection)
        if (items.length > 3) {
            await userEvent.click(items[3]);

            // Verify second item is unselected and third item is selected
            await waitFor(() => {
                expect(items[2]).not.toHaveClass('bcp-item-row-selected');
                expect(items[3]).toHaveClass('bcp-item-row-selected');
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const singleThirdChooseButton = canvas.getByLabelText('Choose');
                expect(singleThirdChooseButton).toBeEnabled();
            });
        }
    },
};

export const keyboardShortcuts = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for initial loading state
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for items to load
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        // Navigate into "An Ordered Folder"
        const orderedFolder = await canvas.findByText('An Ordered Folder');
        await userEvent.dblClick(orderedFolder);

        // Wait for folder contents to load
        await waitFor(() => {
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();
        const keyboardInitialChooseButton = canvas.getByLabelText('Choose');
        expect(keyboardInitialChooseButton).toBeDisabled();

        const items = canvas.getAllByRole('row');

        // Select first item and verify visual feedback
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');

        // Verify selection state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const keyboardSingleChooseButton = canvas.getByLabelText('Choose');
            expect(keyboardSingleChooseButton).toBeEnabled();
        });

        // Test g+c shortcut for choose
        await userEvent.keyboard('g');
        await userEvent.keyboard('c');

        // Verify item is unselected after choose shortcut
        await waitFor(() => {
            expect(items[1]).not.toHaveClass('bcp-item-row-selected');
            const unselectedButton = canvas.getByRole('button', {
                name: text => text.includes('0') && text.includes('Selected'),
            });
            expect(unselectedButton).toBeInTheDocument();
            const keyboardAfterChooseButton = canvas.getByLabelText('Choose');
            expect(keyboardAfterChooseButton).toBeDisabled();
        });

        // Select multiple items and verify visual feedback
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');
        await userEvent.click(items[2]);
        expect(items[2]).toHaveClass('bcp-item-row-selected');

        // Verify multiple selection state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('2') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const keyboardMultiChooseButton = canvas.getByLabelText('Choose');
            expect(keyboardMultiChooseButton).toBeEnabled();
        });

        // Test g+x shortcut for cancel
        await userEvent.keyboard('g');
        await userEvent.keyboard('x');

        // Verify all items are unselected after cancel shortcut
        await waitFor(() => {
            expect(items[1]).not.toHaveClass('bcp-item-row-selected');
            expect(items[2]).not.toHaveClass('bcp-item-row-selected');
            const unselectedButton = canvas.getByRole('button', {
                name: text => text.includes('0') && text.includes('Selected'),
            });
            expect(unselectedButton).toBeInTheDocument();
            const keyboardAfterCancelButton = canvas.getByLabelText('Choose');
            expect(keyboardAfterCancelButton).toBeDisabled();
        });
    },
};

export const shareAccess = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for content to load and verify initial state
        await waitFor(() => {
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
            const shareColumn = canvas.getByRole('columnheader', { name: /Share/ });
            expect(shareColumn).toBeInTheDocument();
            expect(shareColumn).toBeVisible();
        });

        // Navigate into "An Ordered Folder"
        const orderedFolder = await canvas.findByText('An Ordered Folder');
        await userEvent.dblClick(orderedFolder);

        // Wait for folder contents to load
        await waitFor(() => {
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
            const shareColumn = canvas.getByRole('columnheader', { name: /Share/ });
            expect(shareColumn).toBeInTheDocument();
            expect(shareColumn).toBeVisible();
        });

        // Verify initial selection state
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();

        const shareInitialChooseButton = canvas.getByLabelText('Choose');
        expect(shareInitialChooseButton).toBeDisabled();

        const items = canvas.getAllByRole('row');

        // Select first item and verify visual feedback
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');

        // Verify selection state and share access remains visible
        await waitFor(() => {
            // Verify selection state
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const shareSelectedChooseButton = canvas.getByLabelText('Choose');
            expect(shareSelectedChooseButton).toBeEnabled();

            // Verify share access UI persists after selection
            const shareColumnAfterSelection = canvas.getByRole('columnheader', { name: /Share/ });
            expect(shareColumnAfterSelection).toBeInTheDocument();
            expect(shareColumnAfterSelection).toBeVisible();
        });

        // Verify share access cell is present and visible for selected item
        const shareCell = items[1].querySelector('[data-testid="share-access-cell"]');
        expect(shareCell).toBeInTheDocument();
        expect(shareCell).toBeVisible();
    },
};

export const multiSelectWithKeyboard = {
    args: {
        maxSelectable: 3,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for items to load and verify initial state
        await waitFor(() => {
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
            expect(canvas.getByRole('button', { name: /0 Selected/i })).toBeInTheDocument();
            expect(canvas.getByLabelText('Choose')).toBeDisabled();
        });

        // Navigate into "An Ordered Folder"
        const orderedFolder = await canvas.findByText('An Ordered Folder');
        await userEvent.dblClick(orderedFolder);

        // Wait for folder contents to load
        await waitFor(() => {
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        // Select first item
        const firstItems = canvas.getAllByRole('row');
        await userEvent.click(firstItems[1]);

        // Verify first selection state
        await waitFor(() => {
            const selectedItems = canvas.getAllByRole('row');
            const row = selectedItems[1];
            expect(row).toHaveClass('bcp-item-row-selected');
            const selectedButton = canvas.getByRole('button', { name: /1 Selected/i });
            expect(selectedButton).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select second item with keyboard
        await userEvent.keyboard('{ArrowDown}');
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for selection update
        await userEvent.keyboard(' ');

        // Verify second selection state
        await waitFor(() => {
            const selectedItems = canvas.getAllByRole('row');
            const row = selectedItems[2];
            expect(row).toHaveClass('bcp-item-row-selected');
            const selectedButton = canvas.getByRole('button', { name: /2 Selected/i });
            expect(selectedButton).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select third item to hit max
        await userEvent.keyboard('{ArrowDown}');
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for selection update
        await userEvent.keyboard(' ');

        // Verify max selection state
        await waitFor(() => {
            const selectedItems = canvas.getAllByRole('row');
            const row = selectedItems[3];
            expect(row).toHaveClass('bcp-item-row-selected');
            const selectedButton = canvas.getByRole('button', { name: /3 Selected/i });
            expect(selectedButton).toBeInTheDocument();
            expect(canvas.getByText('(max)')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Verify cannot select beyond max
        if (items.length > 4) {
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard(' ');
            expect(items[4]).not.toHaveClass('bcp-item-row-selected');
            expect(canvas.getByText('(max)')).toBeInTheDocument();
        }
    },
};

export const folderNavigationAndSelection = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for items to load
        await waitFor(() => {
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        const items = canvas.getAllByRole('row');

        // Select first item
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');
        expect(canvas.getByRole('button', { name: /1 Selected/i })).toBeInTheDocument();
        expect(canvas.getByLabelText('Choose')).toBeEnabled();

        // Navigate into folder
        await userEvent.dblClick(items[2]);
        await waitFor(() => {
            expect(canvas.getByText('Subfolder')).toBeInTheDocument();
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
        });

        // Verify selection persists in subfolder
        expect(canvas.getByRole('button', { name: /1 Selected/i })).toBeInTheDocument();
        expect(canvas.getByLabelText('Choose')).toBeEnabled();

        // Navigate back to root
        await userEvent.click(canvas.getByText('All Files'));
        await waitFor(() => {
            expect(canvas.queryByRole('link', { name: /Subfolder/i })).not.toBeInTheDocument();
        });

        // Verify selection persists in root
        expect(canvas.getByRole('button', { name: /1 Selected/i })).toBeInTheDocument();
        expect(canvas.getByLabelText('Choose')).toBeEnabled();
        expect(items[1]).toHaveClass('bcp-item-row-selected');
    },
};

export const searchFunctionality = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for items to load
        await waitFor(() => {
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        // Navigate into "An Ordered Folder"
        const orderedFolder = await canvas.findByText('An Ordered Folder');
        await userEvent.dblClick(orderedFolder);

        // Wait for folder contents to load
        await waitFor(() => {
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
        });

        const items = canvas.getAllByRole('row');

        // Focus search and enter query
        await userEvent.keyboard('/');
        const searchInput = canvas.getByRole('textbox');
        await userEvent.type(searchInput, 'test');

        // Verify search results
        await waitFor(() => {
            expect(canvas.getByText(/Search Results/i)).toBeInTheDocument();
            expect(canvas.getByRole('button', { name: /Clear Search/i })).toBeInTheDocument();
        });

        // Select first search result
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');
        expect(canvas.getByRole('button', { name: /1 Selected/i })).toBeInTheDocument();
        expect(canvas.getByLabelText('Choose')).toBeEnabled();

        // Clear search
        await userEvent.clear(searchInput);

        // Verify return to folder view
        await waitFor(() => {
            expect(canvas.queryByText(/Search Results/i)).not.toBeInTheDocument();
            expect(canvas.getByPlaceholderText(/Search/i)).toHaveValue('');
        });

        // Verify selection persists
        expect(canvas.getByRole('button', { name: /1 Selected/i })).toBeInTheDocument();
        expect(canvas.getByLabelText('Choose')).toBeEnabled();
    },
};

export default {
    title: 'Elements/ContentPicker/tests/visual',
    component: ContentPicker,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: '69083462919',
        token: global.TOKEN,
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/74729718131`, () => {
                    return HttpResponse.json(mockEmptyRootFolder);
                }),
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/191354690948`, () => {
                    return new HttpResponse('Internal Server Error', { status: 500 });
                }),
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
    },
};
