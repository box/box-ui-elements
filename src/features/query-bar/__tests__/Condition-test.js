// @flow
import * as React from 'react';

import { columnWithEnumType } from '../components/fixtures';
import Condition from '../components/filter/Condition';
import { EQUALS } from '../constants';

const invalidCondition: ConditionType = { columnId: '3', id: '0', operator: EQUALS, values: [] };
const columns = [columnWithEnumType];

describe('features/query-bar/components/filter/Condition', () => {
    const getWrapper = (props = {}) => {
        return shallow(
            <Condition
                index={0}
                columns={columns}
                condition={invalidCondition}
                deleteCondition={() => {}}
                update={() => {}}
                intl={{ formatMessage: () => {} }}
                {...props}
            />,
        );
    };

    describe('render()', () => {
        test('should render Condition', () => {
            const condition = invalidCondition;
            const wrapper = getWrapper({ condition });

            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('handleColumnChange()', () => {
        test('should select a column', () => {
            const condition = invalidCondition;
            const columnId = '1';
            const option = {
                type: 'string',
                value: columnId,
            };
            const onColumnChange = jest.fn();
            const wrapper = getWrapper({
                onColumnChange,
            });

            wrapper
                .find('SingleSelectField')
                .at(0)
                .simulate('change', option);

            expect(onColumnChange).toHaveBeenCalledWith(condition, columnId);
        });
    });

    describe('handleOperatorChange()', () => {
        const displayText = 'Vendor Name';
        const condition = invalidCondition;
        const value = '0';
        const option = {
            displayText,
            value,
        };

        test('should select an operator', () => {
            const onOperatorChange = jest.fn();
            const wrapper = getWrapper({
                onOperatorChange,
            });

            wrapper
                .find('SingleSelectField')
                .at(1)
                .simulate('change', option);
            expect(onOperatorChange).toHaveBeenCalledWith(condition.id, value);
        });
    });

    describe('handleValueChange()', () => {
        const condition = invalidCondition;
        const textInputValue = 'string';
        const selectFieldValue = '1';
        const dateFieldValue = new Date(2018, 11, 24, 10, 33, 30, 0);

        test.each`
            description                                            | option              | value
            ${'should invoke onValueChange with "string"'}         | ${textInputValue}   | ${textInputValue}
            ${'should invoke onValueChange with selectFieldValue'} | ${selectFieldValue} | ${selectFieldValue}
            ${'should invoke onValueChange with Date'}             | ${dateFieldValue}   | ${dateFieldValue}
        `('$description', ({ option, value }) => {
            const onValueChange = jest.fn();
            const wrapper = getWrapper({ onValueChange });

            wrapper.find('ValueField').prop('onChange')(option);

            expect(onValueChange).toHaveBeenCalledWith(condition.id, value);
        });
    });

    describe('getColumnOptions()', () => {
        test('should open the value dropdown and see the options', () => {
            const wrapper = getWrapper();
            const ValueField = wrapper.find('ValueField');
            expect(ValueField.props().valueOptions).toEqual([
                {
                    displayText: '$100',
                    value: '$100',
                },
            ]);
        });
    });
});
