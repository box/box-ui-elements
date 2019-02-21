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
            fieldId: '3',
            type: 'string',
            value,
        };
        const fieldId = initialCondition.fieldId;
        const valueType = 'string';

        test.each`
            description                        | fieldType     | displayTextType          | keyType
            ${'user has selected a column'}    | ${'column'}   | ${'columnDisplayText'}   | ${COLUMN_KEY}
            ${'user has selected an operator'} | ${'operator'} | ${'operatorDisplayText'} | ${OPERATOR_KEY}
            ${'user has selected a value'}     | ${'value'}    | ${'valueDisplayText'}    | ${VALUE_KEY}
        `('$description', ({ fieldType, displayTextType, keyType }) => {
            const update = jest.fn();
            const wrapper = getWrapper({
                update,
            });

            wrapper
                .find('SingleSelectField')
                .at(1)
                .simulate('change', option, fieldType);

            expect(update).toHaveBeenCalledWith(
                index,
                condition,
                displayText,
                displayTextType,
                fieldId,
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
        const fieldId = initialCondition.fieldId;
        const valueType = 'string';
        const keyType = VALUE_KEY;
        const displayTextType = 'valueDisplayText';

        test.each`
            description                                                | fieldValue          | displayText       | value
            ${'user has entered an empty string into the value field'} | ${stringFieldValue} | ${''}             | ${''}
            ${'user has selected a date in the date picker'}           | ${dateFieldValue}   | ${dateFieldValue} | ${dateFieldValue}
        `('$description', ({ fieldValue, displayText, value }) => {
            const update = jest.fn();
            const wrapper = getWrapper({ update });

            wrapper.find('ValueField').prop('updateValueField')(fieldValue);

            expect(update).toHaveBeenCalledWith(
                index,
                condition,
                displayText,
                displayTextType,
                fieldId,
                value,
                keyType,
                valueType,
            );
        });
    });

    describe('getColumnOptions()', () => {
        const { fieldId } = initialCondition;
        test.each`
            description                                                  | expectedColumnOptions
            ${'user has opened the value dropdown and sees the options'} | ${columnOptions}
        `('$description', ({ expectedColumnOptions }) => {
            const wrapper = getWrapper({ fieldId });
            const ValueField = wrapper.find('ValueField');
            expect(ValueField.props().valueOptions).toEqual(expectedColumnOptions);
        });
    });
});
