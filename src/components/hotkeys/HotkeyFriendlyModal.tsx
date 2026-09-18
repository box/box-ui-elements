import * as React from 'react';

import { Modal, type ModalProps } from '../modal';
import HotkeyLayer from './HotkeyLayer';

export interface HotkeyFriendlyModalProps {
    /** Modal contents */
    children: React.ReactNode;
    /** Additional CSS classname of the `.modal` element */
    className?: string;
    /** Whether the modal is open; when false nothing is rendered */
    isOpen?: boolean;
    /** Called when the modal requests to close */
    onRequestClose?: ModalProps['onRequestClose'];
    /** Modal title */
    title?: React.ReactNode;
}

const HotkeyFriendlyModal = ({ isOpen, ...rest }: HotkeyFriendlyModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <HotkeyLayer>
            <Modal isOpen {...rest} />
        </HotkeyLayer>
    );
};

export default HotkeyFriendlyModal;
