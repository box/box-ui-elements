import * as React from 'react';
import { shallow } from 'enzyme';

import HotkeyFriendlyOverlay, { HotkeyFriendlyOverlayProps } from '../HotkeyFriendlyOverlay';

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

        expect((overlay.props() as HotkeyFriendlyOverlayProps).shouldDefaultFocus).toBe(true);
        expect((overlay.props() as HotkeyFriendlyOverlayProps).className).toBe('test-class');
    });
});
