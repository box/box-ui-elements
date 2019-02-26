// @flow
import * as React from 'react';

import { columnOptions, columns, initialCondition } from '../components/fixtures';
import { COLUMN_KEY, OPERATOR_KEY, VALUE_KEY } from '../constants';
import Condition from '../components/filter/Condition';

describe('features/query-bar/components/filter/Condition', () => {
    const getWrapper = (props = {}) => {
        return shallow(
            <Condition
                index={0}
                columns={columns}
                condition={initialCondition}
                deleteCondition={() => {}}
                update={() => {}}
                intl={{ formatMessage: () => {} }}
                {...props}
            />,
        );
    };

    describe('render()', () => {
        test('should render Condition', () => {
            const condition = initialCondition;
            const wrapper = getWrapper({ condition });

            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('updateSelectedField()', () => {
        const displayText = 'Vendor Name';
        const index = 0;
        const condition = initialCondition;
        const value = 0;
        const option = {
            displayText,
            type: 'string',
            value,
        };
        const valueType = 'string';

        test.each`
            description                    | fieldType     | displayTextType          | keyType
            ${'should select a column'}    | ${'column'}   | ${'columnDisplayText'}   | ${COLUMN_KEY}
            ${'should select an operator'} | ${'operator'} | ${'operatorDisplayText'} | ${OPERATOR_KEY}
            ${'should select a value'}     | ${'value'}    | ${'valueDisplayText'}    | ${VALUE_KEY}
        `('$description', ({ fieldType, displayTextType, keyType }) => {
            const onFieldChange = jest.fn();
            const wrapper = getWrapper({
                onFieldChange,
            });

            wrapper
                .find('SingleSelectField')
                .at(1)
                .simulate('change', option, fieldType);

            expect(onFieldChange).toHaveBeenCalledWith(
                index,
                condition,
                displayText,
                displayTextType,
                value,
                keyType,
                valueType,
            );
        });
    });

    describe('updateValueField()', () => {
        const stringFieldValue = {
            target: {
                value: '',
            },
        };
        const index = 0;
        const condition = initialCondition;
        const dateFieldValue = new Date(2018, 11, 24, 10, 33, 30, 0);
        const valueType = 'string';
        const keyType = VALUE_KEY;
        const displayTextType = 'valueDisplayText';

        test.each`
            description                                            | fieldValue          | displayText       | value
            ${'should enter an empty string into the value field'} | ${stringFieldValue} | ${''}             | ${''}
            ${'should select a date in the date picker'}           | ${dateFieldValue}   | ${dateFieldValue} | ${dateFieldValue}
        `('$description', ({ fieldValue, displayText, value }) => {
            const onFieldChange = jest.fn();
            const wrapper = getWrapper({ onFieldChange });

            wrapper.find('ValueField').prop('updateValueField')(fieldValue);

            expect(onFieldChange).toHaveBeenCalledWith(
                index,
                condition,
                displayText,
                displayTextType,
                value,
                keyType,
                valueType,
            );
        });
    });

    describe('getColumnOptions()', () => {
        test.each`
            description                                             | expectedColumnOptions
            ${'should open the value dropdown and see the options'} | ${columnOptions}
        `('$description', ({ expectedColumnOptions }) => {
            const wrapper = getWrapper({ columns });
            const ValueField = wrapper.find('ValueField');
            expect(ValueField.props().valueOptions).toEqual(expectedColumnOptions);
        });
    });
});
