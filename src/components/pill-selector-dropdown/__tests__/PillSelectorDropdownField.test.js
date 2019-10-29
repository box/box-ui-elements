// @flow

import React from 'react';
import defaultInputParser from '../defaultInputParser';
import PillSelectorDropdownField from '../PillSelectorDropdownField';

jest.mock('../defaultInputParser', () => jest.fn());

describe('components/pill-selector-dropdown/PillSelectorDropdownField', () => {
    const getWrapper = props => shallow(<PillSelectorDropdownField field={{}} form={{}} {...props} />);

    test('should render PillSelectorDropdown with default dropdown renderer', () => {
        const wrapper = getWrapper({
            options: [
                { displayText: 'value1', value: 'value1' },
                { displayText: 'value2', value: 'value2' },
                { displayText: 'value3', value: 'value3' },
            ],
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render error when touched', () => {
        const wrapper = getWrapper({
            field: {
                name: 'pill',
            },
            form: {
                errors: {
                    pill: 'error',
                },
                touched: {
                    pill: true,
                },
            },
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render PillSelectorDropdown with no dropdown when no options', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    describe('createFakeEventTarget()', () => {
        test('should return a event target like object', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            expect(instance.createFakeEventTarget('foo', 'bar')).toEqual({
                target: { name: 'foo', value: 'bar' },
            });
        });
    });

    describe('handleInput()', () => {
        test('should set input value in state', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleInput('foo');
            expect(instance.setState).toHaveBeenCalledWith({ inputText: 'foo' });
        });

        test('should call handleBlur() when input text is cleared out', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.handleBlur = jest.fn();
            instance.setState = jest.fn();
            instance.forceUpdate();
            instance.handleInput('', 'foo');
            expect(instance.setState).toHaveBeenCalledWith({ inputText: '' });
            expect(instance.handleBlur).toHaveBeenCalledWith('foo');
        });

        test('should be called when underlying pill selector onInput is called', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.handleInput = jest.fn();
            instance.forceUpdate();
            wrapper.prop('onInput')();
            expect(instance.handleInput).toHaveBeenCalled();
        });

        test('should call its onInput prop when provided', () => {
            const onInput = jest.fn();
            const wrapper = getWrapper({ onInput });
            const instance = wrapper.instance();
            instance.handleInput('foo');
            expect(onInput).toHaveBeenCalledWith('foo', undefined);
        });
    });

    describe('handleSelect()', () => {
        test('should call onChange with added values', () => {
            const onChange = jest.fn();
            const wrapper = getWrapper({
                field: {
                    name: 'pill',
                    onChange,
                    value: [{ displayText: 'foo' }],
                },
            });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleSelect([{ displayText: 'bar' }]);
            expect(onChange).toHaveBeenCalledWith({
                target: { name: 'pill', value: [{ displayText: 'foo' }, { displayText: 'bar' }] },
            });
        });

        test('should not add new values if they are just empty spaces', () => {
            const onChange = jest.fn();
            const wrapper = getWrapper({
                field: {
                    name: 'pill',
                    onChange,
                    value: [{ displayText: 'foo' }],
                },
            });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleSelect([{ displayText: '   ' }, { displayText: '   ' }]);
            expect(onChange).toHaveBeenCalledWith({
                target: { name: 'pill', value: [{ displayText: 'foo' }] },
            });
        });

        test('should be called when onSelect is called', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.handleSelect = jest.fn();
            instance.forceUpdate();
            wrapper.prop('onSelect')();
            expect(instance.handleSelect).toHaveBeenCalled();
        });
    });

    describe('handleRemove()', () => {
        test('should call onChange with updated values', () => {
            const onChange = jest.fn();
            const wrapper = getWrapper({
                field: {
                    name: 'pill',
                    onChange,
                    value: ['foo', 'bar'],
                },
            });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleRemove('bar', 1);
            expect(onChange).toHaveBeenCalledWith({ target: { name: 'pill', value: ['foo'] } });
        });

        test('should be called when onRemove is called', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.handleRemove = jest.fn();
            instance.forceUpdate();
            wrapper.prop('onRemove')();
            expect(instance.handleRemove).toHaveBeenCalled();
        });

        test('should default value to empty array when its not been initialized', () => {
            const onChange = jest.fn();
            const wrapper = getWrapper({
                field: {
                    name: 'pill',
                    onChange,
                },
            });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleRemove('bar', 1);
            expect(onChange).toHaveBeenCalledWith({ target: { name: 'pill', value: [] } });
        });
    });

    describe('handleParseItems()', () => {
        const options = [
            {
                displayText: 'displayText1',
                value: 'value1',
            },
            {
                displayText: 'displayText2',
                value: 'value2',
            },
        ];

        test('should call default parser when inputParser is not provided', () => {
            const field = { value: [options[0]] };
            const wrapper = getWrapper({ inputParser: undefined, options, field });

            wrapper.instance().handleParseItems('abc');

            expect(defaultInputParser).toHaveBeenCalledTimes(1);
            expect(defaultInputParser).toHaveBeenCalledWith('abc', options, field.value);
        });

        test('should call inputParser with inputValue, options and selectedOptions', () => {
            const inputParser = jest.fn();
            const field = { value: [options[0]] };
            const wrapper = getWrapper({ inputParser, options, field });

            wrapper.instance().handleParseItems('abc');

            expect(inputParser).toHaveBeenCalledTimes(1);
            expect(inputParser).toHaveBeenCalledWith('abc', options, field.value);
        });

        test('should default value to empty array when its not been initialized', () => {
            const inputParser = jest.fn();
            const field = {};
            const wrapper = getWrapper({ inputParser, options, field });

            wrapper.instance().handleParseItems('abc');

            expect(inputParser).toHaveBeenCalledTimes(1);
            expect(inputParser).toHaveBeenCalledWith('abc', options, []);
        });
    });

    describe('handleBlur()', () => {
        test('should call onBlur with blur event', () => {
            const onBlur = jest.fn();
            const wrapper = getWrapper({
                field: {
                    onBlur,
                },
            });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleBlur('foo');
            expect(onBlur).toHaveBeenCalledWith('foo');
        });

        test('should call onBlur with fake event target when original event is missing', () => {
            const onBlur = jest.fn();
            const wrapper = getWrapper({
                field: {
                    name: 'pill',
                    onBlur,
                },
            });
            const instance = wrapper.instance();
            instance.setState = jest.fn();
            instance.handleBlur();
            expect(onBlur).toHaveBeenCalledWith({ target: { name: 'pill' } });
        });

        test('should be called when onBlur is called', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            instance.handleBlur = jest.fn();
            instance.forceUpdate();
            wrapper.prop('onBlur')();
            expect(instance.handleBlur).toHaveBeenCalled();
        });
    });
});
