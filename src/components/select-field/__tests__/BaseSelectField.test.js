import React from 'react';
import sinon from 'sinon';

import { scrollIntoView } from '../../../utils/dom';
import BaseSelectField, { OVERLAY_SCROLLABLE_CLASS } from '../BaseSelectField';

const sandbox = sinon.sandbox.create();

jest.mock('../../../utils/dom', () => ({
    scrollIntoView: jest.fn(),
}));

describe('components/select-field/BaseSelectField', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
        jest.clearAllMocks();
    });

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
                isDisabled={false}
                onChange={() => {}}
                onOptionSelect={onOptionSelectSpy}
                options={options}
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

            const buttonWrapper = wrapper.find('SelectButton');
            expect(buttonWrapper.length).toBe(1);
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

            const buttonWrapper = wrapper.find('SelectButton');
            expect(buttonWrapper.length).toBe(1);
            expect(buttonWrapper.prop('aria-activedescendant')).toEqual('datalistitem-123');
            expect(buttonWrapper.prop('aria-expanded')).toBe(true);
        });

        test('should render disabled select button if isDisabled is true', () => {
            const wrapper = shallowRenderSelectField({ isDisabled: true });
            const buttonWrapper = wrapper.find('SelectButton');
            expect(buttonWrapper.prop('isDisabled')).toBe(true);
        });

        test('should render additional buttonProps on select button', () => {
            const wrapper = shallowRenderSelectField({
                buttonProps: { 'data-resin-thing': 'hi' },
            });
            const buttonWrapper = wrapper.find('SelectButton');
            expect(buttonWrapper.prop('data-resin-thing')).toBe('hi');
        });

        test('should send error to select button when error has some value', () => {
            const wrapper = shallowRenderSelectField({
                error: 'error',
            });
            const buttonWrapper = wrapper.find('SelectButton');
            expect(buttonWrapper).toMatchSnapshot();
        });
    });

    describe('renderSelectOptions()', () => {
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
            const overlayWrapper = wrapper.find('.overlay');
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

            const overlayWrapper = wrapper.find('.overlay-wrapper');
            const overlay = wrapper.find('.overlay');

            expect(overlayWrapper.length).toBe(1);
            expect(overlayWrapper.hasClass('is-visible')).toBe(false);
            expect(overlay.length).toBe(1);
            expect(overlay.is('ul')).toBe(true);
            expect(overlay.prop('role')).toEqual('listbox');
            expect(overlay.prop('id')).toEqual(instance.selectFieldID);
            expect(overlay.prop('aria-multiselectable')).toBeFalsy();
        });

        test('should render a listbox with aria-multiselectable when multiple prop is passed', () => {
            const wrapper = shallowRenderSelectField({ multiple: true });

            const overlay = wrapper.find('.overlay');

            expect(overlay.prop('aria-multiselectable')).toBe(true);
        });

        test.each([[true, true], [false, false]])(
            'should apply the correct CSS classes to the overlay element when isScrollable is %s',
            (isScrollable, result) => {
                const wrapper = shallowRenderSelectField({ isScrollable });
                const overlay = wrapper.find('.overlay');
                expect(overlay.hasClass(OVERLAY_SCROLLABLE_CLASS)).toBe(result);
            },
        );
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

        test('should call closeDropdown() when dropdown is open', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            sandbox.mock(instance).expects('closeDropdown');

            wrapper.simulate('blur');
        });
    });

    describe('onArrowDown', () => {
        let event;
        beforeEach(() => {
            event = {
                key: 'ArrowDown',
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
                key: 'ArrowUp',
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
                key: 'Enter',
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
                key: 'Enter',
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
                key: 'Enter',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });
    });

    describe('onSpacebar', () => {
        test('should not stop default event or select item when no item is active', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            sandbox
                .mock(instance)
                .expects('selectOption')
                .never();

            wrapper.simulate('keyDown', {
                key: ' ',
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
                key: ' ',
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
                key: ' ',
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
                key: 'Escape',
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
                key: 'Escape',
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

            wrapper.find('SelectButton').simulate('click');
        });

        test('should close dropdown when it is open', () => {
            const wrapper = shallowRenderSelectField();
            const instance = wrapper.instance();
            wrapper.setState({ isOpen: true });

            sandbox.mock(instance).expects('closeDropdown');

            wrapper.find('SelectButton').simulate('click');
        });
    });

    describe('handleButtonKeyDown', () => {
        [
            {
                key: ' ',
            },
            {
                key: 'Enter',
            },
        ].forEach(({ key }) => {
            test('should preventDefault() when key is space or enter and activeItemIndex != -1', () => {
                const wrapper = shallowRenderSelectField();
                wrapper.setState({ isOpen: true, activeItemIndex: 2 });

                wrapper.find('SelectButton').simulate('keyDown', {
                    key,
                    preventDefault: sandbox.mock(),
                    stopPropagation: sandbox.mock().never(),
                });
            });

            test('should not preventDefault() when key is space or enter and activeItemIndex == -1', () => {
                const wrapper = shallowRenderSelectField();
                wrapper.setState({ isOpen: true, activeItemIndex: -1 });

                wrapper.find('SelectButton').simulate('keyDown', {
                    key,
                    preventDefault: sandbox.mock().never(),
                    stopPropagation: sandbox.mock().never(),
                });
            });
        });

        test('should not preventDefault() when key is not space or enter', () => {
            const wrapper = shallowRenderSelectField();
            wrapper.setState({ isOpen: true, activeItemIndex: 2 });

            wrapper.find('SelectButton').simulate('keyDown', {
                key: 'ArrowDown',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });
    });

    describe('onOptionClick', () => {
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

    describe('onOptionMouseDown', () => {
        test('should prevent default when mousedown on overlay occurs to prevent blur', () => {
            const wrapper = shallowRenderSelectField();
            wrapper.find('.overlay').simulate('mouseDown', {
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
    });
});
