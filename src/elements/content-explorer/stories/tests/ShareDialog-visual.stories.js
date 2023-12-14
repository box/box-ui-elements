// @flow
import * as React from 'react';

import { ACCESS_OPEN } from '../../../../constants';
import { addRootElement, defaultVisualConfig } from '../../../../utils/storybook';

import ShareDialog from '../../ShareDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../../common/modal.scss';

const item = {
    id: 'abcdefg',
    shared_link: {
        access: ACCESS_OPEN,
        url: 'https://cloud.box.com/s/abcdefg',
    },
};

export const shareDialogNotLoading = {
    render: () => {
        const { appElement, rootElement } = addRootElement();

        return <ShareDialog appElement={appElement} isLoading={false} isOpen item={item} parentElement={rootElement} />;
    },
};

export const shareDialogIsLoading = {
    render: () => {
        const { appElement, rootElement } = addRootElement();

        return <ShareDialog appElement={appElement} isLoading isOpen item={item} parentElement={rootElement} />;
    },
};

export default {
    title: 'Elements/ContentExplorer/tests/ShareDialog/visual',
    component: ShareDialog,
    parameters: {
        ...defaultVisualConfig.parameters,
    },
};
