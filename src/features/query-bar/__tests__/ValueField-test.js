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
                selectedValue=""
                onChange={jest.fn()}
                value={new Date(1995, 11, 25, 9, 30, 0)}
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
        test.each`
            description                                                              | valueType   | renderedComponent
            ${'should correctly render a SingleSelectField for a valueType of enum'} | ${'enum'}   | ${'SingleSelectField'}
            ${'should correctly render a DatePicker for a valueType of date'}        | ${'date'}   | ${'DatePicker'}
            ${'should correctly render a TextInput for a valueType of string'}       | ${'string'} | ${'TextInput'}
            ${'should correctly render a TextInput for a valueType of float'}        | ${'float'}  | ${'TextInput'}
            ${'should correctly render a TextInput for a valueType of number'}       | ${'number'} | ${'TextInput'}
        `('$description', ({ valueType, renderedComponent }) => {
            const wrapper = getWrapper({ valueType });
            expect(wrapper).toMatchSnapshot();
            expect(wrapper.find(renderedComponent)).toHaveLength(1);
        });
    });
});
