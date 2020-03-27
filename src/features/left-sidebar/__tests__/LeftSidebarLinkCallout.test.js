import React from 'react';
import sinon from 'sinon';

import LeftSidebarLinkCallout from '../LeftSidebarLinkCallout';

describe('components/tooltip/LeftSidebarLinkCallout', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const getWrapper = (props = {}) =>
        shallow(
            <LeftSidebarLinkCallout
                callout={{
                    content: <div>Hi</div>,
                    onClose: () => {},
                }}
                {...props}
            >
                <button type="button" />
            </LeftSidebarLinkCallout>,
        );

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should hide callout when isShown state is false', () => {
            const wrapper = getWrapper();
            wrapper.setState({ isShown: false });
            expect(wrapper).toMatchSnapshot();
        });

        test('should call onClose when clicked', () => {
            const callout = {
                content: <div>Hi</div>,
                onClose: sandbox.mock(),
            };
            const wrapper = getWrapper({ callout });
            const btn = wrapper.find('.nav-link-callout-close-button');
            btn.simulate('click');
        });
    });
});
