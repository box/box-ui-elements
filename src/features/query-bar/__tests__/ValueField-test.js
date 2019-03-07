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
        test.each`
            description                                                                   | valueType       | renderedComponent      | selectedValues
            ${'should correctly render a MultiSelectField for a valueType of multi-enum'} | ${'multi-enum'} | ${'MultiSelectField'}  | ${emptyArray}
            ${'should correctly render a SingleSelectField for a valueType of enum'}      | ${'enum'}       | ${'SingleSelectField'} | ${emptyArray}
            ${'should correctly render a DatePicker for a valueType of date'}             | ${'date'}       | ${'DatePicker'}        | ${new Date(1995, 11, 25, 9, 30, 0)}
            ${'should correctly render a TextInput for a valueType of string'}            | ${'string'}     | ${'TextInput'}         | ${emptyArray}
            ${'should correctly render a TextInput for a valueType of float'}             | ${'float'}      | ${'TextInput'}         | ${emptyArray}
            ${'should correctly render a TextInput for a valueType of number'}            | ${'number'}     | ${'TextInput'}         | ${emptyArray}
        `('$description', ({ valueType, renderedComponent, selectedValues }) => {
            const wrapper = getWrapper({ valueType, selectedValues });
            expect(wrapper).toMatchSnapshot();
            expect(wrapper.find(renderedComponent)).toHaveLength(1);
        });
    });
});
