// @flow
import * as React from 'react';

import { columns } from '../components/fixtures';
import FilterButton from '../components/filter/FilterButton';
import { EQUALS, LESS_THAN, OPERATOR, VALUES } from '../constants';

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

    describe('handleFieldChange()', () => {
        [
            {
                description: 'should set conditions with an object with operator',
                condition: {
                    columnId: '1',
                    id: '4',
                    operator: EQUALS,
                    values: [],
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '4',
                        operator: EQUALS,
                        values: [],
                    },
                ],
                value: LESS_THAN,
                property: OPERATOR,
                newCondition: [
                    {
                        columnId: '1',
                        id: '4',
                        operator: LESS_THAN,
                        values: [],
                    },
                ],
            },
            {
                description: 'should set conditions with an object with value',
                index: 0,
                condition: {
                    columnId: '1',
                    id: '5',
                    operator: EQUALS,
                    values: [],
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '5',
                        operator: EQUALS,
                        values: [],
                    },
                ],
                value: ['0'],
                property: VALUES,
                newCondition: [
                    {
                        columnId: '1',
                        id: '5',
                        operator: EQUALS,
                        values: ['0'],
                    },
                ],
            },
        ].forEach(({ description, condition, conditions, value, property, newCondition }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    conditions,
                });
                wrapper.instance().handleFieldChange(condition, value, property);

                expect(wrapper.state('conditions')).toEqual(newCondition);
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
        const condition = {
            columnId: '1',
            id: '3',
            operator: EQUALS,
        };
        const conditionsWithValues = [
            {
                ...condition,
                values: ['1'],
            },
        ];
        const conditionsWithEmptyValues = [{ ...condition, values: [] }];

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
