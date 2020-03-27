import React from 'react';

import HotkeyFriendlyModal from '../HotkeyFriendlyModal';

describe('components/hotkeys/HotkeyFriendlyModal', () => {
    test('should render a HotkeyLayer and Modal when isOpen is true', () => {
        const wrapper = shallow(
            <HotkeyFriendlyModal isOpen>
                <div />
            </HotkeyFriendlyModal>,
        );

        const hotkeyLayer = wrapper.find('HotkeyLayer');
        expect(hotkeyLayer.length).toBe(1);
        expect(hotkeyLayer.prop('enableHelpModal')).toBeFalsy();

        expect(wrapper.find('Modal').length).toBe(1);
    });

    test('should render null when isOpen is falsy', () => {
        const wrapper = shallow(
            <HotkeyFriendlyModal>
                <div />
            </HotkeyFriendlyModal>,
        );

        expect(wrapper.type()).toBeNull();
    });
});
