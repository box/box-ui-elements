import { expect, userEvent, waitFor, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import ContentPicker from '../../ContentPicker';
import { mockRootFolder, mockEmptyRootFolder } from '../../../content-explorer/stories/__mocks__/mockRootFolder';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for initial loading state and verify loading UI
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
            expect(canvas.queryByRole('row')).not.toBeInTheDocument(); // No items while loading
            const basicInitialChooseButton = canvas.getByLabelText('Choose');
            expect(basicInitialChooseButton).toBeDisabled(); // Choose button disabled during load
            expect(canvas.getByLabelText('Cancel')).toBeInTheDocument(); // Cancel always present
        });

        // Wait for items to load and verify complete UI state
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
            expect(canvas.getByText('All Files')).toBeInTheDocument(); // Verify breadcrumb
            expect(canvas.getByRole('grid')).toBeInTheDocument(); // Verify grid structure
            const basicLoadedChooseButton = canvas.getByLabelText('Choose');
            expect(basicLoadedChooseButton).toBeDisabled(); // Choose still disabled (no selection)
        });
    },
};

export const selectedEmptyState = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for initial loading state and verify loading UI
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
            expect(canvas.queryByRole('row')).not.toBeInTheDocument(); // No items while loading
            const emptyInitialChooseButton = canvas.getByLabelText('Choose');
            expect(emptyInitialChooseButton).toBeDisabled(); // Choose button disabled during load
        });

        // Wait for folder content to load
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
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
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
    },
};

export const emptyFolder = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for initial loading state and verify loading UI
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
            expect(canvas.queryByRole('row')).not.toBeInTheDocument(); // No items while loading
            const emptyFolderInitialChooseButton = canvas.getByLabelText('Choose');
            expect(emptyFolderInitialChooseButton).toBeDisabled(); // Choose button disabled during load
            expect(canvas.getByLabelText('Cancel')).toBeInTheDocument(); // Cancel always present
        });

        // Wait for empty folder content to load and verify complete UI state
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            expect(canvas.getByText('This folder is empty')).toBeInTheDocument();
            expect(canvas.queryByRole('row')).not.toBeInTheDocument(); // Still no items
            expect(canvas.getByRole('grid')).toBeInTheDocument(); // Grid structure exists but empty

            // Verify button states in empty folder
            const emptyFolderLoadedChooseButton = canvas.getByLabelText('Choose');
            expect(emptyFolderLoadedChooseButton).toBeDisabled();
            expect(canvas.getByLabelText('Cancel')).toBeInTheDocument();

            // Verify selection state
            const selectedButton = canvas.getByRole('button', { name: '0 Selected' });
            expect(selectedButton).toBeInTheDocument();
        });
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockEmptyRootFolder);
                }),
            ],
        },
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
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for initial loading state
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for error state to be displayed after loading fails (allowing time for retries)
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            expect(canvas.getByText('A network error has occurred while trying to load.')).toBeInTheDocument();
            // Verify error state UI elements
            const errorChooseButton = canvas.getByLabelText('Choose');
            const errorCancelButton = canvas.getByLabelText('Cancel');
            expect(errorChooseButton).toBeDisabled();
            expect(errorCancelButton).toBeEnabled();
        });
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json({}, { status: 500 });
                }),
            ],
        },
    },
};

export const hitSelectionLimit = {
    args: {
        maxSelectable: 2,
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for initial loading state
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for items to load and verify initial state
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1); // Header row + at least one item
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
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
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
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
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
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
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
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
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
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state and share column visibility
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();
        const shareInitialChooseButton = canvas.getByLabelText('Choose');
        expect(shareInitialChooseButton).toBeDisabled();

        // Wait for initial loading state
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for content to load and verify share access column
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            const shareColumn = canvas.getByRole('columnheader', { name: /Share/ });
            expect(shareColumn).toBeInTheDocument();
            expect(shareColumn).toBeVisible();
        });

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
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
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
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();
        const multiInitialChooseButton = canvas.getByLabelText('Choose');
        expect(multiInitialChooseButton).toBeDisabled();

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

        const items = canvas.getAllByRole('row');

        // Focus and select first item with visual feedback
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');

        // Verify first selection state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const multiFirstChooseButton = canvas.getByLabelText('Choose');
            expect(multiFirstChooseButton).toBeEnabled();
        });

        // Use arrow down to navigate and space to select second item
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard(' ');
        expect(items[2]).toHaveClass('bcp-item-row-selected');

        // Verify second selection state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('2') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const multiSecondChooseButton = canvas.getByLabelText('Choose');
            expect(multiSecondChooseButton).toBeEnabled();
        });

        // Navigate to third item and select to hit max
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard(' ');
        expect(items[3]).toHaveClass('bcp-item-row-selected');

        // Verify max selection state
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('3') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            expect(canvas.getByText('(max)')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Try to select beyond max (should not work)
        if (items.length > 4) {
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard(' ');
            expect(items[4]).not.toHaveClass('bcp-item-row-selected');
            expect(canvas.getByText('(max)')).toBeInTheDocument();
        }
    },
};

export const folderNavigationAndSelection = {
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
                // Mock subfolder response
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/123`, () => {
                    return HttpResponse.json({
                        ...mockRootFolder,
                        id: '123',
                        name: 'Subfolder',
                    });
                }),
            ],
        },
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
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();
        const navInitialChooseButton = canvas.getByLabelText('Choose');
        expect(navInitialChooseButton).toBeDisabled();

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
            const navFirstChooseButton = canvas.getByLabelText('Choose');
            expect(navFirstChooseButton).toBeEnabled();
        });

        // Navigate into folder (assuming second item is a folder)
        await userEvent.dblClick(items[2]);

        // Wait for loading state during navigation
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for subfolder content to load and verify navigation
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            expect(canvas.getByText('Subfolder')).toBeInTheDocument();
            // Verify folder structure is updated
            expect(canvas.getByRole('link', { name: /All Files/i })).toBeInTheDocument();
            expect(canvas.getByRole('link', { name: /Subfolder/i })).toBeInTheDocument();
        });

        // Verify selection is maintained during navigation
        await waitFor(() => {
            const selectedButtonAfterNav = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButtonAfterNav).toBeInTheDocument();
            const navSubfolderChooseButton = canvas.getByLabelText('Choose');
            expect(navSubfolderChooseButton).toBeEnabled();
        });

        // Navigate back using breadcrumb
        const breadcrumbLink = canvas.getByText('All Files');
        await userEvent.click(breadcrumbLink);

        // Wait for loading state during navigation back
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for root folder content to load
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            expect(canvas.getByText('All Files')).toBeInTheDocument();
            // Verify we're back in root folder
            expect(canvas.queryByRole('link', { name: /Subfolder/i })).not.toBeInTheDocument();
        });

        // Verify selection is maintained after returning to root
        await waitFor(() => {
            const selectedButtonAfterReturn = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButtonAfterReturn).toBeInTheDocument();
            const navReturnChooseButton = canvas.getByLabelText('Choose');
            expect(navReturnChooseButton).toBeEnabled();
            expect(items[1]).toHaveClass('bcp-item-row-selected');
        });
    },
};

export const searchFunctionality = {
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
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
            expect(items.length).toBeGreaterThan(1);
        });

        // Verify initial selection state
        const initialSelectedButton = canvas.getByRole('button', {
            name: text => text.includes('0') && text.includes('Selected'),
        });
        expect(initialSelectedButton).toBeInTheDocument();
        const searchInitialChooseButton = canvas.getByLabelText('Choose');
        expect(searchInitialChooseButton).toBeDisabled();

        // Press / to focus search
        await userEvent.keyboard('/');
        const searchInput = canvas.getByRole('textbox');
        expect(searchInput).toHaveFocus();

        // Type search query
        await userEvent.type(searchInput, 'test');

        // Wait for loading state during search
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for search results and verify search UI
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1);
            expect(canvas.getByText(/Search Results/i)).toBeInTheDocument();
            // Verify search mode indicators
            expect(canvas.getByRole('button', { name: /Clear Search/i })).toBeInTheDocument();
            expect(canvas.getByPlaceholderText(/Search/i)).toHaveValue('test');
        });

        const items = canvas.getAllByRole('row');

        // Select first search result and verify visual feedback
        await userEvent.click(items[1]);
        expect(items[1]).toHaveClass('bcp-item-row-selected');

        // Verify selection state in search results
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButton).toBeInTheDocument();
            const searchResultChooseButton = canvas.getByLabelText('Choose');
            expect(searchResultChooseButton).toBeEnabled();
        });

        // Clear search
        await userEvent.clear(searchInput);

        // Wait for loading state during return to folder view
        await waitFor(() => {
            expect(canvas.getByRole('progressbar')).toBeInTheDocument();
        });

        // Wait for folder content to load and verify search UI is cleared
        await waitFor(() => {
            expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
            expect(canvas.queryByText(/Search Results/i)).not.toBeInTheDocument();
            expect(canvas.queryByRole('button', { name: /Clear Search/i })).not.toBeInTheDocument();
            expect(canvas.getByPlaceholderText(/Search/i)).toHaveValue('');
        });

        // Verify selection is maintained after search is cleared
        await waitFor(() => {
            const selectedButtonAfterSearch = canvas.getByRole('button', {
                name: text => text.includes('1') && text.includes('Selected'),
            });
            expect(selectedButtonAfterSearch).toBeInTheDocument();
            const searchClearedChooseButton = canvas.getByLabelText('Choose');
            expect(searchClearedChooseButton).toBeEnabled();
        });
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
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
    },
};
