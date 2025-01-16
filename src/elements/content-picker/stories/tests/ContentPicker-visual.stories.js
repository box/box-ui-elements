import { expect, userEvent, waitFor, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import ContentPicker from '../../ContentPicker';
// Import mockRootFolder - used for testing empty states and error scenarios
import { mockRootFolder } from '../../../content-explorer/stories/__mocks__/mockRootFolder';
import { SLEEP_TIMEOUT } from '../../../../utils/storybook';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        // Basic checks for default state using aria-labels
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
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/*`, () => {
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
                timeout: SLEEP_TIMEOUT,
            },
        );
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/*`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
    },
};

export const emptySelectionMode = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Click to enter selection mode
        const chooseButton = canvas.getByLabelText('Choose');
        await userEvent.click(chooseButton);

        await waitFor(
            () => {
                // Verify empty folder state in selection mode
                expect(canvas.getByText('This folder is empty')).toBeInTheDocument();
                expect(chooseButton).toBeDisabled();
            },
            {
                timeout: SLEEP_TIMEOUT,
            },
        );
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/*`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
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
                timeout: SLEEP_TIMEOUT,
            },
        );
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/*`, () => {
                    return HttpResponse.error();
                }),
            ],
        },
    },
};

export const hitSelectionLimit = {
    args: { maxSelectable: 2 },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for items to load
        await waitFor(() => {
            expect(canvas.getByText('Sample File.pdf')).toBeInTheDocument();
            expect(canvas.getByText('Sample Folder')).toBeInTheDocument();
            expect(canvas.getByText('Another File.docx')).toBeInTheDocument();
        });

        // Select first item
        const fileRow = canvas.getByRole('row', { name: /Sample File\.pdf/i });
        await userEvent.click(fileRow);
        await waitFor(() => {
            expect(canvas.getByText('1 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select second item to hit limit
        const folderRow = canvas.getByRole('row', { name: /Sample Folder/i });
        await userEvent.click(folderRow);
        await waitFor(() => {
            expect(canvas.getByText('2 Selected')).toBeInTheDocument();
            expect(canvas.getByText('(max)')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Try to select beyond limit
        const docRow = canvas.getByRole('row', { name: /Another File\.docx/i });
        await userEvent.click(docRow);

        // Verify selection hasn't changed and max indicator is shown
        await waitFor(() => {
            expect(canvas.getByText('2 Selected')).toBeInTheDocument();
            expect(canvas.getByText('(max)')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/*`, () => {
                    return HttpResponse.json({
                        id: '0',
                        name: 'Root',
                        permissions: {
                            can_upload: true,
                            can_rename: true,
                            can_delete: true,
                        },
                        path_collection: {
                            total_count: 0,
                            entries: [],
                        },
                        item_collection: {
                            total_count: 3,
                            entries: [
                                {
                                    id: '1',
                                    name: 'Doc 1.pdf',
                                    type: 'file',
                                    permissions: {
                                        can_rename: true,
                                        can_delete: true,
                                        can_share: true,
                                    },
                                },
                                {
                                    id: '2',
                                    name: 'Doc 2.pdf',
                                    type: 'file',
                                    permissions: {
                                        can_rename: true,
                                        can_delete: true,
                                        can_share: true,
                                    },
                                },
                                {
                                    id: '3',
                                    name: 'Doc 3.pdf',
                                    type: 'file',
                                    permissions: {
                                        can_rename: true,
                                        can_delete: true,
                                        can_share: true,
                                    },
                                },
                            ],
                        },
                    });
                }),
            ],
        },
    },
};

export const singleSelectWithItems = {
    args: {
        maxSelectable: 1,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for items to load
        await waitFor(() => {
            expect(canvas.getByText('Sample File.pdf')).toBeInTheDocument();
            expect(canvas.getByText('Sample Folder')).toBeInTheDocument();
            expect(canvas.getByText('Another File.docx')).toBeInTheDocument();
        });

        // Select first file
        const fileRow = canvas.getByRole('row', { name: /Sample File\.pdf/i });
        await userEvent.click(fileRow);
        await waitFor(() => {
            expect(canvas.getByText('1 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select another file (should replace previous selection)
        const docRow = canvas.getByRole('row', { name: /Another File\.docx/i });
        await userEvent.click(docRow);
        await waitFor(() => {
            expect(canvas.getByText('1 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select folder (should replace file selection)
        const folderRow = canvas.getByRole('row', { name: /Sample Folder/i });
        await userEvent.click(folderRow);
        await waitFor(() => {
            expect(canvas.getByText('1 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/*`, () => {
                    return HttpResponse.json({
                        id: '0',
                        name: 'Root',
                        type: 'folder',
                        size: 0,
                        parent: null,
                        path_collection: { total_count: 0, entries: [] },
                        item_collection: {
                            total_count: 3,
                            entries: [
                                {
                                    id: '1',
                                    name: 'Sample File.pdf',
                                    type: 'file',
                                    size: 1024,
                                    permissions: { can_delete: true, can_rename: true, can_share: true },
                                },
                                {
                                    id: '2',
                                    name: 'Sample Folder',
                                    type: 'folder',
                                    size: 0,
                                    permissions: { can_delete: true, can_rename: true, can_share: true },
                                },
                                {
                                    id: '3',
                                    name: 'Another File.docx',
                                    type: 'file',
                                    size: 2048,
                                    permissions: { can_delete: true, can_rename: true, can_share: true },
                                },
                            ],
                            offset: 0,
                            limit: 100,
                        },
                    });
                }),
            ],
        },
    },
};

export const multiSelectUpTo3 = {
    args: {
        maxSelectable: 3,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Wait for items to load
        await waitFor(() => {
            expect(canvas.getByText('Sample File.pdf')).toBeInTheDocument();
            expect(canvas.getByText('Sample Folder')).toBeInTheDocument();
            expect(canvas.getByText('Another File.docx')).toBeInTheDocument();
        });

        // Select first file
        const fileRow = canvas.getByRole('row', { name: /Sample File\.pdf/i });
        await userEvent.click(fileRow);
        await waitFor(() => {
            expect(canvas.getByText('1 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select second file
        const docRow = canvas.getByRole('row', { name: /Another File\.docx/i });
        await userEvent.click(docRow);
        await waitFor(() => {
            expect(canvas.getByText('2 Selected')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Select third item (folder)
        const folderRow = canvas.getByRole('row', { name: /Sample Folder/i });
        await userEvent.click(folderRow);
        await waitFor(() => {
            expect(canvas.getByText('3 Selected')).toBeInTheDocument();
            expect(canvas.getByText('(max)')).toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });

        // Verify deselection works
        await userEvent.click(fileRow);
        await waitFor(() => {
            expect(canvas.getByText('2 Selected')).toBeInTheDocument();
            expect(canvas.queryByText('(max)')).not.toBeInTheDocument();
            const chooseButton = canvas.getByLabelText('Choose');
            expect(chooseButton).toBeEnabled();
        });
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/*`, () => {
                    return HttpResponse.json({
                        id: '0',
                        name: 'Root',
                        type: 'folder',
                        size: 0,
                        parent: null,
                        path_collection: { total_count: 0, entries: [] },
                        item_collection: {
                            total_count: 3,
                            entries: [
                                {
                                    id: '1',
                                    name: 'Sample File.pdf',
                                    type: 'file',
                                    size: 1024,
                                    permissions: { can_delete: true, can_rename: true, can_share: true },
                                },
                                {
                                    id: '2',
                                    name: 'Sample Folder',
                                    type: 'folder',
                                    size: 0,
                                    permissions: { can_delete: true, can_rename: true, can_share: true },
                                },
                                {
                                    id: '3',
                                    name: 'Another File.docx',
                                    type: 'file',
                                    size: 2048,
                                    permissions: { can_delete: true, can_rename: true, can_share: true },
                                },
                            ],
                            offset: 0,
                            limit: 100,
                        },
                    });
                }),
            ],
        },
    },
};

export default {
    title: 'Elements/ContentPicker/tests/visual',
    component: ContentPicker,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
    parameters: {
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/*`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
            ],
        },
    },
};
