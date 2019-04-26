// @flow

import React from 'react';
import TextAreaField from '../TextAreaField';

describe('components/text-area/TextAreaField', () => {
    const getWrapper = (props = {}) => shallow(<TextAreaField {...props} />);

    test('should render properly', () => {
        const wrapper = getWrapper({
            field: {
                name: 'textarea',
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
                name: 'textarea',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {
                errors: {
                    textarea: 'error',
                },
                touched: {
                    textarea: true,
                },
            },
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should hide optional label when required', () => {
        const wrapper = getWrapper({
            field: {
                name: 'textarea',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {
                errors: {
                    textarea: 'error',
                },
                touched: {
                    textarea: true,
                },
            },
            isRequired: true,
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should forward innerRef to textareaRef', () => {
        const wrapper = getWrapper({
            field: {
                name: 'textarea',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {
                errors: {
                    textarea: 'error',
                },
                touched: {
                    textarea: true,
                },
            },
            isRequired: true,
            label: 'Enter things',
            innerRef: 'ref',
        });
        expect(wrapper).toMatchSnapshot();
    });
});
