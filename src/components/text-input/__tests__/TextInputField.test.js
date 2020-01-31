// @flow

import React from 'react';
import TextInputField from '../TextInputField';

describe('components/text-input/TextInputField', () => {
    const getWrapper = (props = {}) => shallow(<TextInputField {...props} />);

    test('should render properly', () => {
        const wrapper = getWrapper({
            field: {
                name: 'input',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {},
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render properly with error', () => {
        const wrapper = getWrapper({
            field: {
                name: 'input',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {
                errors: {
                    input: 'error',
                },
                touched: {
                    input: true,
                },
            },
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should hide optional label when required', () => {
        const wrapper = getWrapper({
            field: {
                name: 'input',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {
                errors: {
                    input: 'error',
                },
                touched: {
                    input: true,
                },
            },
            isRequired: true,
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should forward innerRef to inputRef', () => {
        const wrapper = getWrapper({
            field: {
                name: 'input',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {
                errors: {
                    input: 'error',
                },
                touched: {
                    input: true,
                },
            },
            isRequired: true,
            label: 'Enter things',
            innerRef: 'ref',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
