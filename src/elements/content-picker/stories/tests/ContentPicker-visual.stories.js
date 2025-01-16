import { expect, userEvent, waitFor, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import ContentPicker from '../../ContentPicker';
import { mockRootFolder } from '../../../content-explorer/stories/__mocks__/mockRootFolder';
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
                // Verify empty folder state
                expect(canvas.getByText('This folder is empty')).toBeInTheDocument();
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
                // Verify error state is displayed
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

        // Wait for items to load and select first item
        await waitFor(() => {
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1); // Header row + at least one item
        });

        const items = canvas.getAllByRole('row');
        await userEvent.click(items[1]); // Select first item after header

        await waitFor(() => {
            expect(canvas.getByText('1 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select second item to hit limit
        await userEvent.click(items[2]); // Select second item
        await waitFor(() => {
            expect(canvas.getByText('2 Selected')).toBeInTheDocument();
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

        // Wait for items to load
        await waitFor(() => {
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1); // Header row + at least one item
        });

        const items = canvas.getAllByRole('row');
        await userEvent.click(items[1]); // Select first item after header

        await waitFor(() => {
            expect(canvas.getByText('1 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Click cancel button to unselect items
        const cancelButton = canvas.getByLabelText('Cancel');
        await userEvent.click(cancelButton);

        // Verify item is unselected
        await waitFor(() => {
            expect(canvas.queryByText('1 Selected')).not.toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeDisabled();
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

        // Wait for items to load
        await waitFor(() => {
            const items = canvas.getAllByRole('row');
            expect(items.length).toBeGreaterThan(1); // Header row + at least one item
        });

        const items = canvas.getAllByRole('row');

        // Select first item
        await userEvent.click(items[1]); // Select first item after header
        await waitFor(() => {
            expect(canvas.getByText('1 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select second item (should replace previous selection)
        if (items.length > 2) {
            await userEvent.click(items[2]);
            await waitFor(() => {
                expect(canvas.getByText('1 Selected')).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            });
        }

        // Select third item (should replace previous selection)
        if (items.length > 3) {
            await userEvent.click(items[3]);
            await waitFor(() => {
                expect(canvas.getByText('1 Selected')).toBeInTheDocument();
                const chooseButton = canvas.getByLabelText('Choose');
                expect(chooseButton).toBeEnabled();
            });
        }
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
