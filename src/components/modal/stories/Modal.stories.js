// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { State, Store } from '@sambego/storybook-state';

import Button from '../../button/Button';
import ModalActions from '../ModalActions';
import PrimaryButton from '../../primary-button/PrimaryButton';

import Modal from '../Modal';
import notes from './Modal.stories.md';

export const basic = () => {
    const componentStore = new Store({
        isModalOpen: false,
    });

    const openModal = () =>
        componentStore.set({
            isModalOpen: true,
        });

    const closeModal = () => componentStore.set({ isModalOpen: false });

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en">
                    <div>
                        <Modal
                            title="Box: Sharing is simple"
                            onRequestClose={closeModal}
                            isOpen={state.isModalOpen}
                            focusElementSelector="input"
                        >
                            <p>
                                Elements can be auto-focused by implementing transition logic in componentDidUpdate.
                                Focus is trapped inside the modal while it is open, so pressing tab will cycle through
                                the elements inside.
                            </p>
                            <p>
                                <input type="text" />
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue, lacus ut
                                scelerisque porttitor, libero diam luctus ante, non porta lectus dolor eu lectus.
                                Suspendisse sagittis ut orci eget placerat.
                            </p>
                            <ModalActions>
                                <Button onClick={closeModal}>Cancel</Button>
                                <PrimaryButton onClick={closeModal}>Okay</PrimaryButton>
                            </ModalActions>
                        </Modal>
                        <PrimaryButton onClick={openModal}>Launch standard modal</PrimaryButton>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export const withCustomBackdropClickHandler = () => {
    const componentStore = new Store({
        isModalOpen: false,
    });

    const openModal = () =>
        componentStore.set({
            isModalOpen: true,
        });
    const closeModal = () => componentStore.set({ isModalOpen: false });

    const confirmBackdropClose = () => {
        // We can call the defined `closeModal` message after any custom processing,
        // or do a no-op if we wish to disable backdrop close functionality
        // eslint-disable-next-line no-alert
        if (window.confirm('There are unsaved changes. Are you sure you want to close?')) {
            closeModal();
        }
    };

    return (
        <State store={componentStore}>
            {state => (
                <IntlProvider locale="en">
                    <div>
                        <Modal
                            title="Box: Sharing is simple"
                            onRequestClose={closeModal}
                            isOpen={state.isModalOpen}
                            focusElementSelector="input"
                            onBackdropClick={confirmBackdropClose}
                        >
                            <p>
                                Elements can be auto-focused by implementing transition logic in componentDidUpdate.
                                Focus is trapped inside the modal while it is open, so pressing tab will cycle through
                                the elements inside.
                            </p>
                            <p>
                                <input type="text" />
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue, lacus ut
                                scelerisque porttitor, libero diam luctus ante, non porta lectus dolor eu lectus.
                                Suspendisse sagittis ut orci eget placerat.
                            </p>
                            <ModalActions>
                                <Button onClick={closeModal}>Cancel</Button>
                                <PrimaryButton onClick={closeModal}>Okay</PrimaryButton>
                            </ModalActions>
                        </Modal>
                        <PrimaryButton onClick={openModal}>Launch standard modal</PrimaryButton>
                    </div>
                </IntlProvider>
            )}
        </State>
    );
};

export default {
    title: 'Components|Modal',
    component: Modal,
    parameters: {
        notes,
    },
};
