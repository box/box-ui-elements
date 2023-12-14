// @flow
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { defaultVisualConfig, sleep } from '../../../../utils/storybook';

import ContentExplorer from '../../ContentExplorer';

export const basic = {
    play: () => {
        sleep(3250);
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
    },
};
