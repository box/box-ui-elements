import { expect, userEvent, waitFor, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import ContentPicker from '../../ContentPicker';
import { mockRootFolder, mockEmptyRootFolder } from '../../../content-explorer/stories/__mocks__/mockRootFolder';
import { SLEEP_TIMEOUT } from '../../../../utils/storybook';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Verify default state with aria-labels
        expect(canvas.getByLabelText('Choose')).toBeInTheDocument();
        expect(canvas.getByLabelText('Cancel')).toBeInTheDocument();
    },
};

export const selectedEmptyState = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            expect(canvas.getByText('An Ordered Folder')).toBeInTheDocument();
        });

        const selectedButton = canvas.getByRole('button', { name: '0 Selected' });
        await userEvent.click(selectedButton);
        await waitFor(() => {
            expect(canvas.getByText("You haven't selected any items yet.")).toBeInTheDocument();
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

        await waitFor(
            () => {
                // Verify empty folder state using partial match
                expect(canvas.getByText(/no items/i)).toBeInTheDocument();
            },
            {
                timeout: SLEEP_TIMEOUT * 3, // Increase timeout to allow for retries
            },
        );
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
        const chooseButton = canvas.getByLabelText('Choose');
        await userEvent.click(chooseButton);
        expect(chooseButton).toBeDisabled();
    },
};

export const withError = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(
            () => {
                // Verify error state is displayed - check for exact error message
                expect(canvas.getByText('A network error has occurred while trying to load.')).toBeInTheDocument();
            },
            {
                timeout: SLEEP_TIMEOUT * 3, // Increase timeout to allow for retries
            },
        );
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.error();
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

        // Wait for items to load and verify initial state
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1); // Header row + at least one item

                // Verify initial state
                const initialSelectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(initialSelectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        const items = canvas.getAllByRole('row');
        await userEvent.click(items[1]); // Select first item after header

        // Wait for and verify selection count
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Select second item to hit limit
        await userEvent.click(items[2]); // Select second item
        await waitFor(() => {
            const selectedButton = canvas.getByRole('button', { name: /2 Selected/i });
            expect(selectedButton).toBeInTheDocument();
            expect(canvas.getByText('(max)')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Try to select beyond limit
        if (items.length > 3) {
            await userEvent.click(items[3]); // Try to select third item
            await waitFor(() => {
                expect(canvas.getByText('2 Selected')).toBeInTheDocument();
                expect(canvas.getByText('(max)')).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
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

        // Wait for items to load and verify initial state
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1); // Header row + at least one item

                // Verify initial state
                const initialSelectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(initialSelectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        const items = canvas.getAllByRole('row');
        await userEvent.click(items[1]); // Select first item after header

        // Wait for and verify selection count
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Click cancel button to unselect items
        const cancelButton = canvas.getByLabelText('Cancel');
        await userEvent.click(cancelButton);

        // Verify item is unselected
        await waitFor(
            () => {
                const unselectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(unselectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );
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

        // Wait for items to load and verify initial state
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1); // Header row + at least one item

                // Verify initial state
                const initialSelectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(initialSelectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        const items = canvas.getAllByRole('row');

        // Select first item
        await userEvent.click(items[1]); // Select first item after header
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Select second item (should replace previous selection)
        if (items.length > 2) {
            await userEvent.click(items[2]);
            await waitFor(
                () => {
                    const selectedButton = canvas.getByRole('button', {
                        name: text => text.includes('1') && text.includes('Selected'),
                    });
                    expect(selectedButton).toBeInTheDocument();
                    const chooseButton = canvas.getByLabelText('Choose');
                    expect(chooseButton).toBeEnabled();
                },
                { timeout: SLEEP_TIMEOUT * 2 },
            );
        }

        // Select third item (should replace previous selection)
        if (items.length > 3) {
            await userEvent.click(items[3]);
            await waitFor(
                () => {
                    const selectedButton = canvas.getByRole('button', {
                        name: text => text.includes('1') && text.includes('Selected'),
                    });
                    expect(selectedButton).toBeInTheDocument();
                    const chooseButton = canvas.getByLabelText('Choose');
                    expect(chooseButton).toBeEnabled();
                },
                { timeout: SLEEP_TIMEOUT * 2 },
            );
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

        // Wait for items to load and verify initial state
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1);

                // Verify initial state
                const initialSelectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(initialSelectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        const items = canvas.getAllByRole('row');

        // Select first item
        await userEvent.click(items[1]);
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Test g+c shortcut for choose
        await userEvent.keyboard('g');
        await userEvent.keyboard('c');
        await waitFor(
            () => {
                const unselectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(unselectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        // Select multiple items
        await userEvent.click(items[1]);
        await userEvent.click(items[2]);
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('2') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Test g+x shortcut for cancel
        await userEvent.keyboard('g');
        await userEvent.keyboard('x');
        await waitFor(
            () => {
                const unselectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(unselectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );
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

        // Wait for items to load and verify initial state
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1);

                // Verify initial state
                const initialSelectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(initialSelectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();

                // Verify share access column is visible
                const shareColumn = canvas.getByRole('columnheader', { name: /Share/ });
                expect(shareColumn).toBeInTheDocument();
                expect(shareColumn).toBeVisible();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        const items = canvas.getAllByRole('row');

        // Select first item
        await userEvent.click(items[1]);
        await waitFor(
            () => {
                // Verify selection state
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();

                // Verify share access column remains visible after selection
                const shareColumn = canvas.getByRole('columnheader', { name: /Share/ });
                expect(shareColumn).toBeInTheDocument();
                expect(shareColumn).toBeVisible();

                // Verify share access cell is present for selected item
                const shareCell = items[1].querySelector('[data-testid="share-access-cell"]');
                expect(shareCell).toBeInTheDocument();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );
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

        // Wait for items to load and verify initial state
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1);

                // Verify initial state
                const initialSelectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(initialSelectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        const items = canvas.getAllByRole('row');

        // Focus and select first item
        await userEvent.click(items[1]);
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Use arrow down to navigate and space to select second item
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard(' ');
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('2') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Navigate to third item and select to hit max
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard(' ');
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('3') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                expect(canvas.getByText('(max)')).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );
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

        // Wait for items to load and verify initial state
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1);

                // Verify initial state
                const initialSelectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(initialSelectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        const items = canvas.getAllByRole('row');

        // Select first item
        await userEvent.click(items[1]);
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Navigate into folder (assuming second item is a folder)
        await userEvent.dblClick(items[2]);

        // Wait for subfolder content to load and verify navigation
        await waitFor(
            () => {
                expect(canvas.getByText('Subfolder')).toBeInTheDocument();
                // Verify selection is maintained during navigation
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Navigate back using breadcrumb
        const breadcrumbLink = canvas.getByText('All Files');
        await userEvent.click(breadcrumbLink);

        // Verify selection is maintained after returning to root
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
                // Verify we're back in root folder
                expect(canvas.getByText('All Files')).toBeInTheDocument();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );
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

        // Wait for items to load and verify initial state
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1);

                // Verify initial state
                const initialSelectedButton = canvas.getByRole('button', {
                    name: text => text.includes('0') && text.includes('Selected'),
                });
                expect(initialSelectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeDisabled();
            },
            { timeout: SLEEP_TIMEOUT },
        );

        // Press / to focus search
        await userEvent.keyboard('/');

        // Type search query
        const searchInput = canvas.getByRole('textbox');
        await userEvent.type(searchInput, 'test');

        // Wait for search results
        await waitFor(
            () => {
                const items = canvas.getAllByRole('row');
                expect(items.length).toBeGreaterThan(1);
                // Verify search results are displayed
                expect(canvas.getByText(/Search Results/i)).toBeInTheDocument();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        const items = canvas.getAllByRole('row');

        // Select first search result
        await userEvent.click(items[1]);
        await waitFor(
            () => {
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );

        // Clear search to verify selection persists
        await userEvent.clear(searchInput);
        await waitFor(
            () => {
                // Verify selection is maintained after search is cleared
                const selectedButton = canvas.getByRole('button', {
                    name: text => text.includes('1') && text.includes('Selected'),
                });
                expect(selectedButton).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            },
            { timeout: SLEEP_TIMEOUT * 2 },
        );
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
