// @flow
import * as React from 'react';

import { columns, initialCondition } from '../components/fixtures';
import FilterButton from '../components/filter/FilterButton';
import { EQUALS, LESS_THAN } from '../constants';

describe('feature/query-bar/components/filter/FilterButton', () => {
    const getWrapper = (props = {}) => {
        return shallow(<FilterButton {...props} />);
    };

    describe('render', () => {
        test('should disable FilterButton when columns is undefined', () => {
            const wrapper = getWrapper({ columns: undefined });
            expect(wrapper).toMatchSnapshot();
        });

        test('should enable FilterButton when columns is non-empty', () => {
            const wrapper = getWrapper({ columns });
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('handleColumnChange()', () => {
        const condition = {
            columnId: '1',
            id: '3',
            operator: EQUALS,
            values: [],
        };
        const expectedConditions = [{ columnId: '2', id: '3', operator: EQUALS, values: [] }];
        test.each`
            columnId | conditions
            ${'2'}   | ${[condition]}
        `('should update condition.columnId', ({ columnId, conditions }) => {
            const wrapper = getWrapper({ columns });
            wrapper.setState({
                conditions,
            });
            wrapper.instance().handleColumnChange(condition, columnId);

            expect(wrapper.state('conditions')).toEqual(expectedConditions);
        });
    });

    describe('handleOperatorChange()', () => {
        const conditions = [
            {
                columnId: '1',
                id: '4',
                operator: EQUALS,
                values: [],
            },
        ];
        const expectedConditions = [{ columnId: '1', id: '4', operator: LESS_THAN, values: [] }];
        test.each`
            conditionId | value
            ${'4'}      | ${LESS_THAN}
        `('should update condition.operator', ({ conditionId, value }) => {
            const wrapper = getWrapper({ columns });
            wrapper.setState({
                conditions,
            });
            wrapper.instance().handleOperatorChange(conditionId, value);

            expect(wrapper.state('conditions')).toEqual(expectedConditions);
        });
    });

    describe('handleValueChange()', () => {
        const conditions = [
            {
                columnId: '1',
                id: '5',
                operator: EQUALS,
                values: [],
            },
        ];
        const expectedConditions = [{ columnId: '1', id: '5', operator: EQUALS, values: ['0'] }];
        test.each`
            conditionId | values
            ${'5'}      | ${['0']}
        `('should update condition.values', ({ conditionId, values }) => {
            const wrapper = getWrapper({ columns });
            wrapper.setState({
                conditions,
            });
            wrapper.instance().handleValueChange(conditionId, values);

            expect(wrapper.state('conditions')).toEqual(expectedConditions);
        });
    });

    describe('deleteCondition()', () => {
        const conditions = [
            {
                id: '2',
                operator: EQUALS,
                values: [],
            },
            {
                id: '3',
                operator: EQUALS,
                values: [],
            },
        ];
        const expectedConditions = [
            {
                id: '3',
                operator: EQUALS,
                values: [],
            },
        ];

        test.each`
            index
            ${0}
        `('should delete condition at index 0', ({ index }) => {
            const wrapper = getWrapper({ columns });
            wrapper.instance().setState({
                conditions,
            });
            wrapper.instance().deleteCondition(index);

            expect(wrapper.state('conditions')).toEqual(expectedConditions);
        });
    });

    describe('onClose()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isMenuOpen: false,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper({ columns });
                wrapper.instance().onClose();

                expect(wrapper.state('isMenuOpen')).toEqual(updatedState.isMenuOpen);
            });
        });
    });

    describe('onOpen()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isMenuOpen: true,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper({ columns });
                wrapper.instance().onOpen();

                expect(wrapper.state('isMenuOpen')).toEqual(updatedState.isMenuOpen);
            });
        });
    });

    describe('toggleButton()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isMenuOpen: true,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper({ columns });
                wrapper.instance().toggleButton();

                expect(wrapper.state('isMenuOpen')).toEqual(updatedState.isMenuOpen);
            });
        });
    });

    describe('createCondition()', () => {
        test('Should return a condition object if columns is non-empty', () => {
            const wrapper = getWrapper({ columns });
            const conditionID = '11';
            const expected = {
                columnId: '1',
                id: conditionID,
                operator: EQUALS,
                values: [],
            };
            wrapper.instance().setState({
                conditions: [],
            });

            const condition = wrapper.instance().createCondition(conditionID);

            expect(condition).toEqual(expected);
        });

        test('Should return an empty object if columns is empty', () => {
            const wrapper = getWrapper({ columns: [] });
            const props = {};
            const conditionID = '123';
            const expected = {};

            const condition = wrapper.instance().createCondition(props, conditionID);

            expect(condition).toEqual(expected);
        });
    });

    describe('closeOnClickPredicate()', () => {
        const conditionsWithValues = [
            {
                ...initialCondition,
                values: ['1'],
            },
        ];
        const conditionsWithEmptyValues = [{ ...initialCondition, values: [] }];

        test.each`
            description                                                                | conditions                   | shouldCloseResult
            ${'Should return true if Apply button was clicked and value is not empty'} | ${conditionsWithValues}      | ${true}
            ${'Should return false if Apply button was clicked and value is empty'}    | ${conditionsWithEmptyValues} | ${false}
        `('$description', ({ conditions, shouldCloseResult }) => {
            const wrapper = getWrapper({ columns });
            const targetWithClassName = {
                target: document.createElement('button'),
            };
            wrapper.instance().setState({
                conditions,
            });
            targetWithClassName.target.className = 'apply-filters-button';
            const closeOnClickPredicateResult = wrapper.instance().shouldClose(targetWithClassName);

            wrapper.update();
            expect(closeOnClickPredicateResult).toEqual(shouldCloseResult);
        });
    });
});
