import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';
import ContentExplorer from '../../ContentExplorer';
import { mockEmptyRootFolder, mockRootFolder } from '../../../common/__mocks__/mockRootFolder';
import mockSubfolder from '../../../common/__mocks__/mockSubfolder';
import mockRecentItems from '../../../common/__mocks__/mockRecentItems';
import { mockUserRequest } from '../../../common/__mocks__/mockRequests';

import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(async () => {
            const folder = await canvas.findByText('An Ordered Folder');
            expect(folder).toBeInTheDocument();
            expect(canvas.getByText('Apr 16, 2019 by Preview')).toBeInTheDocument();

            expect(canvas.getByText('Archive')).toBeInTheDocument();
            expect(canvas.getByText('Dec 16, 2020 by Preview')).toBeInTheDocument();

            expect(canvas.getByText('Archived Folder')).toBeInTheDocument();
            expect(canvas.getByText('Dec 17, 2020 by Preview')).toBeInTheDocument();

            expect(canvas.getByText('Book Sample.pdf')).toBeInTheDocument();
            expect(canvas.getByText('Dec 8, 2022 by Preview')).toBeInTheDocument();
        });
    },
};

export const withModernization = {
    args: {
        enableModernizedComponents: true,
    },
};

export const openExistingFolder = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const subFolder = await canvas.findByText('An Ordered Folder');
        await userEvent.click(subFolder);

        expect(await canvas.findByText('Audio.mp3')).toBeInTheDocument();
    },
};

export const openCreateFolderDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addButton = await canvas.findByRole('button', { name: 'Add' });
        await userEvent.click(addButton);

        const dropdown = await screen.findByRole('menu');
        const newFolderButton = await within(dropdown).findByRole('menuitem', { name: 'New Folder' });
        expect(newFolderButton).toBeInTheDocument();
        await userEvent.click(newFolderButton);

        expect(await screen.findByText('Please enter a name.')).toBeInTheDocument();
    },
};

export const closeCreateFolderDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const addButton = await canvas.findByRole('button', { name: 'Add' });
        await userEvent.click(addButton);

        const dropdown = await screen.findByRole('menu');
        const newFolderButton = await within(dropdown).findByRole('menuitem', { name: 'New Folder' });
        expect(newFolderButton).toBeInTheDocument();
        await userEvent.click(newFolderButton);

        expect(await screen.findByText('Please enter a name.')).toBeInTheDocument();

        const cancelButton = screen.getByText('Cancel');
        await userEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Please enter a name.')).not.toBeInTheDocument();
        });
    },
};

const defaultHandlers = [
    http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
        return HttpResponse.json(mockRootFolder);
    }),
    http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/73426618530`, () => {
        return HttpResponse.json(mockSubfolder);
    }),
    http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/74729718131`, () => {
        return HttpResponse.json(mockEmptyRootFolder);
    }),
    http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/191354690948`, () => {
        return new HttpResponse('Internal Server Error', { status: 500 });
    }),
    http.get(`${DEFAULT_HOSTNAME_API}/2.0/recent_items`, () => {
        return HttpResponse.json(mockRecentItems);
    }),
];

export const emptyState = {
    args: {
        rootFolderId: '74729718131',
    },
    parameters: {
        msw: {
            handlers: [
                ...defaultHandlers,
                http.get(mockUserRequest.url, () => {
                    return HttpResponse.json(mockUserRequest.response);
                }),
            ],
        },
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

export const withTheming = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(async () => {
            expect(await canvas.getByText('Preview Test Folder')).toBeInTheDocument();
        });
    },
};

export default {
    title: 'Elements/ContentExplorer/tests/ContentExplorer/visual',
    component: ContentExplorer,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
    parameters: {
        chromatic: {
            disableSnapshot: false,
        },
        msw: {
            handlers: defaultHandlers,
        },
    },
};
