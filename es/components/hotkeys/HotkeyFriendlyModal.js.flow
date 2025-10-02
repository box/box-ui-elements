// @flow
import * as React from 'react';

import HotkeyLayer from './HotkeyLayer'; // eslint-disable-line import/no-cycle
import { Modal } from '../modal';

type Props = {
    children: React.Node,
    isOpen?: boolean,
};

const HotkeyFriendlyModal = ({ isOpen, ...rest }: Props) => {
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
