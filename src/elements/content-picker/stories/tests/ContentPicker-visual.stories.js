import React from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';
import ContentPicker from '../../ContentPicker';
import { mockRootFolder, mockEmptyRootFolder } from '../../../common/__mocks__/mockRootFolder';

import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {};

export const Modernization = {
    args: {
        enableModernizedComponents: true,
    },
};

export const withPagination = {
    args: {
        initialPageSize: 1,
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
};

export const singleSelect = {
    args: {
        maxSelectable: 1,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            expect(canvas.getByText('An Ordered Folder')).toBeInTheDocument();
        });

        const rows = canvas.getAllByRole('row');
        await userEvent.click(rows[3]);
        await waitFor(() => {
            expect(canvas.getByRole('button', { name: 'Choose' })).not.toBeDisabled();
        });
    },
};

export const multipleSelect = {
    args: {
        maxSelectable: 3,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            expect(canvas.getByText('An Ordered Folder')).toBeInTheDocument();
        });

        const rows = canvas.getAllByRole('row');
        await userEvent.click(rows[3]);
        await userEvent.click(rows[4]);

        await waitFor(() => {
            expect(canvas.getByText('2 Selected')).toBeInTheDocument();
        });
    },
};

export const fileTypeFilter = {
    args: {
        extensions: ['doc', 'docx'],
    },
};

export const emptyState = {
    args: {
        rootFolderId: '74729718131',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            expect(canvas.getByText('There are no items in this folder.')).toBeInTheDocument();
        });
    },
};

export const errorEmptyState = {
    args: {
        rootFolderId: '191354690948',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            expect(canvas.getByText('A network error has occurred while trying to load.')).toBeInTheDocument();
        });
    },
};

export const searchEmptyState = {
    args: {
        rootFolderId: '74729718131',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const searchBar = canvas.getByRole('searchbox', { name: 'Search files and folders' });
        await userEvent.type(searchBar, 'foo');

        expect(canvas.getByText("Sorry, we couldn't find what you're looking for.")).toBeInTheDocument();
    },
};

export const customActionButtons = {
    args: {
        renderCustomActionButtons: ({ selectedCount }) => (
            <button type="button">Custom Action ({selectedCount} items)</button>
        ),
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
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/74729718131`, () => {
                    return HttpResponse.json(mockEmptyRootFolder);
                }),
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/191354690948`, () => {
                    return new HttpResponse('Internal Server Error', { status: 500 });
                }),
            ],
        },
    },
};
