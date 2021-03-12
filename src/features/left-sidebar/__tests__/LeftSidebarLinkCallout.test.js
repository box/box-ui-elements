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

        test('should enable tethered component when isShown prop true', () => {
            const callout = {
                content: <div>Hi</div>,
            };
            const wrapper = getWrapper({ isShown: true, callout });
            expect(wrapper.props().enabled).toBe(true);
        });

        test('should add class provided to nav-link-callout component', () => {
            const wrapper = getWrapper({ isShown: true, navLinkClassName: 'testClass' });
            const callout = wrapper.find('.nav-link-callout');
            expect(callout.props().className).toContain('testClass');
        });
    });
});
