import { http, HttpResponse } from 'msw';
import { expect, userEvent, waitFor, within, screen } from '@storybook/test';

import ContentExplorer from '../../ContentExplorer';
import { mockEmptyRootFolder, mockRootFolder } from '../__mocks__/mockRootFolder';
import mockSubFolder from '../__mocks__/mockSubFolder';

import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(async () => {
            const folder = await canvas.findByText('An Ordered Folder');
            expect(folder).toBeInTheDocument();
            expect(canvas.getByText('Tue Apr 16 2019 by Preview')).toBeInTheDocument();

            expect(canvas.getByText('Archive')).toBeInTheDocument();
            expect(canvas.getByText('Wed Dec 16 2020 by Preview')).toBeInTheDocument();

            expect(canvas.getByText('Archived Folder')).toBeInTheDocument();
            expect(canvas.getByText('Thu Dec 17 2020 by Preview')).toBeInTheDocument();

            expect(canvas.getByText('Book Sample.pdf')).toBeInTheDocument();
            expect(canvas.getByText('Thu Dec 8 2022 by Preview')).toBeInTheDocument();
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

export const openDeleteConfirmationDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const moreOptionsButton = await canvas.findByRole('button', { name: 'More options' });
        await userEvent.click(moreOptionsButton);

        const dropdown = await screen.findByRole('menu');
        const deleteButton = within(dropdown).getByText('Delete');
        expect(deleteButton).toBeInTheDocument();
        await userEvent.click(deleteButton);

        expect(await screen.findByText('Are you sure you want to delete Book Sample.pdf?')).toBeInTheDocument();
    },
};

export const closeDeleteConfirmationDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const moreOptionsButton = await canvas.findByRole('button', { name: 'More options' });
        await userEvent.click(moreOptionsButton);

        const dropdown = await screen.findByRole('menu');
        const deleteButton = within(dropdown).getByText('Delete');
        expect(deleteButton).toBeInTheDocument();
        await userEvent.click(deleteButton);
        expect(await screen.findByText('Are you sure you want to delete Book Sample.pdf?')).toBeInTheDocument();

        const cancelButton = screen.getByText('Cancel');
        await userEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Are you sure you want to delete Book Sample.pdf?')).not.toBeInTheDocument();
        });
    },
};

export const openRenameDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const moreOptionsButton = await canvas.findByRole('button', { name: 'More options' });
        await userEvent.click(moreOptionsButton);

        const dropdown = await screen.findByRole('menu');
        const renameButton = within(dropdown).getByText('Rename');
        expect(renameButton).toBeInTheDocument();
        await userEvent.click(renameButton);

        expect(await screen.findByText('Please enter a new name for Book Sample:')).toBeInTheDocument();
    },
};

export const closeRenameDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const moreOptionsButton = await canvas.findByRole('button', { name: 'More options' });
        await userEvent.click(moreOptionsButton);

        const dropdown = await screen.findByRole('menu');
        const renameButton = within(dropdown).getByText('Rename');
        expect(renameButton).toBeInTheDocument();
        await userEvent.click(renameButton);

        expect(await screen.findByText('Please enter a new name for Book Sample:')).toBeInTheDocument();
        const cancelButton = screen.getByText('Cancel');
        await userEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Please enter a new name for Book Sample:')).not.toBeInTheDocument();
        });
    },
};

export const openShareDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const moreOptionsButton = await canvas.findByRole('button', { name: 'More options' });
        await userEvent.click(moreOptionsButton);

        const dropdown = await screen.findByRole('menu');
        const shareButton = within(dropdown).getByText('Share');
        expect(shareButton).toBeInTheDocument();
        await userEvent.click(shareButton);

        expect(await screen.findByText('Shared Link:')).toBeInTheDocument();

        const inputElement = screen.getByDisplayValue('https://example.com/share-link');
        expect(inputElement).toBeInTheDocument();
    },
};

export const closeShareDialog = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const moreOptionsButton = await canvas.findByRole('button', { name: 'More options' });
        await userEvent.click(moreOptionsButton);

        const dropdown = await screen.findByRole('menu');
        const shareButton = within(dropdown).getByText('Share');
        expect(shareButton).toBeInTheDocument();
        await userEvent.click(shareButton);

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

export const withMoreOptionsAndShareButton = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(async () => {
            const row = canvas.getByText('Thu Dec 8 2022 by Preview');
            await userEvent.click(row);
        });
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

        expect(canvas.getByText('Sorry, we couldn’t find what you’re looking for.')).toBeInTheDocument();
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
                    return HttpResponse.json(mockSubFolder);
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
