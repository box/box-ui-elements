import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { mountConnected } from '../../../test-utils/enzyme';
import CollapsibleSidebar from '../CollapsibleSidebar';

const sandbox = sinon.sandbox.create();

describe('components/core/collapsible-sidebar/CollapsibleSidebar', () => {
    const getWrapper = (props = {}) => shallow(<CollapsibleSidebar {...props} />);

    test('render', () => {
        const sidebar = getWrapper({
            children: [<span key="1">abc</span>, <span key="2">def</span>],
            expanded: true,
            className: 'foo',
        });

        expect(sidebar).toMatchSnapshot();
    });

    describe('handleKeyDown()', () => {
        let attachTo;
        let wrapper = null;

        const mountToBody = (props = {}) => mountConnected(<CollapsibleSidebar {...props} />, { attachTo });

        beforeEach(() => {
            attachTo = document.createElement('div');
            document.body.appendChild(attachTo);
            wrapper = mountToBody({
                children: [
                    <a href="/abc" className="first" key="1">
                        abc
                    </a>,
                    <a href="/def" className="second" key="2">
                        def
                    </a>,
                    <a href="/ghi" className="third" key="3">
                        def
                    </a>,
                ],
                expanded: true,
                className: 'foo',
            });

            // make sure the focus is on the nav
            wrapper
                .find('.first')
                .getDOMNode()
                .focus();
        });

        afterEach(() => {
            sandbox.verifyAndRestore();
            if (wrapper) {
                wrapper.unmount();
                wrapper = null;
            }
            document.body.removeChild(attachTo);
        });

        test('focusNextEl', () => {
            const instance = wrapper.instance();
            const firstLink = wrapper.find('.first').getDOMNode();
            const secondLink = wrapper.find('.second').getDOMNode();
            const thirdLink = wrapper.find('.third').getDOMNode();

            instance.focusNextEl();
            expect(secondLink).toEqual(document.activeElement);
            instance.focusNextEl();
            expect(thirdLink).toEqual(document.activeElement);
            instance.focusNextEl();
            expect(firstLink).toEqual(document.activeElement);
        });

        test('focusPreviousEl', () => {
            const instance = wrapper.instance();
            const firstLink = wrapper.find('.first').getDOMNode();
            const secondLink = wrapper.find('.second').getDOMNode();
            const thirdLink = wrapper.find('.third').getDOMNode();

            instance.focusPreviousEl();
            expect(thirdLink).toEqual(document.activeElement);
            instance.focusPreviousEl();
            expect(secondLink).toEqual(document.activeElement);
            instance.focusPreviousEl();
            expect(firstLink).toEqual(document.activeElement);
        });

        test('should focusNextEl() when "down" key is pressed', () => {
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('focusNextEl');
            const nav = wrapper.find('nav');
            nav.simulate('keydown', {
                key: 'ArrowDown',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should focusPreviousEl() when "up" key is pressed', () => {
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('focusPreviousEl');
            const nav = wrapper.find('nav');
            nav.simulate('keydown', {
                key: 'ArrowUp',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should not call focusNextEl() or focusPreviousEl() when other key is pressed', () => {
            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('focusNextEl')
                .never();
            sandbox
                .mock(instance)
                .expects('focusPreviousEl')
                .never();
            const nav = wrapper.find('nav');
            nav.simulate('keydown', {
                key: 'Enter',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });
    });
});
