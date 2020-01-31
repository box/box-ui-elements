import React from 'react';

import ValueField from '../components/filter/ValueField';

describe('features/query-bar/components/filter/ValueField', () => {
    const getWrapper = (props = {}) => {
        const intl = {
            formatMessage: jest.fn(),
        };

        return shallow(
            <ValueField
                formatMessage={intl.formatMessage}
                onChange={jest.fn()}
                valueKey="0"
                valueOptions={[
                    {
                        displayText: 'Hello',
                        type: 'enum',
                        value: 0,
                    },
                ]}
                {...props}
            />,
        );
    };

    describe('render value fields', () => {
        const emptyArray = [];
        const valuePropNames = {
            MultiSelectField: 'selectedValues',
            SingleSelectField: 'selectedValue',
            DatePicker: 'value',
            TextInput: 'value',
        };

        describe('when selected values are empty', () => {
            test.each`
                description                                                | valueType   | componentName          | selectedValues
                ${'should render SingleSelectField for valueType of enum'} | ${'enum'}   | ${'SingleSelectField'} | ${emptyArray}
                ${'should render DatePicker for valueType of date'}        | ${'date'}   | ${'DatePicker'}        | ${emptyArray}
                ${'should render TextInput for valueType of string'}       | ${'string'} | ${'TextInput'}         | ${emptyArray}
                ${'should render TextInput for valueType of float'}        | ${'float'}  | ${'TextInput'}         | ${emptyArray}
                ${'should render TextInput for valueType of number'}       | ${'number'} | ${'TextInput'}         | ${emptyArray}
            `('$description', ({ componentName, selectedValues, valueType }) => {
                const wrapper = getWrapper({ valueType, selectedValues });

                const component = wrapper.find(componentName);
                expect(component).toHaveLength(1);
                expect(component.prop(valuePropNames[componentName])).toBeFalsy();
            });
        });

        describe('when selected values are non-empty', () => {
            const stringValue = 'r';
            const dateValue = new Date(1995, 11, 25, 9, 30, 0);

            test.each`
                description                                                                                     | valueType        | componentName          | selectedValues     | expectedValue
                ${'should render MultiSelectField for valueType of multiSelect'}                                | ${'multiSelect'} | ${'MultiSelectField'}  | ${['r', 'g', 'b']} | ${['r', 'g', 'b']}
                ${'should render SingleSelectField for valueType of enum'}                                      | ${'enum'}        | ${'SingleSelectField'} | ${[stringValue]}   | ${stringValue}
                ${'should render DatePicker for valueType of date'}                                             | ${'date'}        | ${'DatePicker'}        | ${[dateValue]}     | ${dateValue}
                ${'should render DatePicker for valueType of date and user tries to delete the existing input'} | ${'date'}        | ${'DatePicker'}        | ${[null]}          | ${undefined}
                ${'should render TextInput for valueType of string'}                                            | ${'string'}      | ${'TextInput'}         | ${[stringValue]}   | ${stringValue}
                ${'should render TextInput for valueType of float'}                                             | ${'float'}       | ${'TextInput'}         | ${[stringValue]}   | ${stringValue}
                ${'should render TextInput for valueType of number'}                                            | ${'number'}      | ${'TextInput'}         | ${[stringValue]}   | ${stringValue}
            `('$description', ({ componentName, expectedValue, selectedValues, valueType }) => {
                const wrapper = getWrapper({ valueType, selectedValues });

                const component = wrapper.find(componentName);
                expect(component).toHaveLength(1);
                expect(component.prop(valuePropNames[componentName])).toEqual(expectedValue);
            });
        });

        describe('should not show an error for a', () => {
            test.each`
                valueType        | componentName          | should
                ${'multiSelect'} | ${'MultiSelectField'}  | ${'MultiSelectField of type multiSelect'}
                ${'enum'}        | ${'SingleSelectField'} | ${'SingleSelectField of type enum'}
                ${'date'}        | ${'DatePicker'}        | ${'DatePicker of type date'}
            `('$should', ({ componentName, valueType }) => {
                const wrapper = getWrapper({ valueType, error: null, selectedValues: [] });
                const component = wrapper.find(componentName);
                expect(component.prop('error')).toBe(undefined);
            });
        });

        describe('should show an error for a TextInput of ', () => {
            const error = <div />;
            test.each`
                valueType   | should
                ${'string'} | ${'type string'}
                ${'float'}  | ${'type float'}
                ${'number'} | ${'type number'}
            `('$should', ({ valueType }) => {
                const wrapper = getWrapper({ valueType, error, selectedValues: [] });
                const component = wrapper.find('TextInput');
                expect(component.prop('error')).toBe(error);
            });
        });
    });
});
