import React from 'react';
import { shallow } from 'enzyme';

import sinon from 'sinon';
import FullScreenPopover from '../FullScreenPopover';

const sandbox = sinon.sandbox.create();

describe('components/full-screen-popover/FullScreenPopover', () => {
    // eslint-disable-next-line react/button-has-type
    const FakeButton = props => <button {...props}>Some Button</button>;
    FakeButton.displayName = 'FakeButton';

    /* eslint-disable */
    const FakeContent = () => (
        <div>Fake Content</div>
    );
    FakeContent.displayName = 'FakeContent';
    /* eslint-enable */

    afterEach(() => {
        sandbox.restore();
    });

    describe('render()', () => {
        test('should render correctly with only required props and no content', () => {
            const wrapper = shallow(<FullScreenPopover popoverButton={<FakeButton />} />);
            expect(wrapper.prop('className')).toEqual('bdl-full-screen-popover');
            const button = wrapper.find(FakeButton);
            expect(button.length).toBe(1);
            expect(button.prop('aria-haspopup')).toEqual('true');
            expect(button.prop('aria-expanded')).toEqual('false');
            expect(button.prop('aria-controls')).toBeFalsy();

            expect(wrapper.find('Overlay').length).toEqual(0);
        });
    });

    test('should render correctly with button and no content with closed overlay', () => {
        const wrapper = shallow(<FullScreenPopover popoverButton={<FakeButton />} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with no content with opened overlay', () => {
        const wrapper = shallow(<FullScreenPopover popoverButton={<FakeButton />} />);
        wrapper.find(FakeButton).simulate('click', {
            preventDefault: sandbox.mock(),
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render correctly with no content with opened overlay', () => {
        const wrapper = shallow(
            <FullScreenPopover popoverButton={<FakeButton />}>
                <FakeContent />
            </FullScreenPopover>,
        );
        wrapper.find(FakeButton).simulate('click', {
            preventDefault: sandbox.mock(),
        });

        expect(wrapper).toMatchSnapshot();
    });
});
