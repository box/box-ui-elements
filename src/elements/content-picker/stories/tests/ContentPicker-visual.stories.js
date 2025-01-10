import { expect, userEvent, waitFor, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import ContentPicker from '../../ContentPicker';
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
            expect(canvas.getByText('You haven\'t selected any items yet.')).toBeInTheDocument();
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
