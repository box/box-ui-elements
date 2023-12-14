// @flow
import * as React from 'react';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

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

export const shareDialogIsLoading = {
    render: () => {
        const { appElement, rootElement } = addRootElement();

        return <ShareDialog appElement={appElement} isLoading isOpen item={item} parentElement={rootElement} />;
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
    title: 'Elements/ContentExplorer/tests/ShareDialog/interaction',
    component: ShareDialog,
    parameters: {
        ...defaultVisualConfig.parameters,
    },
};
