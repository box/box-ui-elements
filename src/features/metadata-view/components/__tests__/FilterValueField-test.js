import React from 'react';

import FilterValueField from '../FilterValueField';

describe('features/metadata-view/components/FilterValueField', () => {
    const getWrapper = () => {
        const intl = {
            formatMessage: jest.fn(),
        };

        return shallow(
            <FilterValueField
                formatMessage={intl.formatMessage}
                selectedValue=""
                updateDateInputValue={jest.fn()}
                updateSelectedField={jest.fn()}
                updateTextInputValue={jest.fn()}
                valueKey="0"
                valueOptions={[
                    {
                        displayText: 'Hello',
                        type: 'enum',
                        fieldId: 'field0',
                        value: 0,
                    },
                ]}
            />,
        );
    };

    describe('render SingleSelectField', () => {
        [
            {
                description: 'should correctly render a SingleSelectField for a valueType of enum',
                valueType: 'enum',
            },
            {
                description: 'should correctly render a DatePicker for a valueType of date',
                valueType: 'date',
            },
            {
                description: 'should correctly render a TextInput for a valueType of string',
                valueType: 'string',
            },
            {
                description: 'should correctly render a TextInput for a valueType of float',
                valueType: 'float',
            },
            {
                description: 'should correctly render a TextInput for a valueType of number',
                valueType: 'number',
            },
        ].forEach(({ description, valueType }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper({ valueType });
                expect(wrapper).toMatchSnapshot();
            });
        });
    });
});
