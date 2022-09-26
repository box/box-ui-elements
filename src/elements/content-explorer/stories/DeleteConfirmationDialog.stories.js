// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { State, Store } from '@sambego/storybook-state';

import PrimaryButton from '../../../components/primary-button/PrimaryButton';

import DeleteConfirmationDialog from '../DeleteConfirmationDialog';
import notes from './DeleteConfirmationDialog.stories.md';

export const deleteDialog = () => {
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
                    <DeleteConfirmationDialog
                        appElement={appElement}
                        isLoading={boolean('isLoading', false)}
                        isOpen={state.isModalOpen}
                        item={{
                            id: 'abcdefg',
                            name:
                                'somethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdjsomethinggjsdlkfjsdkajfksdajfdj ',
                        }}
                        onCancel={closeModal}
                        onDelete={() => {}}
                        parentElement={rootElement}
                    />
                    <PrimaryButton onClick={openModal}>Launch DeleteConfirmationDialog</PrimaryButton>
                </div>
            )}
        </State>
    );
};

export default {
    title: 'Elements|ContentExplorer|DeleteConfirmationDialog',
    component: DeleteConfirmationDialog,
    parameters: {
        notes,
    },
};
