import React from 'react';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';

import { scrollIntoView } from '../../../utils/dom';
import { BaseSelectFieldBase as BaseSelectField } from '../BaseSelectField';
import { OVERLAY_SCROLLABLE_CLASS } from '../SelectFieldDropdown';
import { ARROW_DOWN, ARROW_UP, ENTER, ESCAPE, SPACE, TAB } from '../../../common/keyboard-events';
import CLEAR from '../constants';

import messages from '../messages';

const sandbox = sinon.sandbox.create();

jest.mock('../../../utils/dom', () => ({
    scrollIntoView: jest.fn(),
}));

describe('components/select-field/BaseSelectField', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
        jest.clearAllMocks();
    });

    const intl = {
        formatMessage: jest.fn(),
    };

    const options = [
        { displayText: 'Any Type', value: '' },
        { displayText: 'Audio', value: 'audio' },
        { displayText: 'Documents', value: 'document' },
        { displayText: 'Videos', value: 'video' },
    ];
    const onOptionSelectSpy = sandbox.stub();
    const shallowRenderSelectField = props =>
        shallow(
            <BaseSelectField
                intl={intl}
                isDisabled={false}
                onChange={() => {}}
                onOptionSelect={onOptionSelectSpy}
                options={options}
                shouldShowClearOption={false}
                {...props}
            />,
        );

    describe('renderButtonText()', () => {
        test('should render placeholder when there are no selected items and placeholder has been specified', () => {
            const wrapper = shallowRenderSelectField({
                placeholder: 'place me',
            });
            const instance = wrapper.instance();
            const buttonText = instance.renderButtonText();

            expect(buttonText).toEqual('place me');
        });

        test('should prioritize placeholder over user specified title when there are no selected items and both placeholder and title have been passed', () => {
            const wrapper = shallowRenderSelectField({
                placeholder: 'place me',
                title: 'foo',
            });
            const instance = wrapper.instance();
            const buttonText = instance.renderButtonText();

            expect(buttonText).toEqual('place me');
        });

        test('should return title prop when passed', () => {
            const wrapper = shallowRenderSelectField({ title: 'foo' });
            const instance = wrapper.instance();
            const buttonText = instance.renderButtonText();

            expect(buttonText).toEqual('foo');
        });

        test('should return auto-generated title of concatenated selected displayTexts', () => {
            const wrapper = shallowRenderSelectField({
                selectedValues: ['audio', 'document'],
            });
            const instance = wrapper.instance();
            const buttonText = instance.renderButtonText();

            expect(buttonText).toEqual('Audio, Documents');
        });
    });

    describe('renderSelectButton()', () => {
        test('should render select button should initially render with appropriate props and title text', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            const buttonWrapper = wrapper.find('PopperComponent').childAt(0);
            expect(buttonWrapper.prop('aria-activedescendant')).toEqual(null);
            expect(buttonWrapper.prop('aria-autocomplete')).toEqual('list');
            expect(buttonWrapper.prop('aria-expanded')).toBe(false);
            expect(buttonWrapper.prop('aria-owns')).toEqual(instance.selectFieldID);
            expect(buttonWrapper.prop('role')).toEqual('combobox');
            expect(buttonWrapper.prop('isDisabled')).toEqual(false);
        });

        test('should render select button with params according to state', () => {
            const wrapper = shallowRenderSelectField();
            wrapper.setState({
                isOpen: true,
                activeItemID: 'datalistitem-123',
            });

            const buttonWrapper = wrapper.find('PopperComponent').childAt(0);
            expect(buttonWrapper.length).toBe(1);
            expect(buttonWrapper.prop('aria-activedescendant')).toEqual('datalistitem-123');
            expect(buttonWrapper.prop('aria-expanded')).toBe(true);
        });

        test('should render disabled select button if isDisabled is true', () => {
            const wrapper = shallowRenderSelectField({ isDisabled: true });
            const buttonWrapper = wrapper.find('PopperComponent').childAt(0);
            expect(buttonWrapper.prop('isDisabled')).toBe(true);
        });

        test('should render additional buttonProps on select button', () => {
            const wrapper = shallowRenderSelectField({
                buttonProps: { 'data-resin-thing': 'hi' },
            });
            const buttonWrapper = wrapper.find('PopperComponent').childAt(0);
            expect(buttonWrapper.prop('data-resin-thing')).toBe('hi');
        });

        test('should send error to select button when error has some value', () => {
            const wrapper = shallowRenderSelectField({
                error: 'error',
            });
            const buttonWrapper = wrapper.find('PopperComponent').childAt(0);
            expect(buttonWrapper).toMatchSnapshot();
        });
    });

    describe('renderSearchInput', () => {
        test('should render SearchForm if shouldShowSearchInput is true', () => {
            const wrapper = shallowRenderSelectField({
                shouldShowSearchInput: true,
            });

            const searchForm = wrapper.find('SearchForm');

            expect(searchForm.length).toBe(1);
        });
    });

    describe('renderSelectOptions()', () => {
        test('should render FormattedMessage if searchText is not a substring of any of the options', () => {
            const searchText = 'abc';
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            instance.setState({
                searchText,
            });

            const message = wrapper.find(FormattedMessage);

            expect(message.props().id).toBe(messages.noResults.id);
        });

        test('should only render the option that matches the searchText substring', () => {
            const searchText = 'Audio';
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            instance.setState({
                searchText,
            });

            const itemsWrapper = wrapper.find('DatalistItem');
            const option = itemsWrapper.at(0);

            expect(itemsWrapper.length).toBe(1);
            expect(option.find('.bdl-SelectField-optionText').props().title).toEqual(searchText);
        });

        test('should render DatalistItems per option', () => {
            const wrapper = shallowRenderSelectField();
            const itemsWrapper = wrapper.find('DatalistItem');

            expect(itemsWrapper.length).toBe(4);
            // Spot check that props are correct
            expect(itemsWrapper.at(0).prop('className')).toEqual('select-option');
            expect(itemsWrapper.at(0).key()).toEqual('0');
            expect(itemsWrapper.at(2).key()).toEqual('2');
        });

        test('should render selected checkboxes for selected options', () => {
            const wrapper = shallowRenderSelectField({
                selectedValues: ['audio', 'document'],
            });
            const itemsWrapper = wrapper.find('DatalistItem');
            expect(itemsWrapper.at(0).find('IconCheck').length).toBe(0);
            expect(itemsWrapper.at(1).find('IconCheck').length).toBe(1);
            expect(itemsWrapper.at(2).find('IconCheck').length).toBe(1);
            expect(itemsWrapper.at(3).find('IconCheck').length).toBe(0);
        });

        test('should set isActive prop on current active index item', () => {
            const wrapper = shallowRenderSelectField({
                selectedValues: ['audio', 'document'],
            });
            wrapper.setState({
                activeItemIndex: 2,
            });
            const itemsWrapper = wrapper.find('DatalistItem');
            expect(itemsWrapper.at(0).prop('isActive')).toBeFalsy();
            expect(itemsWrapper.at(2).prop('isActive')).toBe(true);
        });

        test('should render separators when specified', () => {
            const wrapper = shallowRenderSelectField({
                separatorIndices: [1, 3],
            });
            const overlayWrapper = wrapper.find('PopperComponent').childAt(1);
            expect(overlayWrapper.childAt(1).prop('role')).toEqual('separator');
            expect(overlayWrapper.childAt(4).prop('role')).toEqual('separator');
        });

        test('should render option content using optionRenderer when provided', () => {
            const optionRenderer = jest.fn().mockImplementation(({ displayText, value }) => (
                <span>
                    {displayText}-{value}
                </span>
            ));
            const wrapper = shallowRenderSelectField({ optionRenderer });
            const itemsWrapper = wrapper.find('DatalistItem');

            expect(optionRenderer).toHaveBeenCalledTimes(options.length);
            expect(itemsWrapper).toMatchSnapshot();
        });

        test('should render a clear option if shouldShowClearOption is true and value is CLEAR and searchText is empty string', () => {
            const wrapper = shallowRenderSelectField({
                options: [{ displayText: 'Clear All', value: CLEAR }],
                shouldShowClearOption: true,
            });
            const itemsWrapper = wrapper.find('DatalistItem');

            expect(itemsWrapper.at(0).prop('className')).toEqual('select-option is-clear-option');
        });

        test('should not render a clear option if shouldShowClearOption is true and value is CLEAR and searchText is not empty string', () => {
            const wrapper = shallowRenderSelectField({
                options: [{ displayText: 'Clear All', value: CLEAR }],
                shouldShowClearOption: true,
            });
            wrapper.instance().setState({
                searchText: 'C',
            });

            const itemsWrapper = wrapper.find('DatalistItem');
            expect(itemsWrapper.at(0).prop('className')).not.toEqual('select-option is-clear-option');
        });
    });

    describe('render()', () => {
        test('should render a div wrapper with the specified class', () => {
            const className = 'test';
            const wrapper = shallowRenderSelectField({
                className,
            });

            expect(wrapper.hasClass('select-container')).toBe(true);
            expect(wrapper.hasClass(className)).toBe(true);
        });

        test('should render a listbox in overlay with options', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            // Dive past the ForwardRef and SelectFieldDropdown
            const overlay = wrapper
                .find('PopperComponent')
                .childAt(1)
                .dive()
                .dive();

            expect(overlay.length).toBe(1);
            expect(overlay.is('ul')).toBe(true);
            expect(overlay.prop('role')).toEqual('listbox');
            expect(overlay.prop('id')).toEqual(instance.selectFieldID);
            expect(overlay.prop('aria-multiselectable')).toBeFalsy();
        });

        test('should render a listbox with aria-multiselectable when multiple prop is passed', () => {
            const wrapper = shallowRenderSelectField({ multiple: true });

            // Dive past the ForwardRef and SelectFieldDropdown
            const overlay = wrapper
                .find('PopperComponent')
                .childAt(1)
                .dive()
                .dive();

            expect(overlay.prop('aria-multiselectable')).toBe(true);
        });

        test.each([
            [true, true],
            [false, false],
        ])(
            'should apply the correct CSS classes to the overlay element when isScrollable is %s',
            (isScrollable, result) => {
                const wrapper = shallowRenderSelectField({ isScrollable });
                // Dive past the ForwardRef and SelectFieldDropdown
                const overlay = wrapper
                    .find('PopperComponent')
                    .childAt(1)
                    .dive()
                    .dive();
                expect(overlay.hasClass(OVERLAY_SCROLLABLE_CLASS)).toBe(result);
            },
        );

        test('should apply preventOverflow modifier when isEscapedWithReference is true', () => {
            const wrapper = shallowRenderSelectField({ isEscapedWithReference: true });

            const props = wrapper.find('PopperComponent').props();
            expect(props.modifiers.preventOverflow).toEqual({ escapeWithReference: true });
        });

        test('should not apply preventOverflow modifier when isEscapedWithReference is not set', () => {
            const wrapper = shallowRenderSelectField();

            const props = wrapper.find('PopperComponent').props();
            expect(props.modifiers.preventOverflow).toBeUndefined();
        });
    });

    describe('onBlur', () => {
        test('should not call closeDropdown() when dropdown is not open', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: false });

            sandbox
                .mock(instance)
                .expects('closeDropdown')
                .never();

            wrapper.simulate('blur');
        });

        test('should call closeDropdown() when dropdown is open and event.relatedTarget.classList does not contain select-button and does not contain search-input', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'closeDropdown');
            wrapper.setState({ isOpen: true });

            const targetWithClassName = {
                relatedTarget: document.createElement('button'),
            };

            targetWithClassName.relatedTarget.className = 'not-select-button';
            instance.handleBlur(targetWithClassName);

            expect(spy).toHaveBeenCalled();
        });

        test.each`
            className
            ${'search-input'}
            ${'select-button'}
        `(
            'should not call closeDropdown when dropdown is open and event.relatedTarget.classList contains $className',
            ({ className }) => {
                const wrapper = shallowRenderSelectField();
                const instance = wrapper.instance();
                const spy = jest.spyOn(instance, 'closeDropdown');
                wrapper.setState({ isOpen: true });

                const targetWithClassName = {
                    relatedTarget: document.createElement('button'),
                };

                targetWithClassName.relatedTarget.className = className;
                instance.handleBlur(targetWithClassName);

                expect(spy).not.toHaveBeenCalled();
            },
        );

        test('should not call closeDropdown when dropdown is open and event.relatedTarget.classList contains blurExceptionClassNames', () => {
            const exception = 'foobar';
            const wrapper = shallowRenderSelectField({ blurExceptionClassNames: [exception] });
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'closeDropdown');
            wrapper.setState({ isOpen: true });

            const targetWithClassName = {
                relatedTarget: document.createElement('button'),
            };

            targetWithClassName.relatedTarget.className = exception;
            instance.handleBlur(targetWithClassName);

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('onArrowDown', () => {
        let event;
        beforeEach(() => {
            event = {
                key: ARROW_DOWN,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            };
        });

        test('should set next active item when key is arrow down and dropdown is open', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            sandbox
                .mock(instance)
                .expects('setActiveItem')
                .withArgs(0);

            wrapper.simulate('keyDown', event);
        });

        test('should reset active item when key is arrow down, dropdown is open, and the last item is active', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex: 3, isOpen: true });

            sandbox
                .mock(instance)
                .expects('setActiveItem')
                .withArgs(-1);

            wrapper.simulate('keyDown', event);
        });

        test('should open dropdown when key is arrow down and dropdown is closed', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: false });

            sandbox.mock(instance).expects('openDropdown');

            wrapper.simulate('keyDown', event);
        });
    });

    describe('onArrowUp', () => {
        let event;
        beforeEach(() => {
            event = {
                key: ARROW_UP,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            };
        });

        test('should set previous active item when key is arrow up and dropdown is open', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex: 0, isOpen: true });

            sandbox
                .mock(instance)
                .expects('setActiveItem')
                .withArgs(-1);

            wrapper.simulate('keyDown', event);
        });

        test('should correctly set active item when key is arrow up, dropdown is open, and no item is active', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            sandbox
                .mock(instance)
                .expects('setActiveItem')
                .withArgs(3);

            wrapper.simulate('keyDown', event);
        });

        test('should open dropdown when key is arrow up and dropdown is closed', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: false });

            sandbox.mock(instance).expects('openDropdown');

            wrapper.simulate('keyDown', event);
        });
    });

    describe('onEnter', () => {
        test('should not stop default event or select item when no item is active', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            sandbox
                .mock(instance)
                .expects('selectOption')
                .never();

            wrapper.simulate('keyDown', {
                key: ENTER,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should not stop default event or select item when dropdown is closed', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex: 0, isOpen: false });

            sandbox
                .mock(instance)
                .expects('selectOption')
                .never();

            wrapper.simulate('keyDown', {
                key: ENTER,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should stop default event and select item and close dropdown when an item is active and dropdown is open', () => {
            const activeItemIndex = 0;
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex, isOpen: true });

            sandbox
                .mock(instance)
                .expects('selectOption')
                .withArgs(activeItemIndex);
            sandbox.mock(instance).expects('closeDropdown');

            wrapper.simulate('keyDown', {
                key: ENTER,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should call handleClearClick if shouldShowClearOption is true and activeItemIndex === 0', () => {
            const activeItemIndex = 0;
            const wrapper = shallowRenderSelectField({
                shouldShowClearOption: true,
            });

            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex, isOpen: true });

            sandbox.mock(instance).expects('handleClearClick');

            wrapper.simulate('keyDown', {
                key: ENTER,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        const mockedSpaceEvent = { key: SPACE, target: {}, preventDefault: jest.fn(), stopPropagation: jest.fn() };
        const mockedEnterEvent = { key: ENTER, target: {}, preventDefault: jest.fn(), stopPropagation: jest.fn() };
        test.each`
            event               | condition
            ${mockedSpaceEvent} | ${'the key is SPACE'}
            ${mockedEnterEvent} | ${'key is ENTER and no item is active'}
        `(
            'should not call handleClearClick / selectOption / closeDropdown if shouldShowSearchInput is true and $condition',
            ({ event }) => {
                const wrapper = shallowRenderSelectField({
                    shouldShowSearchInput: true,
                });

                const instance = wrapper.instance();
                const handleClearClickSpy = jest.spyOn(instance, 'handleClearClick');
                const selectOptionSpy = jest.spyOn(instance, 'selectOption');
                const closeDropdownSpy = jest.spyOn(instance, 'closeDropdown');

                instance.handleKeyDown(event);
                expect(handleClearClickSpy).not.toHaveBeenCalled();
                expect(selectOptionSpy).not.toHaveBeenCalled();
                expect(closeDropdownSpy).not.toHaveBeenCalled();
            },
        );
    });

    describe('onSpacebar', () => {
        test('should not stop default event or select item when shouldShowSearchInput is true', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setProps({
                shouldShowSearchInput: true,
            });
            wrapper.setState({ isOpen: true });

            sandbox
                .mock(instance)
                .expects('selectOption')
                .never();

            wrapper.simulate('keyDown', {
                key: SPACE,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should not stop default event or select item when no item is active', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            sandbox
                .mock(instance)
                .expects('selectOption')
                .never();

            wrapper.simulate('keyDown', {
                key: SPACE,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should not stop default event or select item when dropdown is closed', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex: 0, isOpen: false });

            sandbox
                .mock(instance)
                .expects('selectOption')
                .never();

            wrapper.simulate('keyDown', {
                key: SPACE,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should stop default event and select item when an item is active and dropdown is open', () => {
            const activeItemIndex = 0;
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex, isOpen: true });

            sandbox
                .mock(instance)
                .expects('selectOption')
                .withArgs(activeItemIndex);

            wrapper.simulate('keyDown', {
                key: SPACE,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should call handleClearClick if shouldShowClearOption is true and activeItemIndex === 0', () => {
            const activeItemIndex = 0;
            const wrapper = shallowRenderSelectField({
                shouldShowClearOption: true,
            });

            const instance = wrapper.instance();
            wrapper.setState({ activeItemIndex, isOpen: true });

            sandbox.mock(instance).expects('handleClearClick');

            wrapper.simulate('keyDown', {
                key: SPACE,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });
    });

    describe('onEscape', () => {
        test('should not stop default event nor close dropdown when dropdown is closed', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            wrapper.setState({ isOpen: false });

            instanceMock.expects('closeDropdown').never();

            wrapper.simulate('keyDown', {
                key: ESCAPE,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should stop default event and close dropdown when dropdown is open', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            wrapper.setState({ isOpen: true });

            instanceMock.expects('closeDropdown');

            wrapper.simulate('keyDown', {
                key: ESCAPE,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });
    });

    describe('onTab', () => {
        test('should not close dropdown when dropdown is closed nor stop default event ', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            wrapper.setState({ isOpen: false });

            instanceMock.expects('closeDropdown').never();

            wrapper.simulate('keyDown', {
                key: TAB,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should close dropdown when dropdown is open and should not stop default event', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            wrapper.setState({ isOpen: true });

            instanceMock.expects('closeDropdown');

            wrapper.simulate('keyDown', {
                key: TAB,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });
    });

    describe('onAnyKey', () => {
        test('should set the active item based on letter', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);

            wrapper.setState({ isOpen: true });

            instanceMock.expects('setActiveItem').withArgs(2);

            wrapper.simulate('keyDown', {
                key: 'd',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });
    });

    describe('handleChange', () => {
        test('should call props.onChange with list of selected items', () => {
            const wrapper = shallowRenderSelectField();
            wrapper.setProps({
                onChange: sandbox.mock().withArgs(['what', 'is', 'up']),
            });
            wrapper.instance().handleChange(['what', 'is', 'up']);
        });
    });

    describe('handleClearClick', () => {
        test('should call handleChange with empty array', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('handleChange')
                .withArgs([]);

            instance.handleClearClick();
        });
    });

    describe('handleOptionSelect', () => {
        test('should call props.onOptionSelect with newly selected (or deselected) item', () => {
            const wrapper = shallowRenderSelectField();
            wrapper.setProps({
                onOptionSelect: sandbox.mock().withArgs('up'),
            });
            wrapper.instance().handleOptionSelect('up');
        });
    });

    describe('handleButtonClick', () => {
        test('should open dropdown when it is closed', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: false });

            sandbox.mock(instance).expects('openDropdown');

            wrapper
                .find('PopperComponent')
                .childAt(0)
                .simulate('click');
        });

        test('should close dropdown when it is open', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            sandbox.mock(instance).expects('closeDropdown');

            wrapper
                .find('PopperComponent')
                .childAt(0)
                .simulate('click');
        });
    });

    describe('handleButtonKeyDown', () => {
        [
            {
                key: SPACE,
            },
            {
                key: ENTER,
            },
        ].forEach(({ key }) => {
            test('should preventDefault() when key is space or enter and activeItemIndex != -1', () => {
                const wrapper = shallowRenderSelectField();
                wrapper.setState({ isOpen: true, activeItemIndex: 2 });

                wrapper
                    .find('PopperComponent')
                    .childAt(0)
                    .simulate('keyDown', {
                        key,
                        preventDefault: sandbox.mock(),
                        stopPropagation: sandbox.mock().never(),
                    });
            });

            test('should not preventDefault() when key is space or enter and activeItemIndex == -1', () => {
                const wrapper = shallowRenderSelectField();
                wrapper.setState({ isOpen: true, activeItemIndex: -1 });

                wrapper
                    .find('PopperComponent')
                    .childAt(0)
                    .simulate('keyDown', {
                        key,
                        preventDefault: sandbox.mock().never(),
                        stopPropagation: sandbox.mock().never(),
                    });
            });
        });

        test('should not preventDefault() when key is not space or enter', () => {
            const wrapper = shallowRenderSelectField();
            wrapper.setState({ isOpen: true, activeItemIndex: 2 });

            wrapper
                .find('PopperComponent')
                .childAt(0)
                .simulate('keyDown', {
                    key: ARROW_DOWN,
                    preventDefault: sandbox.mock().never(),
                    stopPropagation: sandbox.mock().never(),
                });
        });
    });

    describe('onOptionClick', () => {
        test('should call handleClearClick if index is 0 and shouldShowClearOption is true', () => {
            const wrapper = shallowRenderSelectField({
                options: [{ displayText: 'Clear All', value: CLEAR }],
                shouldShowClearOption: true,
            });
            wrapper.setState({
                activeItemIndex: 0,
            });
            const instance = wrapper.instance();

            sandbox.mock(instance).expects('handleClearClick');

            wrapper
                .find('DatalistItem')
                .at(0)
                .simulate('click', {
                    preventDefault: sandbox.mock(),
                });
        });

        test('should select item and close dropdown when item is clicked', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('selectOption')
                .withArgs(1);

            wrapper
                .find('DatalistItem')
                .at(1)
                .simulate('click', {
                    preventDefault: sandbox.mock(),
                });
        });
    });

    describe('onItemMouseEnter', () => {
        test('should set correct active item index when hovering over item', () => {
            const wrapper = shallowRenderSelectField();

            wrapper
                .find('DatalistItem')
                .at(2)
                .simulate('mouseEnter');

            expect(wrapper.state('activeItemIndex')).toEqual(2);
        });

        test('should set shouldScrollIntoView to false when hovering over item', () => {
            const wrapper = shallowRenderSelectField();
            wrapper.setState({ shouldScrollIntoView: true });

            wrapper
                .find('DatalistItem')
                .at(2)
                .simulate('mouseEnter');

            expect(wrapper.state('shouldScrollIntoView')).toBe(false);
        });
    });

    describe('setActiveItem()', () => {
        const wrapper = shallowRenderSelectField();
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

        test('should set shouldScrollIntoView to true by default when called', () => {
            wrapper.setState({ shouldScrollIntoView: false });
            instance.setActiveItem(1);
            expect(wrapper.state('shouldScrollIntoView')).toBe(true);
        });
    });

    describe('setActiveItemID()', () => {
        const wrapper = shallowRenderSelectField();
        const instance = wrapper.instance();
        const id = 'test123';

        test('should update activeItemID state when called', () => {
            instance.setActiveItemID(id);
            expect(wrapper.state('activeItemID')).toEqual(id);
        });

        test('should scroll into view when called and previously specified in state', () => {
            wrapper.setState({ shouldScrollIntoView: false });
            instance.setActiveItemID(id);
            expect(scrollIntoView).toHaveBeenCalledTimes(0);

            wrapper.setState({ shouldScrollIntoView: true });
            instance.setActiveItemID(id);
            expect(scrollIntoView).toHaveBeenCalledTimes(1);
        });
    });

    describe('openDropdown()', () => {
        test('should set isOpen state to true when called', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            instance.openDropdown();

            expect(wrapper.state('isOpen')).toBe(true);
        });

        test('should add document click listener', () => {
            document.addEventListener = jest.fn();
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            instance.openDropdown();

            expect(document.addEventListener).toHaveBeenCalled();
        });

        test('should call this.searchInputRef.focus() if shouldShowSearchInput is true', () => {
            const wrapper = shallowRenderSelectField({
                shouldShowSearchInput: true,
            });
            const mockSearchInputRef = {
                focus: jest.fn(),
            };
            const instance = wrapper.instance();
            instance.searchInputRef = mockSearchInputRef;

            instance.openDropdown();

            expect(mockSearchInputRef.focus).toHaveBeenCalled();
        });
    });

    describe('closeDropdown()', () => {
        test('should set isOpen state to false and reset all active item data when called', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({
                activeItemID: 'test',
                activeItemIndex: 1,
                isOpen: true,
            });

            instance.closeDropdown();

            expect(wrapper.state('isOpen')).toBe(false);
            expect(wrapper.state('activeItemID')).toEqual(null);
            expect(wrapper.state('activeItemIndex')).toEqual(-1);
            expect(wrapper.state('searchText')).toBe('');
        });

        test('should remove document click listener', () => {
            document.removeEventListener = jest.fn();
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            instance.closeDropdown();

            expect(document.removeEventListener).toHaveBeenCalled();
        });
    });

    describe('selectOption()', () => {
        test('should call selectMultiOption() when multiple prop is passed', () => {
            const wrapper = shallowRenderSelectField({ multiple: true });
            const instance = wrapper.instance();

            const index = 1;
            sandbox
                .mock(instance)
                .expects('selectMultiOption')
                .withArgs(index);

            instance.selectOption(index);
        });

        test('should call selectSingleOption() when single selecting', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            const index = 1;
            sandbox
                .mock(instance)
                .expects('selectSingleOption')
                .withArgs(index);
            sandbox.mock(instance).expects('closeDropdown');

            instance.selectOption(index);
        });
    });

    describe('getFilteredOptions', () => {
        test('should return the correct item when searchText is empty string', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            const index = 0;

            const item = instance.getFilteredOptions()[index];
            expect(item).toEqual(options[index]);
        });

        test('should return the correct item when searchText is not empty string', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            instance.setState({
                searchText: 'Audio',
            });

            const indexBeforeFilter = 1; // Index of audio option in default options array
            const indexAfterFilter = 0; // Index of audio option when user enters a search string of 'Audio'

            const item = instance.getFilteredOptions()[indexAfterFilter];
            expect(item).toEqual(options[indexBeforeFilter]);
        });

        test('should filter out the clear option if searchText is not empty string', () => {
            const wrapper = shallowRenderSelectField({
                options: [{ displayText: 'Clear All', value: CLEAR }],
            });
            const instance = wrapper.instance();
            instance.setState({
                searchText: 'Audio',
            });

            const filteredOptions = instance.getFilteredOptions();
            expect(filteredOptions.length).toBe(0);
        });

        test('should not filter out the clear option if searchText is empty string', () => {
            const wrapper = shallowRenderSelectField({
                options: [{ displayText: 'Clear All', value: CLEAR }],
            });
            const instance = wrapper.instance();

            const filteredOptions = instance.getFilteredOptions();
            expect(filteredOptions.length).toBe(1);
        });
    });

    describe('selectSingleOption()', () => {
        test('should call handleChange() when index selected was not selected previously', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();

            const index = 1;
            sandbox
                .mock(instance)
                .expects('handleChange')
                .withArgs([options[index]]);

            instance.selectSingleOption(index);
        });

        test('should call handleChange with the correct item when searchText is not empty string', () => {
            const indexBeforeFilter = 1; // Index of audio option in default options array
            const indexAfterFilter = 0; // Index of audio option after user inputs a search string of 'Audio'
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'handleChange');
            instance.setState({
                searchText: 'Audio',
            });

            instance.selectSingleOption(indexAfterFilter);

            expect(spy).toHaveBeenCalledWith([options[indexBeforeFilter]]);
        });

        test('should not call handleChange() when index selected was previously selected', () => {
            const index = 1;
            const wrapper = shallowRenderSelectField({
                selectedValues: [options[index].value],
            });
            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('handleChange')
                .never();

            instance.selectSingleOption(index);
        });

        test('should not call handleChange when index selected was previously selected and searchText is not empty string', () => {
            const indexBeforeFilter = 1; // Index of audio option in default options array
            const indexAfterFilter = 0; // Index of audio option after user inputs a search string of 'Audio'
            const wrapper = shallowRenderSelectField({
                selectedValues: [options[indexBeforeFilter].value],
            });
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'handleChange');

            instance.setState({
                searchText: 'Audio',
            });

            instance.selectSingleOption(indexAfterFilter);

            expect(spy).not.toHaveBeenCalled();
        });

        test('should call handleOptionSelect() even when index selected was previously selected', () => {
            const index = 1;
            const wrapper = shallowRenderSelectField({
                selectedValues: [options[index].value],
            });
            const instance = wrapper.instance();

            sandbox.mock(instance).expects('handleOptionSelect');

            instance.selectSingleOption(index);
        });
    });

    describe('selectMultiOption()', () => {
        test('should call selectSingleOption() when option selected is the default option', () => {
            const wrapper = shallowRenderSelectField({
                defaultValue: '',
                selectedValues: ['audio'],
            }); // default value index is 0 in this case
            const instance = wrapper.instance();

            const index = 0;
            sandbox
                .mock(instance)
                .expects('selectSingleOption')
                .withArgs(index);

            instance.selectMultiOption(index);
        });

        test('should call selectSingleOption() when no options are selected but a default is specified', () => {
            const defaultIndex = 0;
            const wrapper = shallowRenderSelectField({
                defaultValue: '',
                selectedValues: ['video'],
            }); // default value index is 0 in this case
            const instance = wrapper.instance();

            const index = 3; // Matches video option

            sandbox
                .mock(instance)
                .expects('selectSingleOption')
                .withArgs(defaultIndex);

            instance.selectMultiOption(index);
        });

        test('should call handleChange with selected values without default value', () => {
            const wrapper = shallowRenderSelectField({
                defaultValue: '',
                selectedValues: [''],
            }); // default value index is 0 in this case
            const instance = wrapper.instance();

            const index = 3; // Matches video option

            sandbox
                .mock(instance)
                .expects('handleChange')
                .withArgs([options[index]]);

            instance.selectMultiOption(index);
        });

        test('should call handleChange with selected values when called', () => {
            const wrapper = shallowRenderSelectField({
                defaultValue: '',
                selectedValues: ['audio'],
            }); // default value index is 0 in this case
            const instance = wrapper.instance();

            const index = 3; // Matches video option

            sandbox
                .mock(instance)
                .expects('handleChange')
                .withArgs([options[1], options[index]]); // audio + video

            instance.selectMultiOption(index);
        });

        test('should call handleOptionSelect with value selected when called', () => {
            const wrapper = shallowRenderSelectField({
                defaultValue: '',
                selectedValues: ['audio'],
            }); // default value index is 0 in this case
            const instance = wrapper.instance();

            const index = 3; // Matches video option

            sandbox
                .mock(instance)
                .expects('handleOptionSelect')
                .withArgs(options[index]); // audio + video

            instance.selectMultiOption(index);
        });

        test('should call handleOptionSelect with correct value when searchText is not empty string', () => {
            const indexBeforeFilter = 3; // Matches video option in original options array
            const indexAfterFilter = 0; // Matches index of video option after search filter is applied
            const wrapper = shallowRenderSelectField({
                defaultValue: '',
                selectedValues: ['audio'],
            }); // default value index is 0 in this case
            const instance = wrapper.instance();
            const spy = jest.spyOn(instance, 'handleOptionSelect');

            instance.setState({
                searchText: 'Video',
            });

            instance.selectMultiOption(indexAfterFilter);

            expect(spy).toHaveBeenCalledWith(options[indexBeforeFilter]); // audio + video
        });
    });

    describe('updateSearchText', () => {
        const wrapper = shallowRenderSelectField({
            options: [
                { displayText: 'hello', value: 0 },
                { displayText: 'goodbye', value: 1 },
            ],
        });
        const instance = wrapper.instance();

        test('should set text in state and call setActiveItem if the input text is a substring of an option', () => {
            const spy = jest.spyOn(instance, 'setActiveItem');
            const text = 'he';

            instance.updateSearchText(text);

            expect(wrapper.state('searchText')).toBe(text);
            expect(spy).toHaveBeenCalledWith(0);
        });

        test('should set text in state and not call setActiveItem if input text is not a substring of any of the options', () => {
            const spy = jest.spyOn(instance, 'setActiveItem');
            const text = 'woo';

            instance.updateSearchText(text);

            expect(wrapper.state('searchText')).toBe(text);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('handleDocumentClick', () => {
        test('should close dropdown when click occurs outside of select field', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            instance.closeDropdown = jest.fn();
            wrapper.setState({ isOpen: true });

            instance.handleDocumentClick({
                target: document.createElement('div'),
            });

            expect(instance.closeDropdown).toHaveBeenCalled();
        });

        test('should not close dropdown when click occurs on select field container', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            instance.closeDropdown = jest.fn();
            wrapper.setState({ isOpen: true });

            wrapper.simulate('click');

            expect(instance.closeDropdown).not.toHaveBeenCalled();
        });

        test('should not close dropdown when click occurs on select field dropdown', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            instance.closeDropdown = jest.fn();
            wrapper.setState({ isOpen: true });

            instance.handleDocumentClick({
                target: document.getElementById(instance.selectFieldID),
            });

            expect(instance.closeDropdown).not.toHaveBeenCalled();
        });
    });

    describe('componentWillUnmount()', () => {
        test('should remove document click listener', () => {
            document.removeEventListener = jest.fn();
            const wrapper = shallowRenderSelectField();
            wrapper.setState({ isOpen: true });
            wrapper.unmount();
            expect(document.removeEventListener).toHaveBeenCalled();
        });
    });
});
