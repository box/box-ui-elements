import { http, HttpResponse } from 'msw';

import { userEvent, waitFor, within } from '@storybook/test';
import ContentExplorer from '../../ContentExplorer';
import { DEFAULT_HOSTNAME_API } from '../../../../constants';
import mockRootFolder from '../__mocks__/mockRootFolder';
import { defaultVisualConfig, SLEEP_TIMEOUT } from '../../../../utils/storybook';

export const basic = {};

export const openExistingFolder = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await waitFor(
            async () => {
                const row = canvas.getByText('An Ordered Folder');
                await userEvent.click(row);
            },
            {
                timeout: SLEEP_TIMEOUT,
            },
        );
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
            ],
        },
    },
};
