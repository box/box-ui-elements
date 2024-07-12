// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';

import Button from '../../button/Button';
import ModalActions from '../ModalActions';
import PrimaryButton from '../../primary-button/PrimaryButton';

import Modal from '../Modal';
import notes from './Modal.stories.md';

export const basic = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <Modal
                title="Box: Sharing is simple"
                onRequestClose={closeModal}
                isOpen={isModalOpen}
                focusElementSelector="input"
            >
                <p>
                    Elements can be auto-focused by implementing transition logic in componentDidUpdate. Focus is
                    trapped inside the modal while it is open, so pressing tab will cycle through the elements inside.
                </p>
                <p>
                    <input type="text" />
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue, lacus ut scelerisque
                    porttitor, libero diam luctus ante, non porta lectus dolor eu lectus. Suspendisse sagittis ut orci
                    eget placerat.
                </p>
                <ModalActions>
                    <Button onClick={closeModal}>Cancel</Button>
                    <PrimaryButton onClick={closeModal}>Okay</PrimaryButton>
                </ModalActions>
            </Modal>
            <PrimaryButton onClick={openModal}>Launch standard modal</PrimaryButton>
        </div>
    );
};

export const withCustomBackdropClickHandler = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const confirmBackdropClose = () => {
        // We can call the defined `closeModal` message after any custom processing,
        // or do a no-op if we wish to disable backdrop close functionality
        // eslint-disable-next-line no-alert
        if (window.confirm('There are unsaved changes. Are you sure you want to close?')) {
            closeModal();
        }
    };

    return (
        <div>
            <Modal
                title="Box: Sharing is simple"
                onRequestClose={closeModal}
                isOpen={isModalOpen}
                focusElementSelector="input"
                onBackdropClick={confirmBackdropClose}
            >
                <p>
                    Elements can be auto-focused by implementing transition logic in componentDidUpdate. Focus is
                    trapped inside the modal while it is open, so pressing tab will cycle through the elements inside.
                </p>
                <p>
                    <input type="text" />
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue, lacus ut scelerisque
                    porttitor, libero diam luctus ante, non porta lectus dolor eu lectus. Suspendisse sagittis ut orci
                    eget placerat.
                </p>
                <ModalActions>
                    <Button onClick={closeModal}>Cancel</Button>
                    <PrimaryButton onClick={closeModal}>Okay</PrimaryButton>
                </ModalActions>
            </Modal>
            <PrimaryButton onClick={openModal}>Launch standard modal</PrimaryButton>
        </div>
    );
};

export default {
    title: 'Components/Modal',
    component: Modal,
    parameters: {
        notes,
    },
};
