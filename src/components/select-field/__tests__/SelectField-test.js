// @flow

import React from 'react';
import SelectField, { onSelect } from '../SelectField';

describe('components/select-feild/SelectField', () => {
    const getWrapper = (props = {}) => shallow(<SelectField {...props} />);

    test('should render properly for single select field', () => {
        const wrapper = getWrapper({
            field: {
                name: 'toggle',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {},
            label: 'Enter things',
        });
        expect(wrapper).toMatchSnapshot();
    });

    test('should render properly for multi select field', () => {
        const wrapper = getWrapper({
            field: {
                name: 'toggle',
                value: 'value',
                onBlur: 'onblur',
                onChange: 'onchange',
            },
            form: {},
            label: 'Enter things',
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
