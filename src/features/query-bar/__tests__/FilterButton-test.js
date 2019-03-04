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
        test('should render FilterButton default state', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render FilterButton with columns passed in', () => {
            const wrapper = getWrapper({ columns });
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('handleColumnChange()', () => {
        [
            {
                description: 'should set conditions with an object with column',
                columnId: '2',
                condition: {
                    columnId: '1',
                    id: '3',
                    operator: EQUALS,
                    values: [],
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '3',
                        operator: EQUALS,
                        values: [],
                    },
                ],
                expectedConditions: [
                    {
                        columnId: '2',
                        id: '3',
                        operator: EQUALS,
                        values: [],
                    },
                ],
            },
        ].forEach(({ description, columnId, condition, conditions, expectedConditions }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper({ columns });
                wrapper.setState({
                    conditions,
                });
                wrapper.instance().handleColumnChange(condition, columnId);

                expect(wrapper.state('conditions')).toEqual(expectedConditions);
            });
        });
    });

    describe('handleOperatorChange()', () => {
        [
            {
                description: 'should set conditions with an object with operator',
                conditionId: 4,
                conditions: [
                    {
                        columnId: '1',
                        id: 4,
                        operator: EQUALS,
                        values: [],
                    },
                ],
                value: LESS_THAN,
                expectedConditions: [
                    {
                        columnId: '1',
                        id: 4,
                        operator: LESS_THAN,
                        values: [],
                    },
                ],
            },
        ].forEach(({ description, conditionId, conditions, value, expectedConditions }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    conditions,
                });
                wrapper.instance().handleOperatorChange(conditionId, value);

                expect(wrapper.state('conditions')).toEqual(expectedConditions);
            });
        });
    });

    describe('handleValueChange()', () => {
        [
            {
                description: 'should set conditions with an object with value',
                index: 0,
                conditionId: 5,
                conditions: [
                    {
                        columnId: '1',
                        id: 5,
                        operator: EQUALS,
                        values: [],
                    },
                ],
                values: ['0'],
                expectedConditions: [
                    {
                        columnId: '1',
                        id: 5,
                        operator: EQUALS,
                        values: ['0'],
                    },
                ],
            },
        ].forEach(({ description, conditionId, conditions, values, expectedConditions }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    conditions,
                });
                wrapper.instance().handleValueChange(conditionId, values);

                expect(wrapper.state('conditions')).toEqual(expectedConditions);
            });
        });
    });

    describe('deleteCondition()', () => {
        [
            {
                description: 'should delete condition at index 0',
                index: 0,
                conditions: [
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
                ],
                expectedConditions: [
                    {
                        id: '3',
                        operator: EQUALS,
                        values: [],
                    },
                ],
            },
        ].forEach(({ description, index, conditions, expectedConditions }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().setState({
                    conditions,
                });
                wrapper.instance().deleteCondition(index);

                expect(wrapper.state('conditions')).toEqual(expectedConditions);
            });
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
                const wrapper = getWrapper();
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
                const wrapper = getWrapper();
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
                const wrapper = getWrapper();
                wrapper.instance().toggleButton();

                expect(wrapper.state('isMenuOpen')).toEqual(updatedState.isMenuOpen);
            });
        });
    });

    describe('createCondition()', () => {
        test('Should return a condition object if columns is defined', () => {
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

        test('Should return an empty object if columns is not defined', () => {
            const wrapper = getWrapper();
            const props = {};
            const conditionID = 123;
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
            const wrapper = getWrapper();
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
