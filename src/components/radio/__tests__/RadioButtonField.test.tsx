import React from 'react';
import { shallow } from 'enzyme';

import RadioButtonField, { RadioButtonFieldProps } from '../RadioButtonField';

describe('components/radio/RadioButtonField', () => {
    const getWrapper = (props: RadioButtonFieldProps) => shallow(<RadioButtonField {...props} />);
    // eslint-disable-next-line no-console
    const fakeOnBlur = () => console.log('blur');
    // eslint-disable-next-line no-console
    const fakeOnChange = () => console.log('change');
    const fakeFn = () => null;

    test.each([
        [true, 'chocolate'],
        [false, 'pumpkin'],
        [false, null],
        [false, undefined],
    ])('should render isSelected=%s with value=%s', (expected, value) => {
        const wrapper = getWrapper({
            field: {
                value,
                name: 'redVelvet',
                onBlur: fakeOnBlur,
                onChange: fakeOnChange,
            },
            form: {
                dirty: false,
                errors: {},
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                getFieldMeta: (fieldName: any) => ({
                    initialTouched: false,
                    touched: false,
                    value: fieldName,
                }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                getFieldProps: (fieldName: any) => ({
                    name: '',
                    onBlur: fakeOnBlur,
                    onChange: fakeOnChange,
                    value: fieldName,
                }),
                handleBlur: fakeOnBlur,
                handleChange: fakeOnChange,
                handleReset: fakeFn,
                handleSubmit: fakeFn,
                initialErrors: {},
                initialTouched: {},
                initialValues: [],
                isInitialValid: false,
                isValid: false,
                isSubmitting: false,
                isValidating: false,
                registerField: fakeFn,
                unregisterField: fakeFn,
                resetForm: fakeFn,
                setErrors: fakeFn,
                setStatus: fakeFn,
                setSubmitting: fakeFn,
                setTouched: fakeFn,
                setValues: fakeFn,
                setFieldError: fakeFn,
                setFieldTouched: fakeFn,
                setFieldValue: fakeFn,
                setFormikState: fakeFn,
                submitCount: 0,
                submitForm: () => Promise.resolve(),
                touched: {},
                validateField: fakeFn,
                validateForm: () => Promise.resolve({}),
                values: ['chocolate', 'pumpkin', 'redVelvet'],
            },
            label: 'Red Velvet',
            meta: {
                initialTouched: false,
                touched: false,
                value: 'redVelvet',
            },
            name: 'redVelvet',
            value: 'redVelvet',
        });
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.prop('isSelected')).toBe(expected);
    });
});
