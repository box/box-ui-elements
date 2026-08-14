import * as React from 'react';
import { shallow } from 'enzyme';

import TextAreaField from '../TextAreaField';

describe('components/text-area/TextAreaField', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getWrapper = (props: any = {}) => shallow(<TextAreaField {...props} />);

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
