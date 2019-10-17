import React from 'react';

import { EditableURLBase as EditableURL, VALUE_MISSING, TYPE_MISMATCH } from '../EditableURL';

describe('features/item-details/EditableURL', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <EditableURL
                intl={{ formatMessage: message => message.id }}
                onValidURLChange={() => {}}
                value="box.com"
                {...props}
            />,
        );

    describe('componentDidUpdate()', () => {
        test('should update state value when prop value changes', () => {
            const value = 'http://box.com';
            const wrapper = getWrapper();
            wrapper.setProps({ value });

            expect(wrapper.state('value')).toBe(value);
        });
    });

    describe('handleBlur()', () => {
        test('should call onValidURLChange() when input is valid', () => {
            const onValidURLChange = jest.fn();
            const wrapper = getWrapper({
                onValidURLChange,
            });
            wrapper.setState({ value: 'https://box.com' });
            const instance = wrapper.instance();
            instance.inputEl = { validity: { valid: true } };

            wrapper.instance().handleBlur();

            expect(onValidURLChange).toHaveBeenCalledWith('https://box.com');
        });

        test('should set required error and not call onValidURLChange() when input is missing value', () => {
            const onValidURLChange = jest.fn();
            const wrapper = getWrapper({
                onValidURLChange,
            });
            const instance = wrapper.instance();
            instance.inputEl = {
                validity: { valid: false, valueMissing: true },
            };

            wrapper.instance().handleBlur();

            expect(wrapper.state('error')).toBe(VALUE_MISSING);
            expect(onValidURLChange).not.toHaveBeenCalled();
        });

        test('should set url error and not call onValidURLChange() when input is not a url', () => {
            const onValidURLChange = jest.fn();
            const wrapper = getWrapper({
                onValidURLChange,
            });
            const instance = wrapper.instance();
            instance.inputEl = {
                validity: { valid: false, valueMissing: false },
            };

            wrapper.instance().handleBlur();

            expect(wrapper.state('error')).toBe(TYPE_MISMATCH);
            expect(onValidURLChange).not.toHaveBeenCalled();
        });
    });

    describe('handleChange()', () => {
        test('should update state value when called', () => {
            const url = 'box';
            const wrapper = getWrapper();

            wrapper.instance().handleChange({ currentTarget: { value: url } });

            expect(wrapper.state('value')).toBe(url);
        });
    });

    describe('handleFocus()', () => {
        test('should reset error state when called', () => {
            const wrapper = getWrapper();
            wrapper.setState({ error: VALUE_MISSING });

            wrapper.instance().handleFocus();

            expect(wrapper.state('error')).toBe('');
        });
    });

    describe('render()', () => {
        test('should render default component', () => {
            const wrapper = getWrapper();

            expect(wrapper).toMatchSnapshot();
        });

        [
            {
                error: VALUE_MISSING,
            },
            {
                error: TYPE_MISMATCH,
            },
        ].forEach(({ error }) => {
            test('should render component with state error and value', () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    error,
                    value: 'box',
                });

                expect(wrapper).toMatchSnapshot();
            });
        });
    });
});
