import * as React from 'react';

import { addRootElement, defaultVisualConfig } from '../../../../utils/storybook';

import DeleteConfirmationDialog from '../../DeleteConfirmationDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../../common/modal.scss';

const item = {
    id: '123456',
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Aliquam faucibus purus in massa tempor nec. Ut consequat semper viverra nam libero justo laoreet sit amet. Purus gravida quis blandit turpis cursus in hac. Dui ut ornare lectus sit amet est. Nisl condimentum id venenatis a condimentum vitae sapien ',
};

export const deleteDialogNotLoading = {
    render: () => {
        const { appElement, rootElement } = addRootElement();

        return (
            <DeleteConfirmationDialog
                appElement={appElement}
                isLoading={false}
                isOpen
                item={item}
                parentElement={rootElement}
            />
        );
    },
};

export const deleteDialogIsLoading = {
    render: () => {
        const { appElement, rootElement } = addRootElement();

        return (
            <DeleteConfirmationDialog
                appElement={appElement}
                isLoading
                isOpen
                item={item}
                parentElement={rootElement}
            />
        );
    },
};

export default {
    title: 'Elements/ContentExplorer/tests/DeleteConfirmationDialog/visual',
    component: DeleteConfirmationDialog,
    parameters: {
        ...defaultVisualConfig.parameters,
    },
};
