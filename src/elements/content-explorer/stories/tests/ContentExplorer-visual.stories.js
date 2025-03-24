import { http, HttpResponse } from 'msw';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import ContentExplorer from '../../ContentExplorer';
import { mockEmptyRootFolder, mockRootFolder } from '../../../common/__mocks__/mockRootFolder';
import mockSubfolder from '../../../common/__mocks__/mockSubfolder';
import mockRecentItems from '../../../common/__mocks__/mockRecentItems';

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

export const openDeleteConfirmationDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.findByRole('grid', { name: 'List view' });

        const moreOptionsButton = await canvas.findAllByRole('button', { name: 'More options' });
        await userEvent.click(moreOptionsButton[0]);

        const deleteButton = await screen.findByRole('menuitem', { name: 'Delete' });
        expect(deleteButton).toBeInTheDocument();
        await userEvent.click(deleteButton);

        expect(
            await screen.findByText('Are you sure you want to delete An Ordered Folder and all its contents?'),
        ).toBeInTheDocument();
    },
};

export const closeDeleteConfirmationDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await canvas.findByRole('grid', { name: 'List view' });

        const moreOptionsButton = await canvas.findAllByRole('button', { name: 'More options' });
        await userEvent.click(moreOptionsButton[0]);

        const deleteButton = await screen.findByRole('menuitem', { name: 'Delete' });
        expect(deleteButton).toBeInTheDocument();
        await userEvent.click(deleteButton);

        expect(
            await screen.findByText('Are you sure you want to delete An Ordered Folder and all its contents?'),
        ).toBeInTheDocument();

        const cancelButton = screen.getByText('Cancel');
        await userEvent.click(cancelButton);

        await waitFor(() => {
            expect(
                screen.queryByText('Are you sure you want to delete An Ordered Folder and all its contents?'),
            ).not.toBeInTheDocument();
        });
    },
};

export const openRenameDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(async () => {
            const moreOptionsButton = await canvas.findAllByRole('button', { name: 'More options' });
            await userEvent.click(moreOptionsButton[0]);

            const renameButton = await screen.findByRole('menuitem', { name: 'Rename' });
            expect(renameButton).toBeInTheDocument();
            await userEvent.click(renameButton);
        });

        expect(await screen.findByText('Please enter a new name for An Ordered Folder:')).toBeInTheDocument();
    },
};

export const closeRenameDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(async () => {
            const moreOptionsButton = await canvas.findAllByRole('button', { name: 'More options' });
            await userEvent.click(moreOptionsButton[0]);

            const renameButton = await screen.findByRole('menuitem', { name: 'Rename' });
            expect(renameButton).toBeInTheDocument();
            await userEvent.click(renameButton);
        });

        expect(await screen.findByText('Please enter a new name for An Ordered Folder:')).toBeInTheDocument();
        const cancelButton = screen.getByText('Cancel');
        await userEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Please enter a new name for An Ordered Folder:')).not.toBeInTheDocument();
        });
    },
};

export const openShareDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(async () => {
            const moreOptionsButton = await canvas.findAllByRole('button', { name: 'More options' });
            await userEvent.click(moreOptionsButton[0]);

            const shareButton = await screen.findByRole('menuitem', { name: 'Share' });
            expect(shareButton).toBeInTheDocument();
            await userEvent.click(shareButton);
        });

        expect(await screen.findByText('Shared Link:')).toBeInTheDocument();

        const inputElement = screen.getByDisplayValue('https://example.com/share-link');
        expect(inputElement).toBeInTheDocument();
    },
};

export const closeShareDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await waitFor(async () => {
            const moreOptionsButton = await canvas.findAllByRole('button', { name: 'More options' });
            await userEvent.click(moreOptionsButton[0]);

            const shareButton = await screen.findByRole('menuitem', { name: 'Share' });
            expect(shareButton).toBeInTheDocument();
            await userEvent.click(shareButton);
        });

        expect(await screen.findByText('Shared Link:')).toBeInTheDocument();
        const closeButton = screen.getByText('Close');
        await userEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText('Shared Link:')).not.toBeInTheDocument();
        });
        const inputElement = screen.queryByDisplayValue('https://example.com/share-link');
        expect(inputElement).not.toBeInTheDocument();
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
        msw: {
            handlers: [
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
            ],
        },
    },
};
