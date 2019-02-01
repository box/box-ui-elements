import React from 'react';

import HotkeyFriendlyOverlay from '../HotkeyFriendlyOverlay';

describe('components/hotkeys/HotkeyFriendlyOverlay', () => {
    test('should render a HotkeyLayer and an Overlay', () => {
        const wrapper = shallow(
            <HotkeyFriendlyOverlay>
                <div />
            </HotkeyFriendlyOverlay>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should pass properties on to the underlying Overlay', () => {
        const wrapper = shallow(
            <HotkeyFriendlyOverlay className="test-class" shouldDefaultFocus>
                <div />
            </HotkeyFriendlyOverlay>,
        );

        const overlay = wrapper.find('Overlay');

        expect(overlay.props().shouldDefaultFocus).toBe(true);
        expect(overlay.props().className).toBe('test-class');
    });
});
