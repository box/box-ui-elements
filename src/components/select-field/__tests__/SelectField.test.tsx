import * as React from 'react';
import { shallow } from 'enzyme';
import SelectField, { onSelect } from '../SelectField';
import type { SelectFieldProps } from '../SelectField';

describe('components/select-feild/SelectField', () => {
    const defaultProps: SelectFieldProps = {
        field: {
            name: 'toggle',
            onBlur: jest.fn(),
            onChange: jest.fn(),
            value: 'value',
        },
        form: {
            dirty: false,
            errors: {},
            getFieldHelpers: jest.fn(),
            getFieldMeta: jest.fn(),
            getFieldProps: jest.fn(),
            handleBlur: jest.fn(),
            handleChange: jest.fn(),
            handleReset: jest.fn(),
            handleSubmit: jest.fn(),
            initialErrors: {},
            initialStatus: undefined,
            initialTouched: {},
            initialValues: {},
            isSubmitting: false,
            isValid: true,
            isValidating: false,
            registerField: jest.fn(),
            resetForm: jest.fn(),
            setErrors: jest.fn(),
            setFieldError: jest.fn(),
            setFieldTouched: jest.fn(),
            setFieldValue: jest.fn(),
            setFormikState: jest.fn(),
            setStatus: jest.fn(),
            setSubmitting: jest.fn(),
            setTouched: jest.fn(),
            setValues: jest.fn(),
            submitCount: 0,
            submitForm: jest.fn(),
            touched: {},
            unregisterField: jest.fn(),
            validateField: jest.fn(),
            validateForm: jest.fn(),
            values: {},
        },
        meta: {
            initialTouched: false,
            touched: false,
            value: 'value',
        },
        options: [],
    };

    const getWrapper = (props: Partial<SelectFieldProps> = {}) => shallow(<SelectField {...defaultProps} {...props} />);

    test('should render properly for single select field', () => {
        const wrapper = getWrapper();
        expect(wrapper).toMatchSnapshot();
    });

    test('should render properly for multi select field', () => {
        const wrapper = getWrapper({
            multiple: true,
        });
        expect(wrapper).toMatchSnapshot();
    });

    describe('onSelect()', () => {
        test('should call onChange with single value when using single select', () => {
            const name = 'name';
            const option = { value: 0 };
            const onChange = jest.fn();
            onSelect(name, onChange, option);
            expect(onChange).toHaveBeenCalledWith({
                currentTarget: { name, value: option.value },
                target: { name, value: option.value },
            });
        });

        test('should call onChange with array of values when called with multiple select', () => {
            const name = 'name';
            const options = [{ value: 0 }, { value: 1 }];
            const onChange = jest.fn();
            onSelect(name, onChange, options);
            expect(onChange).toHaveBeenCalledWith({
                currentTarget: { name, value: [0, 1] },
                target: { name, value: [0, 1] },
            });
        });
    });
});
