// @flow
import * as React from 'react';

import { columnOptions, columns, initialCondition } from '../components/fixtures';
import { OPERATOR, VALUE } from '../constants';
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

    describe('updateColumnField()', () => {
        test('should select a column', () => {
            const condition = initialCondition;
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

    describe('updateOperatorField()', () => {
        const displayText = 'Vendor Name';
        const condition = initialCondition;
        const value = 0;
        const option = {
            displayText,
            value,
        };

        test('should select an operator', () => {
            const onColumnChange = jest.fn();
            const onFieldChange = jest.fn();
            const wrapper = getWrapper({
                onFieldChange,
                onColumnChange,
            });

            wrapper
                .find('SingleSelectField')
                .at(1)
                .simulate('change', option);
            expect(onFieldChange).toHaveBeenCalledWith(condition, value, OPERATOR);
        });
    });

    describe('handleValueChange()', () => {
        const condition = initialCondition;
        const textInputValue = 'string';
        const selectFieldValue = '1';
        const dateFieldValue = new Date(2018, 11, 24, 10, 33, 30, 0);
        const keyType = VALUE;

        test.each`
            description                                            | option              | value
            ${'should invoke onFieldChange with "string"'}         | ${textInputValue}   | ${textInputValue}
            ${'should invoke onFieldChange with selectFieldValue'} | ${selectFieldValue} | ${selectFieldValue}
            ${'should invoke onFieldChange with Date'}             | ${dateFieldValue}   | ${dateFieldValue}
        `('$description', ({ option, value }) => {
            const onFieldChange = jest.fn();
            const wrapper = getWrapper({ onFieldChange });

            wrapper.find('ValueField').prop('onChange')(option);

            expect(onFieldChange).toHaveBeenCalledWith(condition, value, keyType);
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
