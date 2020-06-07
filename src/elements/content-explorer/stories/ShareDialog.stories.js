// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { State, Store } from '@sambego/storybook-state';

import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import { ACCESS_OPEN } from '../../../constants';

import ShareDialog from '../ShareDialog';
import notes from './ShareDialog.stories.md';

export const shareDialog = () => {
    const componentStore = new Store({
        isModalOpen: false,
    });

    const openModal = () =>
        componentStore.set({
            isModalOpen: true,
        });

    const closeModal = () => componentStore.set({ isModalOpen: false });

    const rootElement = document.createElement('div');
    const appElement = document.createElement('div');
    rootElement.appendChild(appElement);
    if (document.body) {
        document.body.appendChild(rootElement);
    }

    return (
        <State store={componentStore}>
            {state => (
                <div>
                    <ShareDialog
                        appElement={appElement}
                        canSetShareAccess={boolean('canSetShareAccess', true)}
                        isLoading={boolean('isLoading', false)}
                        isOpen={state.isModalOpen}
                        item={{
                            id: 'abcdefg',
                            shared_link: {
                                access: ACCESS_OPEN,
                                url: 'https://cloud.box.com/s/abcdefg',
                            },
                        }}
                        onCancel={closeModal}
                        onShareAccessChange={() => null}
                        parentElement={rootElement}
                    />
                    <PrimaryButton onClick={openModal}>Launch ShareDialog</PrimaryButton>
                </div>
            )}
        </State>
    );
};

export default {
    title: 'Elements|ContentExplorer|ShareDialog',
    component: ShareDialog,
    parameters: {
        notes,
    },
};
