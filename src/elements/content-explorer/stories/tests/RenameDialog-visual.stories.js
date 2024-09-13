import * as React from 'react';

import { addRootElement, defaultVisualConfig } from '../../../../utils/storybook';

import RenameDialog from '../../RenameDialog';

import '../../../common/modal.scss';

const item = {
    id: '123456',
    name: 'mockItem',
};

export const renameDialogNotLoading = {
    render: () => {
        const { appElement, rootElement } = addRootElement();

        return (
            <RenameDialog appElement={appElement} isLoading={false} isOpen item={item} parentElement={rootElement} />
        );
    },
};

export const renameDialogIsLoading = {
    render: () => {
        const { appElement, rootElement } = addRootElement();

        return <RenameDialog appElement={appElement} isLoading isOpen item={item} parentElement={rootElement} />;
    },
};

export default {
    title: 'Elements/ContentExplorer/tests/RenameDialog/visual',
    component: RenameDialog,
    parameters: {
        ...defaultVisualConfig.parameters,
    },
};
