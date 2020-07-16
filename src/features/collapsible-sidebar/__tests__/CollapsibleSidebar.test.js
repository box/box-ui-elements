import React from 'react';
import { shallow } from 'enzyme';

import { mountConnected } from '../../../test-utils/enzyme';
import CollapsibleSidebar from '../CollapsibleSidebar';

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
            if (wrapper) {
                wrapper.unmount();
                wrapper = null;
            }
            document.body.removeChild(attachTo);
        });

        test('focusEl down', () => {
            const instance = wrapper.instance();
            const firstLink = wrapper.find('.first').getDOMNode();
            const secondLink = wrapper.find('.second').getDOMNode();
            const thirdLink = wrapper.find('.third').getDOMNode();

            instance.focusEl('down');
            expect(secondLink).toEqual(document.activeElement);
            instance.focusEl('down');
            expect(thirdLink).toEqual(document.activeElement);
            instance.focusEl('down');
            expect(firstLink).toEqual(document.activeElement);
        });

        test('focusEl up', () => {
            const instance = wrapper.instance();
            const firstLink = wrapper.find('.first').getDOMNode();
            const secondLink = wrapper.find('.second').getDOMNode();
            const thirdLink = wrapper.find('.third').getDOMNode();

            instance.focusEl('up');
            expect(thirdLink).toEqual(document.activeElement);
            instance.focusEl('up');
            expect(secondLink).toEqual(document.activeElement);
            instance.focusEl('up');
            expect(firstLink).toEqual(document.activeElement);
        });

        describe.each([
            ['ArrowDown', 'down', 1],
            ['ArrowUp', 'up', 1],
            ['Enter', '', 0],
        ])('%o', (keyInput, expectedArg, expectedCallTime) => {
            test('test focusNextEl() when a key is pressed', () => {
                const instance = wrapper.instance();
                const focusElMock = jest.fn();
                const preventDefaultMock = jest.fn();
                const stopPropagationMock = jest.fn();
                instance.focusEl = focusElMock;
                const nav = wrapper.find('nav');
                nav.simulate('keydown', {
                    key: keyInput,
                    preventDefault: preventDefaultMock,
                    stopPropagation: stopPropagationMock,
                });
                if (expectedCallTime === 0) {
                    expect(focusElMock).toHaveBeenCalledTimes(0);
                } else {
                    expect(focusElMock).toHaveBeenCalledWith(expectedArg);
                }
                expect(preventDefaultMock).toHaveBeenCalledTimes(expectedCallTime);
                expect(stopPropagationMock).toHaveBeenCalledTimes(expectedCallTime);
            });
        });
    });
});
