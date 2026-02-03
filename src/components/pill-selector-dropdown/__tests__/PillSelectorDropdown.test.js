import * as React from 'react';
import { List, Record } from 'immutable';

import PillSelectorDropdown from '../PillSelectorDropdown';

describe('components/pill-selector-dropdown/PillSelectorDropdown', () => {
    const OptionRecord = Record({
        text: '',
        value: '',
    });

    const getWrapper = (props, children) => {
        const options = children || (
            <>
                <div>Option 1</div>
                <div>Option 2</div>
            </>
        );
        return shallow(
            <PillSelectorDropdown
                inputProps={{ 'aria-label': 'test' }}
                onInput={jest.fn()}
                onRemove={jest.fn()}
                onSelect={jest.fn()}
                {...props}
            >
                {options}
            </PillSelectorDropdown>,
        );
    };

    describe('render()', () => {
        test('should render selector dropdown', () => {
            const className = 'test';
            const children = 'hi';
            const wrapper = getWrapper({ className }, children);
            const instance = wrapper.instance();
            const selectorDropdown = wrapper.find('SelectorDropdown');

            expect(selectorDropdown.is('SelectorDropdown')).toBe(true);
            expect(selectorDropdown.hasClass('bdl-PillSelectorDropdown')).toBe(true);
            expect(selectorDropdown.hasClass(className)).toBe(true);
            expect(selectorDropdown.prop('onEnter')).toEqual(instance.handleEnter);
            expect(selectorDropdown.prop('onSelect')).toEqual(instance.handleSelect);
            expect(selectorDropdown.contains(children)).toBe(true);
        });

        test('should render pill selector', () => {
            const inputProps = { 'aria-label': 'test' };
            const wrapper = getWrapper({ inputProps });
            wrapper.setState({ inputValue: 'value' });
            const pillSelector = shallow(wrapper.find('SelectorDropdown').prop('selector'));
            const wrapperInstance = wrapper.instance();
            expect(pillSelector.prop('onInput')).toEqual(wrapperInstance.handleInput);
            expect(pillSelector.prop('onPaste')).toEqual(wrapperInstance.handlePaste);
            expect(pillSelector.dive().instance().props.value).toEqual('value');
        });

        test('should pass tooltipWrapperClassName to PillSelector when provided', () => {
            const tooltipWrapperClassName = 'custom-tooltip-wrapper';
            const wrapper = getWrapper({ tooltipWrapperClassName });
            const selectorElement = wrapper.find('SelectorDropdown').prop('selector');

            expect(selectorElement.props.tooltipWrapperClassName).toBe(tooltipWrapperClassName);
        });

        test('should render disabled pill selector', () => {
            const wrapper = getWrapper({ disabled: true });

            wrapper.setState();

            expect(wrapper).toMatchSnapshot();
        });

        test('should call addPillsFromInput when pill selector is blurred', () => {
            const wrapper = getWrapper();
            wrapper.setState({ inputValue: 'value' });
            const instance = wrapper.instance();
            const addPillsFromInputMock = jest.fn();
            instance.addPillsFromInput = addPillsFromInputMock;
            instance.handleBlur();
            expect(addPillsFromInputMock).toHaveBeenCalledTimes(1);
        });

        test.each([
            ['test', true],
            ['', false],
        ])('should render Label component when label exists', (value, expected) => {
            const labelProp = { label: value };
            const wrapper = getWrapper(labelProp);
            expect(wrapper.exists('Label')).toBe(expected);
        });
    });

    describe('parsePills', () => {
        test('should return a formatted map of pills', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const inputValues = 'value1, value2,value3';
            wrapper.setState({ inputValue: inputValues });

            const result = instance.parsePills(inputValues);
            expect(result).toEqual([
                { displayText: 'value1', text: 'value1', value: 'value1' },
                { displayText: 'value2', text: 'value2', value: 'value2' },
                { displayText: 'value3', text: 'value3', value: 'value3' },
            ]);
        });

        test('should only return pills that pass validator if one is provided and allowInvalidPills is false', () => {
            const validator = text => {
                // W3C type="email" input validation
                const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                return pattern.test(text);
            };

            const wrapper = getWrapper({ validator });
            const instance = wrapper.instance();
            const inputValues = 'aaron@example.com, bademail,hello@gmail.com';
            wrapper.setState({
                inputValue: inputValues,
            });

            const result = instance.parsePills(inputValues);
            expect(result).toEqual([
                { displayText: 'aaron@example.com', text: 'aaron@example.com', value: 'aaron@example.com' },
                { displayText: 'hello@gmail.com', text: 'hello@gmail.com', value: 'hello@gmail.com' },
            ]);
        });

        test('should ignore validator if one is provided but allowInvalidPills is true', () => {
            const validator = text => {
                // W3C type="email" input validation
                const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                return pattern.test(text);
            };

            const wrapper = getWrapper({ allowInvalidPills: true, validator });

            const instance = wrapper.instance();
            const inputValues = 'aaron@example.com, bademail, hello@gmail.com';
            wrapper.setState({
                inputValue: inputValues,
            });

            const result = instance.parsePills(inputValues);
            expect(result).toEqual([
                { displayText: 'aaron@example.com', text: 'aaron@example.com', value: 'aaron@example.com' },
                { displayText: 'bademail', text: 'bademail', value: 'bademail' },
                { displayText: 'hello@gmail.com', text: 'hello@gmail.com', value: 'hello@gmail.com' },
            ]);
        });

        test('should not map pills to options when custom parser returns array of objects', () => {
            const wrapper = getWrapper({ allowInvalidPills: true });
            wrapper.setState({ inputValue: 'a,b' });

            const { parsePills } = wrapper.instance();
            const stringParser = input => input.split(',');
            const optionParser = input =>
                input.split(',').map(token => ({
                    customProp: token,
                }));

            wrapper.setProps({ parseItems: stringParser });
            expect(parsePills('a,b')).toStrictEqual([
                {
                    displayText: 'a',
                    text: 'a',
                    value: 'a',
                },
                {
                    displayText: 'b',
                    text: 'b',
                    value: 'b',
                },
            ]);

            wrapper.setProps({ parseItems: optionParser });
            expect(parsePills('a,b')).toStrictEqual([
                {
                    customProp: 'a',
                },
                {
                    customProp: 'b',
                },
            ]);
        });
    });

    describe('addPillsFromInput', () => {
        test('should not call onSelect and onPillCreate if allowCustomPills prop is not provided', () => {
            const onPillCreateMock = jest.fn();
            const onSelectMock = jest.fn();
            const wrapper = getWrapper({ onPillCreate: onPillCreateMock, onSelect: onSelectMock });
            const instance = wrapper.instance();
            const inputValue = 'value';
            wrapper.setState({ inputValue });

            instance.addPillsFromInput(inputValue);
            expect(onPillCreateMock).not.toHaveBeenCalled();
            expect(onSelectMock).not.toHaveBeenCalled();
        });

        test('should "select" each pill, create a user pill, reset inputValue, and not call props.validateForError if valid pills exist', () => {
            const pills = [
                { text: 'value1', value: 'value1' },
                { text: 'value2', value: 'value2' },
                { text: 'value3', value: 'value3' },
            ];
            const onInputMock = jest.fn();
            const onPillCreateMock = jest.fn();
            const onSelectMock = jest.fn();
            const validateForErrorMock = jest.fn();
            const wrapper = getWrapper({
                allowCustomPills: true,
                onInput: onInputMock,
                onPillCreate: onPillCreateMock,
                onSelect: onSelectMock,
                validateForError: validateForErrorMock,
            });

            const instance = wrapper.instance();
            instance.parsePills = jest.fn().mockReturnValue(pills);
            instance.addPillsFromInput();

            expect(wrapper.state('inputValue')).toEqual('');
            expect(onInputMock).toBeCalledWith('');
            expect(onPillCreateMock).toBeCalledWith(pills);
            expect(onSelectMock).toBeCalledWith(pills);
            expect(validateForErrorMock).not.toBeCalled();
        });

        test('should call props.validateForError if no pills were added but input exists', () => {
            const pills = [];
            const selectedOptions = [{ text: 'a pill', value: 'pill' }];
            const onInputMock = jest.fn();
            const onPillCreateMock = jest.fn();
            const onSelectMock = jest.fn();
            const validateForErrorMock = jest.fn();
            const wrapper = getWrapper({
                allowCustomPills: true,
                onInput: onInputMock,
                onPillCreate: onPillCreateMock,
                onSelect: onSelectMock,
                selectedOptions,
                validateForError: validateForErrorMock,
            });

            const instance = wrapper.instance();
            wrapper.setState({ inputValue: 'value1' });
            instance.parsePills = jest.fn().mockReturnValue(pills);
            instance.addPillsFromInput();

            expect(onInputMock).not.toBeCalled();
            expect(onPillCreateMock).not.toBeCalled();
            expect(onSelectMock).not.toBeCalled();
            expect(validateForErrorMock).toBeCalled();
        });

        test('should call props.validateForError if no pills were added and no options are selected', () => {
            const pills = [];
            const selectedOptions = [];
            const onInputMock = jest.fn();
            const onPillCreateMock = jest.fn();
            const onSelectMock = jest.fn();
            const validateForErrorMock = jest.fn();
            const wrapper = getWrapper({
                allowCustomPills: true,
                onInput: onInputMock,
                onPillCreate: onPillCreateMock,
                onSelect: onSelectMock,
                selectedOptions,
                validateForError: validateForErrorMock,
            });

            const instance = wrapper.instance();
            wrapper.setState({ inputValue: '' });
            instance.parsePills = jest.fn().mockReturnValue(pills);
            instance.addPillsFromInput();

            expect(onInputMock).not.toBeCalled();
            expect(onPillCreateMock).not.toBeCalled();
            expect(onSelectMock).not.toBeCalled();
            expect(validateForErrorMock).toBeCalled();
        });

        test('should not call props.validateForError if no pills were added, input is empty, and options are selected', () => {
            const pills = [];
            const selectedOptions = [{ text: 'a pill', value: 'pill' }];
            const onInputMock = jest.fn();
            const onPillCreateMock = jest.fn();
            const onSelectMock = jest.fn();
            const validateForErrorMock = jest.fn();
            const wrapper = getWrapper({
                allowCustomPills: true,
                onInput: onInputMock,
                onPillCreate: onPillCreateMock,
                onSelect: onSelectMock,
                selectedOptions,
                validateForError: validateForErrorMock,
            });

            const instance = wrapper.instance();
            const inputValue = '';
            wrapper.setState({ inputValue });
            instance.parsePills = jest.fn().mockReturnValue(pills);
            instance.addPillsFromInput(inputValue);

            expect(onInputMock).not.toBeCalled();
            expect(onPillCreateMock).not.toBeCalled();
            expect(onSelectMock).not.toBeCalled();
            expect(validateForErrorMock).not.toBeCalled();
        });

        test('should clear unmatched input after attempting to add pills when shouldClearUnmatchedInput is set to true', () => {
            const onPillCreateMock = jest.fn();
            const onSelectMock = jest.fn();
            const wrapper = getWrapper({
                allowCustomPills: true,
                onPillCreate: onPillCreateMock,
                onSelect: onSelectMock,
            });

            const onInput = jest.fn();
            const initialValue = 'abc';
            const { addPillsFromInput } = wrapper.instance();

            wrapper.setProps({ onInput, parseItems: () => [] });
            wrapper.setState({ inputValue: initialValue });

            wrapper.setProps({ shouldClearUnmatchedInput: false });
            addPillsFromInput(initialValue);
            expect(wrapper.state().inputValue).toBe(initialValue);
            expect(onInput).toHaveBeenCalledTimes(0);

            wrapper.setProps({ shouldClearUnmatchedInput: true });
            addPillsFromInput(initialValue);
            expect(wrapper.state().inputValue).toBe('');
            expect(onInput).toHaveBeenCalledWith('');
            expect(onInput).toHaveBeenCalledTimes(1);

            expect(onPillCreateMock).not.toBeCalled();
            expect(onSelectMock).not.toBeCalled();
        });
    });

    describe('handleInput', () => {
        test('should update inputValue state when called', () => {
            const wrapper = getWrapper();

            const instance = wrapper.instance();

            instance.handleInput({ target: { value: 'test' } });

            expect(wrapper.state('inputValue')).toEqual('test');
        });

        test('should call onInput() with value when called', () => {
            const onInputMock = jest.fn();
            const wrapper = getWrapper({ onInput: onInputMock });
            const instance = wrapper.instance();

            instance.handleInput({ target: { value: 'test' } });

            expect(onInputMock).toBeCalledWith('test', { target: { value: 'test' } });
        });
    });

    describe('handleEnter()', () => {
        test('should do nothing when in composition mode', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const event = { preventDefault: jest.fn() };
            instance.addPillsFromInput = jest.fn();
            instance.handleCompositionStart();
            instance.handleEnter(event);
            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(instance.addPillsFromInput).not.toHaveBeenCalled();
        });

        test('should call addPillsFromInput and prevent default when called', () => {
            const wrapper = getWrapper();
            const addPillsFromInputMock = jest.fn();
            const preventDefaultMock = jest.fn();
            const instance = wrapper.instance();

            instance.addPillsFromInput = addPillsFromInputMock;

            instance.handleEnter({
                preventDefault: preventDefaultMock,
            });

            expect(addPillsFromInputMock).toBeCalledTimes(1);
            expect(preventDefaultMock).toBeCalled();
        });
    });

    describe('handlePaste', () => {
        test('should not call onPillCreate prop method with invalid input', () => {
            const onInputMock = jest.fn();
            const onPillCreateMock = jest.fn();
            const mockPastedValue = 'pastedValue';
            const mockEvent = {
                clipboardData: {
                    getData: () => {
                        return mockPastedValue;
                    },
                },
                preventDefault: jest.fn(),
            };
            const wrapper = getWrapper({
                allowCustomPills: true,
                allowInvalidPills: false,
                onInput: onInputMock,
                onPillCreate: onPillCreateMock,
                validator: () => false,
            });
            const instance = wrapper.instance();

            instance.handlePaste(mockEvent);

            expect(onInputMock).toHaveBeenCalledWith(mockPastedValue, mockEvent);
            expect(onPillCreateMock).not.toHaveBeenCalled();
        });

        test('should call onPillCreate prop method with valid input', () => {
            const onInputMock = jest.fn();
            const onPillCreateMock = jest.fn();
            const mockPastedValue = 'test@example.com';
            const mockEvent = {
                clipboardData: {
                    getData: () => {
                        return mockPastedValue;
                    },
                },
                preventDefault: jest.fn(),
            };
            const wrapper = getWrapper({
                allowCustomPills: true,
                onInput: onInputMock,
                onPillCreate: onPillCreateMock,
            });
            const instance = wrapper.instance();

            instance.handlePaste(mockEvent);

            expect(onInputMock).toHaveBeenCalledWith(mockPastedValue, mockEvent);
            expect(onPillCreateMock).toHaveBeenCalled();
        });
    });

    describe('handleSelect', () => {
        test('should call onSelect() with option and event when called', () => {
            const option = { text: 'b', value: 'b' };
            const options = [{ text: 'a', value: 'a' }, option];
            const onSelectMock = jest.fn();
            const onPillCreateMock = jest.fn();
            const wrapper = getWrapper({
                onSelect: onSelectMock,
                onPillCreate: onPillCreateMock,
                selectorOptions: options,
            });
            const instance = wrapper.instance();
            const event = { type: 'click' };

            instance.handleSelect(1, event);

            expect(onSelectMock).toBeCalledWith([option], event);
            expect(onPillCreateMock).toBeCalledWith([option]);
        });

        test('should call onSelect() with immutable option and event when called', () => {
            const option = new OptionRecord({ text: 'b', value: 'b' });
            const options = new List([new OptionRecord({ text: 'a', value: 'a' }), option]);
            const onSelectMock = jest.fn();
            const onPillCreateMock = jest.fn();
            const wrapper = getWrapper({
                onSelect: onSelectMock,
                onPillCreate: onPillCreateMock,
                selectorOptions: options,
            });
            const instance = wrapper.instance();
            const event = { type: 'click' };

            instance.handleSelect(1, event);

            expect(onSelectMock).toBeCalledWith([option], event);
            expect(onPillCreateMock).toBeCalledWith([option]);
        });

        test('should call handleInput() with empty string value when called', () => {
            const options = [{ text: 'a', value: 'a' }];
            const handleInputMock = jest.fn();
            const wrapper = getWrapper({ selectorOptions: options });
            const instance = wrapper.instance();
            instance.handleInput = handleInputMock;
            instance.handleSelect(0, {});
            expect(handleInputMock).toBeCalledWith({ target: { value: '' } });
        });
    });

    describe('handleBlur', () => {
        test('should call onBlur() and addPillsFromInput() when underlying input is blurred', () => {
            const onBlur = jest.fn();
            const wrapper = getWrapper({ onBlur });
            const instance = wrapper.instance();
            const event = { type: 'blur' };

            instance.addPillsFromInput = jest.fn();
            instance.handleBlur(event);

            expect(instance.addPillsFromInput).toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalled();
        });
    });

    describe('handleCompositionStart()', () => {
        test('should set composition mode', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleCompositionStart();
            expect(instance.setState).toHaveBeenCalledWith({ isInCompositionMode: true });
        });
    });

    describe('handleCompositionEnd()', () => {
        test('should unset composition mode', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleCompositionEnd();
            expect(instance.setState).toHaveBeenCalledWith({ isInCompositionMode: false });
        });
    });
});
