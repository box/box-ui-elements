import React, { Children } from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import * as domUtils from '../../../utils/dom';

import SelectorDropdown from '..';

const sandbox = sinon.sandbox.create();

describe('components/selector-dropdown/SelectorDropdown', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    const Selector = () => <input />;

    const renderEmptyDropdown = props => shallow(<SelectorDropdown selector={<Selector />} {...props} />);

    const renderDropdownWithChildren = (children, props) =>
        shallow(
            <SelectorDropdown selector={<Selector />} {...props}>
                {Children.map(children, item => (
                    <li key={item}>{item}</li>
                ))}
            </SelectorDropdown>,
        );

    describe('componentWillUnmount()', () => {
        test('should remove document click listener', () => {
            document.removeEventListener = jest.fn();
            const wrapper = renderEmptyDropdown();
            wrapper.unmount();
            expect(document.removeEventListener.mock.calls.length).toBe(1);
        });
    });

    describe('render()', () => {
        test('should render a div wrapper with the specified class', () => {
            const className = 'test';
            const wrapper = renderEmptyDropdown({ className });

            expect(wrapper.hasClass('SelectorDropdown')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
        });

        test('should render the selector with aria props', () => {
            const wrapper = renderEmptyDropdown();
            const selector = wrapper.find('Selector');
            const inputProps = selector.prop('inputProps');

            expect(selector.length).toBe(1);
            expect(inputProps['aria-activedescendant']).toBeNull();
            expect(inputProps['aria-expanded']).toBe(false);
        });

        test('should not set aria-owns and render a listbox when dropdown is closed', () => {
            const wrapper = renderEmptyDropdown();

            const inputProps = wrapper.find('Selector').prop('inputProps');
            expect(inputProps['aria-owns']).toBeFalsy();
            expect(wrapper.find('.overlay-wrapper').length).toBe(0);
        });

        test('should render listbox with children when dropdown is open', () => {
            const wrapper = renderDropdownWithChildren(['Testing', 'Hello']);
            wrapper.setState({
                activeItemIndex: 0,
                shouldOpen: true,
            });

            const inputProps = wrapper.find('Selector').prop('inputProps');
            expect(inputProps['aria-owns']).toBeTruthy();

            const overlay = wrapper.find('ul.overlay');
            expect(overlay.length).toBe(1);
            expect(overlay.prop('id')).toBeTruthy();

            const items = wrapper.find('li');
            expect(items.length).toBe(2);
            expect(items.at(0).prop('setActiveItemID')).toBeTruthy();
            expect(items.at(0).prop('isActive')).toBe(true);
        });

        test('should render header that is passed in when dropdown is open', () => {
            const title = <div className="title" />;
            const wrapper = renderDropdownWithChildren(['Testing', 'Hello'], {
                title,
            });
            wrapper.setState({
                activeItemIndex: 0,
                shouldOpen: true,
            });

            expect(wrapper.find('.title')).toHaveLength(1);
        });

        test('should render title when passed overlayTitle', () => {
            const wrapper = renderDropdownWithChildren(['Testing', 'Hello'], {
                isAlwaysOpen: true,
            });

            expect(wrapper.find('.SelectorDropdown-title')).toHaveLength(0);
        });

        test('should not render titie when not passed overlayTitle', () => {
            const wrapper = renderDropdownWithChildren(['Testing', 'Hello'], {
                isAlwaysOpen: true,
                overlayTitle: 'Some Title',
            });

            expect(wrapper.find('.SelectorDropdown-title')).toHaveLength(1);
        });

        test('should render divider when passed dividerIndex', () => {
            const wrapper = renderDropdownWithChildren(['Testing', 'Hello'], { dividerIndex: 1, isAlwaysOpen: true });

            expect(wrapper.find('.SelectorDropdown-divider')).toHaveLength(1);
        });

        test('should not render divider when not passed dividerIndex', () => {
            const wrapper = renderDropdownWithChildren(['Testing', 'Hello'], { isAlwaysOpen: true });

            expect(wrapper.find('.SelectorDropdown-divider')).toHaveLength(0);
        });
    });

    describe('onFocus', () => {
        test('should set shouldOpen state to true when called', () => {
            const wrapper = renderEmptyDropdown();

            wrapper.simulate('focus');

            expect(wrapper.state('shouldOpen')).toBe(true);
        });
    });

    describe('handleDocumentClick', () => {
        test('should close dropdown when click occurs outside of selector dropdown', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            wrapper.simulate('focus');
            expect(wrapper.state('shouldOpen')).toBe(true);
            sandbox.mock(instance).expects('closeDropdown');
            instance.handleDocumentClick({
                target: document.createElement('div'),
            });
        });

        test('should not close dropdown when click occurs on selector dropdown container', () => {
            const wrapper = renderEmptyDropdown();
            wrapper.simulate('focus');
            expect(wrapper.state('shouldOpen')).toBe(true);
            wrapper.simulate('click');
            expect(wrapper.state('shouldOpen')).toBe(true);
        });

        test('should not close dropdown when click occurs on dropdown menu', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            wrapper.simulate('focus');
            expect(wrapper.state('shouldOpen')).toBe(true);
            sandbox
                .mock(instance)
                .expects('closeDropdown')
                .never();
            instance.handleDocumentClick({
                target: document.getElementById(instance.listboxID),
            });
        });
    });

    describe('handleInput()', () => {
        test('should call openDropdown() when key is pressed', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();

            sandbox.mock(instance).expects('openDropdown');

            wrapper.simulate('keyPress');
        });

        test('should call openDropdown() when text is pasted', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();

            sandbox.mock(instance).expects('openDropdown');

            wrapper.simulate('paste');
        });
    });

    describe('onArrowDown', () => {
        let event;
        const preventDefault = sandbox.spy();
        const stopPropagation = sandbox.spy();
        beforeEach(() => {
            event = {
                key: 'ArrowDown',
                preventDefault,
                stopPropagation,
            };
        });

        test('should set next active item when key is arrow down and dropdown is open', () => {
            const wrapper = renderDropdownWithChildren(['test']);
            const instance = wrapper.instance();
            sandbox.stub(instance, 'isDropdownOpen').returns(true);

            sandbox
                .mock(instance)
                .expects('setActiveItem')
                .withArgs(0);

            wrapper.simulate('keyDown', event);
        });

        test('should reset active item when key is arrow down, dropdown is open, and the last item is active', () => {
            const wrapper = renderDropdownWithChildren(['test']);
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex: 0 });
            sandbox.stub(instance, 'isDropdownOpen').returns(true);

            sandbox
                .mock(instance)
                .expects('setActiveItem')
                .withArgs(-1);

            wrapper.simulate('keyDown', event);
        });

        test('should open dropdown when key is arrow down and dropdown is closed', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            sandbox.stub(instance, 'isDropdownOpen').returns(false);
            sandbox.stub(instance, 'openDropdown');

            wrapper.simulate('keyDown', event);

            expect(instance.openDropdown.calledOnce).toEqual(true);
        });
    });

    describe('onArrowUp', () => {
        let event;
        const preventDefault = sandbox.spy();
        const stopPropagation = sandbox.spy();
        beforeEach(() => {
            event = {
                key: 'ArrowUp',
                preventDefault,
                stopPropagation,
            };
        });

        test('should set previous active item when key is arrow up and dropdown is open', () => {
            const wrapper = renderDropdownWithChildren(['test']);
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex: 0 });
            sandbox.stub(instance, 'isDropdownOpen').returns(true);

            sandbox
                .mock(instance)
                .expects('setActiveItem')
                .withArgs(-1);

            wrapper.simulate('keyDown', event);
        });

        test('should correctly set active item when key is arrow up, dropdown is open, and no item is active', () => {
            const wrapper = renderDropdownWithChildren(['test']);
            const instance = wrapper.instance();
            sandbox.stub(instance, 'isDropdownOpen').returns(true);

            sandbox
                .mock(instance)
                .expects('setActiveItem')
                .withArgs(0);

            wrapper.simulate('keyDown', event);
        });

        test('should open dropdown when key is arrow up and dropdown is closed', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            sandbox.stub(instance, 'isDropdownOpen').returns(false);
            sandbox.stub(instance, 'openDropdown');

            wrapper.simulate('keyDown', event);

            expect(instance.openDropdown.calledOnce).toEqual(true);
        });
    });

    describe('onEnter', () => {
        test('should not stop default event or select item when no item is active', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('selectItem')
                .never();

            wrapper.simulate('keyDown', {
                key: 'Enter',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should not stop default event or select item when dropdown is closed', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex: 0 });
            sandbox.stub(instance, 'isDropdownOpen').returns(false);

            sandbox
                .mock(instance)
                .expects('selectItem')
                .never();

            wrapper.simulate('keyDown', {
                key: 'Enter',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should stop default event and select item when an item is active and dropdown is open', () => {
            const activeItemIndex = 0;
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            const event = {
                key: 'Enter',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            };
            wrapper.setState({ activeItemIndex });
            sandbox.stub(instance, 'isDropdownOpen').returns(true);

            sandbox
                .mock(instance)
                .expects('selectItem')
                .withExactArgs(activeItemIndex, event);

            wrapper.simulate('keyDown', event);
        });

        test('should call onEnter() when specified and no item is active', () => {
            const event = {
                key: 'Enter',
            };
            const wrapper = renderEmptyDropdown({
                onEnter: sandbox.mock().withExactArgs(event),
            });

            wrapper.simulate('keyDown', event);
        });

        test('should call onEnter() when specified and dropdown is closed', () => {
            const event = {
                key: 'Enter',
            };
            const wrapper = renderEmptyDropdown({
                onEnter: sandbox.mock().withExactArgs(event),
            });
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex: 0 });
            sandbox.stub(instance, 'isDropdownOpen').returns(false);

            wrapper.simulate('keyDown', event);
        });
    });

    describe('onTab', () => {
        test('should not close dropdown or reset active item when dropdown is closed', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            sandbox.stub(instance, 'isDropdownOpen').returns(false);

            instanceMock.expects('closeDropdown').never();
            instanceMock.expects('resetActiveItem').never();

            wrapper.simulate('keyDown', {
                key: 'Tab',
            });
        });

        test('should call closeDropdown() and reset active item when dropdown is open', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            sandbox.stub(instance, 'isDropdownOpen').returns(true);

            instanceMock.expects('closeDropdown');
            instanceMock.expects('resetActiveItem');

            wrapper.simulate('keyDown', {
                key: 'Tab',
            });
        });
    });

    describe('onEscape', () => {
        test('should not stop default event, close dropdown, or reset active item when dropdown is closed', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            sandbox.stub(instance, 'isDropdownOpen').returns(false);

            instanceMock.expects('closeDropdown').never();
            instanceMock.expects('resetActiveItem').never();

            wrapper.simulate('keyDown', {
                key: 'Escape',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should stop default event, close dropdown, and reset active item when dropdown is open', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            sandbox.stub(instance, 'isDropdownOpen').returns(true);

            instanceMock.expects('closeDropdown');
            instanceMock.expects('resetActiveItem');

            wrapper.simulate('keyDown', {
                key: 'Escape',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should not prevent default event and should not stop propagation', () => {
            const wrapper = renderEmptyDropdown({
                isAlwaysOpen: true,
            });
            const instance = wrapper.instance();
            const instanceMock = sandbox.stub(instance, 'isDropdownOpen').returns(true);

            sandbox.mock(instanceMock.closeDropdown).never();
            sandbox.mock(instanceMock.resetActiveItem).never();

            wrapper.simulate('keyDown', {
                key: 'Escape',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });
    });

    describe('onItemMouseDown', () => {
        test('should prevent default when mousedown on item occurs to prevent blur', () => {
            const wrapper = renderDropdownWithChildren(['test']);
            wrapper.setState({
                shouldOpen: true,
            });
            wrapper.find('li').simulate('mouseDown', {
                preventDefault: sandbox.mock(),
            });
        });
    });

    describe('onItemMouseEnter', () => {
        test('should set correct active item index when hovering over item', () => {
            const wrapper = renderDropdownWithChildren(['test']);
            wrapper.setState({
                shouldOpen: true,
            });

            wrapper.find('li').simulate('mouseEnter');

            expect(wrapper.state('activeItemIndex')).toEqual(0);
        });
    });

    describe('componentDidUpdate()', () => {
        [
            // No Children
            {
                children: null,
            },
            // same children
            {
                children: ['test'],
            },
        ].forEach(({ children }) => {
            test('should not call resetActiveItem() when children have not changed', () => {
                const wrapper = renderDropdownWithChildren(children);
                const instance = wrapper.instance();

                sandbox
                    .mock(instance)
                    .expects('resetActiveItem')
                    .never();

                wrapper.setProps({ className: 'test' });
            });
        });

        [
            // Children Different Length
            {
                children: ['hi', 'bye'],
                nextChildren: ['hi'],
            },
            // Next Children
            {
                children: ['hi'],
                nextChildren: ['bye'],
            },
        ].forEach(({ children, nextChildren }) => {
            test('should call resetActiveItem() when children have changed', () => {
                const wrapper = renderDropdownWithChildren(children);
                const instanceMock = sandbox.mock(wrapper.instance());

                instanceMock.expects('resetActiveItem');
                instanceMock.expects('setActiveItem').never();

                wrapper.setProps({
                    children: Children.map(nextChildren, item => <li key={item}>{item}</li>),
                });
            });

            test('should call setActiveItem() with index 0 when children have changed and shouldSetActiveItemOnOpen is set to true', () => {
                const wrapper = renderDropdownWithChildren(children, { shouldSetActiveItemOnOpen: true });
                const instanceMock = sandbox.mock(wrapper.instance());

                instanceMock.expects('resetActiveItem').never();
                instanceMock
                    .expects('setActiveItem')
                    .once()
                    .withArgs(0);

                wrapper.setProps({
                    children: Children.map(nextChildren, item => <li key={item}>{item}</li>),
                });
            });
        });
    });

    describe('setActiveItem()', () => {
        const wrapper = renderEmptyDropdown();
        const instance = wrapper.instance();

        test('should update activeItemIndex state when called', () => {
            const index = 1;
            sandbox
                .mock(instance)
                .expects('setActiveItemID')
                .never();
            instance.setActiveItem(index);
            expect(wrapper.state('activeItemIndex')).toEqual(index);
        });

        test('should reset active item ID when index is -1', () => {
            sandbox
                .mock(instance)
                .expects('setActiveItemID')
                .withArgs(null);
            instance.setActiveItem(-1);
        });
    });

    describe('setActiveItemID()', () => {
        const wrapper = renderEmptyDropdown();
        const instance = wrapper.instance();
        const id = 'test123';

        test('should update activeItemID state when called', () => {
            instance.setActiveItemID(id);
            expect(wrapper.state('activeItemID')).toEqual(id);
        });

        test('should call scrollIntoView', () => {
            const scrollIntoView = jest.spyOn(domUtils, 'scrollIntoView');
            instance.setActiveItemID(id);

            expect(scrollIntoView).toHaveBeenCalled();
        });
    });

    describe('resetActiveItem()', () => {
        test('should update activeItemIndex state when called', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            wrapper.setState({
                activeItemID: 'test',
                activeItemIndex: 1,
            });

            instance.resetActiveItem();

            expect(wrapper.state('activeItemID')).toEqual(null);
            expect(wrapper.state('activeItemIndex')).toEqual(-1);
        });
    });

    describe('isDropdownOpen()', () => {
        [
            // No Children and Open
            {
                hasChildren: false,
                shouldOpen: true,
                isAlwaysOpen: false,
                exp: false,
            },
            // With Children and Closed
            {
                hasChildren: true,
                shouldOpen: false,
                isAlwaysOpen: false,
                exp: false,
            },
            // No Children and Closed
            {
                hasChildren: false,
                shouldOpen: false,
                isAlwaysOpen: false,
                exp: false,
            },
            // With Children and Open
            {
                hasChildren: true,
                shouldOpen: true,
                isAlwaysOpen: false,
                exp: true,
            },
            // Forced Open with Children
            {
                hasChildren: true,
                shouldOpen: false,
                isAlwaysOpen: true,
                exp: true,
            },
            // Forced Open Without Children
            {
                hasChildren: false,
                shouldOpen: false,
                isAlwaysOpen: true,
                exp: false,
            },
        ].forEach(({ hasChildren, shouldOpen, isAlwaysOpen, exp }) => {
            test('should open dropdown when all conditions are met', () => {
                const wrapper = hasChildren
                    ? renderDropdownWithChildren(['test'], { isAlwaysOpen })
                    : renderEmptyDropdown({ isAlwaysOpen });
                const instance = wrapper.instance();
                wrapper.setState({ shouldOpen });

                expect(instance.isDropdownOpen()).toEqual(exp);
            });
        });
    });

    describe('openDropdown()', () => {
        test('should set shouldOpen state to true when called', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();

            instance.openDropdown();

            expect(wrapper.state('shouldOpen')).toBe(true);
        });

        test('should add document click listener', () => {
            document.addEventListener = jest.fn();
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            instance.openDropdown();
            expect(document.addEventListener.mock.calls.length).toBe(1);
        });

        test('should activate first item when dropdown is opened and shouldSetActiveItemOnOpen is set to true', () => {
            const setActiveItem = jest.fn();
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            instance.setActiveItem = setActiveItem;

            wrapper.setProps({ shouldSetActiveItemOnOpen: false });
            instance.openDropdown();
            expect(setActiveItem).toHaveBeenCalledTimes(0);

            instance.closeDropdown();

            wrapper.setProps({ shouldSetActiveItemOnOpen: true });
            instance.openDropdown();
            expect(setActiveItem).toHaveBeenCalledWith(0);
            expect(setActiveItem).toHaveBeenCalledTimes(1);
        });
    });

    describe('closeDropdown()', () => {
        test('should set shouldOpen state to false when called', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            wrapper.setState({ shouldOpen: true });

            instance.closeDropdown();

            expect(wrapper.state('shouldOpen')).toBe(false);
        });

        test('should remove document click listener', () => {
            document.removeEventListener = jest.fn();
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();
            wrapper.setState({ shouldOpen: true });
            instance.closeDropdown();
            expect(document.removeEventListener.mock.calls.length).toBe(1);
        });
    });

    describe('selectItem()', () => {
        test('should call onSelect() with the index and event when prop is specified', () => {
            const onSelectSpy = sandbox.spy();
            const wrapper = renderEmptyDropdown({ onSelect: onSelectSpy });
            const instance = wrapper.instance();
            const index = 1;
            const event = { type: 'click' };

            instance.selectItem(index, event);

            expect(onSelectSpy.calledWith(index, event)).toBe(true);
        });

        test('should call closeDropdown() when called', () => {
            const wrapper = renderEmptyDropdown();
            const instance = wrapper.instance();

            sandbox.mock(instance).expects('closeDropdown');

            instance.selectItem(0, {});
        });
    });
});
