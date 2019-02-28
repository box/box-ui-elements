// @flow
import * as React from 'react';

import { columns } from '../components/fixtures';
import FilterButton from '../components/filter/FilterButton';
import { IS, LESS_THAN } from '../constants';

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
                    operator: IS,
                    value: null,
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '3',
                        operator: IS,
                        value: null,
                    },
                ],
                newConditions: [
                    {
                        columnId: '2',
                        id: '3',
                        operator: IS,
                        value: null,
                    },
                ],
            },
        ].forEach(({ description, columnId, condition, conditions, newConditions }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper({ columns });
                wrapper.setState({
                    conditions,
                });
                wrapper.instance().handleColumnChange(condition, columnId);

                expect(wrapper.state('conditions')).toEqual(newConditions);
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
                    operator: IS,
                    value: null,
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '4',
                        operator: IS,
                        value: null,
                    },
                ],
                property: LESS_THAN,
                conditionProperty: 'operator',
                newCondition: [
                    {
                        columnId: '1',
                        id: '4',
                        operator: LESS_THAN,
                        value: null,
                    },
                ],
            },
            {
                description: 'should set conditions with an object with value',
                index: 0,
                condition: {
                    columnId: '1',
                    id: '5',
                    operator: IS,
                    value: null,
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '5',
                        operator: IS,
                        value: null,
                    },
                ],
                property: 0,
                conditionProperty: 'value',
                newCondition: [
                    {
                        columnId: '1',
                        id: '5',
                        operator: IS,
                        value: 0,
                    },
                ],
            },
        ].forEach(({ description, condition, conditions, property, conditionProperty, newCondition }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    conditions,
                });
                wrapper.instance().handleFieldChange(condition, property, conditionProperty);

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
                        operatorDisplayText: '',
                        operator: null,
                        valueDisplayText: null,
                        value: null,
                    },
                    {
                        id: '3',
                        operatorDisplayText: '',
                        operator: null,
                        valueDisplayText: null,
                        value: null,
                    },
                ],
                newConditions: [
                    {
                        id: '3',
                        operatorDisplayText: '',
                        operator: null,
                        valueDisplayText: null,
                        value: null,
                    },
                ],
            },
        ].forEach(({ description, index, conditions, newConditions }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().setState({
                    conditions,
                });
                wrapper.instance().deleteCondition(index);

                expect(wrapper.state('conditions')).toEqual(newConditions);
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
                operator: IS,
                value: null,
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
        test('Should return true if Apply button was clicked', () => {
            const wrapper = getWrapper();
            const targetWithClassName = {
                target: document.createElement('button'),
            };
            targetWithClassName.target.className = 'apply-filters-button';
            const closeOnClickPredicateResult = wrapper.instance().shouldClose(targetWithClassName);

            wrapper.update();
            expect(closeOnClickPredicateResult).toEqual(true);
        });
    });
});
