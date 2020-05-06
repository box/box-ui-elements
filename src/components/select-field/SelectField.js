// @flow

import * as React from 'react';
import getProp from 'lodash/get';
import type { FieldProps } from 'formik';

import SingleSelectPrimitive from './SingleSelectField';
import MultiSelectPrimitive from './MultiSelectField';

import type { SelectOptionValueProp, SelectOptionProp } from './props';

type Props = {
    multiple?: boolean,
    options: Array<SelectOptionProp>,
} & FieldProps;

function createFakeSyntheticEvent(name: string, value: SelectOptionValueProp | Array<SelectOptionValueProp>) {
    return {
        currentTarget: { name, value },
        target: { name, value },
    };
}

function onSelect(name: string, onChange: Function, options: SelectOptionProp | Array<SelectOptionProp>) {
    const value = Array.isArray(options) ? options.map(option => option.value) : options.value;
    onChange(createFakeSyntheticEvent(name, value));
}

const SelectField = ({ field, form, multiple, ...rest }: Props) => {
    const { onChange, name, value } = field;
    const { errors, touched } = form;
    const isTouched = getProp(touched, name);
    const error = isTouched ? getProp(errors, name) : null;

    if (multiple) {
        return (
            <MultiSelectPrimitive
                {...field}
                {...rest}
                error={error}
                onChange={options => onSelect(name, onChange, options)}
                options={rest.options}
                selectedValues={value || []}
            />
        );
    }

    return (
        <SingleSelectPrimitive
            {...field}
            {...rest}
            error={error}
            onChange={options => onSelect(name, onChange, options)}
            options={rest.options}
            selectedValue={value || null}
        />
    );
};

export { onSelect };
export default SelectField;
