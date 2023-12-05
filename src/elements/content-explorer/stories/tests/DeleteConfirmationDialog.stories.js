// @flow
import * as React from 'react';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
import { addRootElement } from '../../../../utils/storybook';

import DeleteConfirmationDialog from '../../DeleteConfirmationDialog';

// need to import this into the story because it's usually in ContentExplorer
import '../../../common/modal.scss';

const item = {
    id: '123456',
    name:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Aliquam faucibus purus in massa tempor nec. Ut consequat semper viverra nam libero justo laoreet sit amet. Purus gravida quis blandit turpis cursus in hac. Dui ut ornare lectus sit amet est. Nisl condimentum id venenatis a condimentum vitae sapien ',
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
    play: async () => {
        const root = within(document.querySelector('#rootElement'));
        const dialog = root.getByRole('dialog');
        expect(dialog).toBeVisible();

        const name = root.getByText(`Are you sure you want to delete ${item.name}?`);
        expect(name).toBeVisible();

        const deleteButton = root.getByText('Delete');
        expect(deleteButton).toBeVisible();

        const cancelButton = root.getByText('Cancel');
        expect(cancelButton).toBeVisible();
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
    play: async () => {
        const root = within(document.querySelector('#rootElement'));
        const dialog = root.getByRole('dialog');
        expect(dialog).toBeVisible();

        const name = root.getByText(`Are you sure you want to delete ${item.name}?`);
        expect(name).toBeVisible();

        const crawler = document.querySelector('.crawler');
        expect(crawler).toBeVisible();

        const cancelButton = root.getByText('Cancel');
        expect(cancelButton).toBeVisible();

        // TODO should be checking for if the loading and cancel button is disabled but we arent setting disable the conventional way at the moment.
    },
};

export default {
    title: 'Elements/ContentExplorer/tests/DeleteConfirmationDialog',
    component: DeleteConfirmationDialog,
};
