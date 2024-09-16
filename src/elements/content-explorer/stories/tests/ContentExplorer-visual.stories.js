import { http, HttpResponse } from 'msw';
import { expect, userEvent, waitFor, within, screen } from '@storybook/test';

import ContentExplorer from '../../ContentExplorer';
import mockRootFolder from '../__mocks__/mockRootFolder';
import mockSubFolder from '../__mocks__/mockSubFolder';
import { defaultVisualConfig } from '../../../../utils/storybook';

import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        expect(await canvas.findByText('An Ordered Folder')).toBeInTheDocument();
        expect(canvas.getByText('Tue Apr 16 2019 by Jeremy Press')).toBeInTheDocument();

        expect(canvas.getByText('Book Sample.pdf')).toBeInTheDocument();
        expect(canvas.getByText('Thu Dec 8 2022 by Jeremy Press')).toBeInTheDocument();
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

        const moreOptionsButton = await canvas.findByTestId('bce-btn-more-options');
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

        const moreOptionsButton = await canvas.findByTestId('bce-btn-more-options');
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

        const moreOptionsButton = await canvas.findByTestId('bce-btn-more-options');
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

        const moreOptionsButton = await canvas.findByTestId('bce-btn-more-options');
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

        const moreOptionsButton = await canvas.findByTestId('bce-btn-more-options');
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

        const moreOptionsButton = await canvas.findByTestId('bce-btn-more-options');
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

export default {
    title: 'Elements/ContentExplorer/tests/ContentExplorer/visual',
    component: ContentExplorer,
    args: {
        features: global.FEATURE_FLAGS,
        rootFolderId: global.FOLDER_ID,
        token: global.TOKEN,
    },
    parameters: {
        ...defaultVisualConfig.parameters,
        msw: {
            handlers: [
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/69083462919`, () => {
                    return HttpResponse.json(mockRootFolder);
                }),
                http.get(`${DEFAULT_HOSTNAME_API}/2.0/folders/73426618530`, () => {
                    return HttpResponse.json(mockSubFolder);
                }),
            ],
        },
    },
};
