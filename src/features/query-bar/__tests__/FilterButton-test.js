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

    describe('update()', () => {
        [
            {
                description: 'should set conditions with an object with attribute',
                index: 0,
                condition: {
                    id: '3',
                    columnDisplayText: '',
                    columnKey: null,
                    operatorDisplayText: '',
                    operatorKey: 0,
                    valueDisplayText: null,
                    valueKey: null,
                },
                conditions: [
                    {
                        id: '3',
                        columnDisplayText: '',
                        columnKey: null,
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
                fieldDisplayText: 'myAttribute',
                fieldDisplayTextType: 'columnDisplayText',
                fieldId: 1,
                fieldType: 'attribute',
                fieldKey: 0,
                fieldKeyType: 'columnKey',
                valueType: 'string',
                updatedCondition: [
                    {
                        id: '3',
                        columnDisplayText: 'myAttribute',
                        columnKey: 0,
                        fieldId: 1,
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                        valueType: 'string',
                    },
                ],
            },
            {
                description: 'should set conditions with an object with operator',
                index: 0,
                condition: {
                    id: '4',
                    columnDisplayText: '',
                    columnKey: null,
                    operatorDisplayText: '',
                    operatorKey: 0,
                    valueDisplayText: null,
                    valueKey: null,
                },
                conditions: [
                    {
                        id: '4',
                        columnDisplayText: '',
                        columnKey: null,
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
                fieldDisplayText: 'myOperator',
                fieldDisplayTextType: 'operatorDisplayText',
                fieldId: 1,
                fieldType: 'operator',
                fieldKey: 0,
                fieldKeyType: 'operatorKey',
                updatedCondition: [
                    {
                        id: '4',
                        columnDisplayText: '',
                        columnKey: null,
                        fieldId: 1,
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
                    id: '5',
                    columnDisplayText: '',
                    columnKey: null,
                    operatorDisplayText: '',
                    operatorKey: 0,
                    valueDisplayText: null,
                    valueKey: null,
                },
                conditions: [
                    {
                        id: '5',
                        columnDisplayText: '',
                        columnKey: null,
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
                fieldDisplayText: 'myValue',
                fieldDisplayTextType: 'valueDisplayText',
                fieldId: 1,
                fieldType: 'value',
                fieldKey: 0,
                fieldKeyType: 'valueKey',
                updatedCondition: [
                    {
                        id: '5',
                        columnDisplayText: '',
                        columnKey: null,
                        fieldId: 1,
                        operatorDisplayText: '',
                        operatorKey: 0,
                        valueDisplayText: 'myValue',
                        valueKey: 0,
                    },
                ],
            },
        ].forEach(
            ({
                description,
                index,
                condition,
                conditions,
                fieldDisplayText,
                fieldDisplayTextType,
                fieldId,
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
                        .update(
                            index,
                            condition,
                            fieldDisplayText,
                            fieldDisplayTextType,
                            fieldId,
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
                        prefix: null,
                        id: '2',
                        columnDisplayText: '',
                        columnKey: null,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                    {
                        prefix: 1,
                        id: '3',
                        columnDisplayText: '',
                        columnKey: null,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: null,
                        valueKey: null,
                    },
                ],
                fieldType: 'attribute',
                updatedConditions: [
                    {
                        prefix: null,
                        id: '3',
                        columnDisplayText: '',
                        columnKey: null,
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
            const wrapper = getWrapper();
            const props = {
                columns,
            };
            const conditionID = 123;
            const expected = {
                columnDisplayText: 'Hullo Thar',
                columnKey: 0,
                id: conditionID,
                fieldId: '1',
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

        test('Should return an empty object if template is not defined', () => {
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
