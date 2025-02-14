import { expect, userEvent, waitFor, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';
import ContentPicker from '../../ContentPicker';
import { mockRootFolder } from '../../../common/__mocks__/mockRootFolder';

import { DEFAULT_HOSTNAME_API } from '../../../../constants';

export const basic = {};

export const selectedEmptyState = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(() => {
            expect(canvas.getByText('An Ordered Folder')).toBeInTheDocument();
        });

        const selectedButton = canvas.getByRole('button', { name: '0 Selected' });
        await userEvent.click(selectedButton);
        await waitFor(() => {
            expect(canvas.getByText('You haven’t selected any items yet.')).toBeInTheDocument();
        });
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
            ],
        },
    },
};
