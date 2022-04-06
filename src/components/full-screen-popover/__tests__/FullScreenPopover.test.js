import React from 'react';
import { shallow } from 'enzyme';

import FullScreenPopover from '../FullScreenPopover';

describe('components/full-screen-popup/FullScreenPopover', () => {
    // eslint-disable-next-line react/button-has-type
    const FakeButton = props => <button {...props}>Some Button</button>;
    FakeButton.displayName = 'FakeButton';

    /* eslint-disable */
    const FakeContent = ({ initialFocusIndex = 0, onClose = () => {}, ...rest }) => (
        <ul {...rest} role="menu">
            Some Menu
        </ul>
    );
    FakeContent.displayName = 'FakeContent';
    /* eslint-enable */

    describe('render()', () => {
        test('should throw error with less than 2 children', () => {
            expect(() => {
                shallow(
                    <FullScreenPopover>
                        <FakeButton />
                    </FullScreenPopover>,
                );
            }).toThrow();
        });

        test('should throw error with more than 2 children', () => {
            expect(() => {
                shallow(
                    <FullScreenPopover>
                        <FakeButton />
                        <FakeContent />
                        <div />
                    </FullScreenPopover>,
                );
            }).toThrow();
        });
    });
});
