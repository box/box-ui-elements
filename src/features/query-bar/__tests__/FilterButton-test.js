// @flow
import * as React from 'react';

import { columns } from '../components/fixtures';
import FilterButton from '../components/filter/FilterButton';

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
                    operatorDisplayText: '',
                    operatorKey: 0,
                    valueDisplayText: null,
                    valueKey: null,
                    valueType: null,
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '3',
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                        valueType: null,
                    },
                ],
                valueType: 'string',
                updatedCondition: [
                    {
                        columnId: '2',
                        id: '3',
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                        valueType: 'string',
                    },
                ],
            },
        ].forEach(({ description, columnId, condition, conditions, updatedCondition, valueType }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    conditions,
                });
                wrapper.instance().handleColumnChange(condition, columnId, valueType);

                expect(wrapper.state('conditions')).toEqual(updatedCondition);
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
                    operatorDisplayText: '',
                    operatorKey: 0,
                    valueDisplayText: null,
                    valueKey: null,
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '4',
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
                fieldDisplayText: 'myOperator',
                fieldDisplayTextType: 'operatorDisplayText',
                fieldKey: 0,
                fieldKeyType: 'operatorKey',
                updatedCondition: [
                    {
                        columnId: '1',
                        id: '4',
                        operatorDisplayText: 'myOperator',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
            },
            {
                description: 'should set conditions with an object with value',
                index: 0,
                condition: {
                    columnId: '1',
                    id: '5',
                    operatorDisplayText: '',
                    operatorKey: 0,
                    valueDisplayText: null,
                    valueKey: null,
                },
                conditions: [
                    {
                        columnId: '1',
                        id: '5',
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
                fieldDisplayText: 'myValue',
                fieldDisplayTextType: 'valueDisplayText',
                fieldKey: 0,
                fieldKeyType: 'valueKey',
                valueType: 'string',
                updatedCondition: [
                    {
                        columnId: '1',
                        id: '5',
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: 'myValue',
                        valueKey: 0,
                        valueType: 'string',
                    },
                ],
            },
        ].forEach(
            ({
                description,
                condition,
                conditions,
                fieldDisplayText,
                fieldDisplayTextType,
                fieldKey,
                fieldKeyType,
                updatedCondition,
                valueType,
            }) => {
                test(`${description}`, () => {
                    const wrapper = getWrapper();
                    wrapper.setState({
                        conditions,
                    });
                    wrapper
                        .instance()
                        .handleFieldChange(
                            condition,
                            fieldDisplayText,
                            fieldDisplayTextType,
                            fieldKey,
                            fieldKeyType,
                            valueType,
                        );

                    expect(wrapper.state('conditions')).toEqual(updatedCondition);
                });
            },
        );
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
                        operatorKey: null,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                    {
                        id: '3',
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
                updatedConditions: [
                    {
                        id: '3',
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
            },
        ].forEach(({ description, index, conditions, updatedConditions }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().setState({
                    conditions,
                });
                wrapper.instance().deleteCondition(index);

                expect(wrapper.state('conditions')).toEqual(updatedConditions);
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
                operatorDisplayText: '',
                operatorKey: 0,
                valueDisplayText: null,
                valueKey: null,
                valueType: 'string',
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
