// @flow
import * as React from 'react';

import { template } from '../fixtures';
import FilterButton from '../FilterButton';

describe('feature/metadata-view/components/FilterButton', () => {
    const getWrapper = (props = {}) => {
        return shallow(<FilterButton {...props} />);
    };

    describe('render', () => {
        test('should render FilterButton default state', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render FilterButton with template passed in', () => {
            const wrapper = getWrapper({ template });
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('updateFilterCondition()', () => {
        [
            {
                description: 'should set conditions with an object with attribute',
                index: 0,
                condition: {
                    conditionId: '3',
                    attributeDisplayText: '',
                    attributeKey: null,
                    isValidCondition: false,
                    operatorDisplayText: '',
                    operatorKey: null,
                    valueDisplayText: '',
                    valueKey: null,
                },
                filterConditions: [
                    {
                        conditionId: '3',
                        attributeDisplayText: '',
                        attributeKey: null,
                        isValidCondition: false,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
                        valueKey: null,
                    },
                ],
                fieldDisplayText: 'myAttribute',
                fieldDisplayTextType: 'attributeDisplayText',
                fieldId: 1,
                fieldType: 'attribute',
                fieldKey: 0,
                fieldKeyType: 'attributeKey',
                valueType: 'string',
                updatedCondition: [
                    {
                        conditionId: '3',
                        attributeDisplayText: 'myAttribute',
                        attributeKey: 0,
                        fieldId: 1,
                        isValidCondition: false,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
                        valueKey: null,
                        valueType: 'string',
                    },
                ],
            },
            {
                description: 'should set conditions with an object with operator',
                index: 0,
                condition: {
                    conditionId: '4',
                    attributeDisplayText: '',
                    attributeKey: null,
                    isValidCondition: false,
                    operatorDisplayText: '',
                    operatorKey: null,
                    valueDisplayText: '',
                    valueKey: null,
                },
                filterConditions: [
                    {
                        conditionId: '4',
                        attributeDisplayText: '',
                        attributeKey: null,
                        isValidCondition: false,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
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
                        conditionId: '4',
                        attributeDisplayText: '',
                        attributeKey: null,
                        fieldId: 1,
                        isValidCondition: false,
                        operatorDisplayText: 'myOperator',
                        operatorKey: 0,
                        valueDisplayText: '',
                        valueKey: null,
                    },
                ],
            },
            {
                description: 'should set conditions with an object with value',
                index: 0,
                condition: {
                    conditionId: '5',
                    attributeDisplayText: '',
                    attributeKey: null,
                    isValidCondition: false,
                    operatorDisplayText: '',
                    operatorKey: null,
                    valueDisplayText: '',
                    valueKey: null,
                },
                filterConditions: [
                    {
                        conditionId: '5',
                        attributeDisplayText: '',
                        attributeKey: null,
                        isValidCondition: false,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
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
                        conditionId: '5',
                        attributeDisplayText: '',
                        attributeKey: null,
                        fieldId: 1,
                        isValidCondition: false,
                        operatorDisplayText: '',
                        operatorKey: null,
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
                filterConditions,
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
                        filterConditions,
                    });
                    wrapper
                        .instance()
                        .updateFilterCondition(
                            index,
                            condition,
                            fieldDisplayText,
                            fieldDisplayTextType,
                            fieldId,
                            fieldKey,
                            fieldKeyType,
                            valueType,
                        );

                    expect(wrapper.state('filterConditions')).toEqual(updatedCondition);
                });
            },
        );
    });

    describe('deleteCondition()', () => {
        [
            {
                description:
                    'should delete condition at index 0 and set isDisabled to true since there is still one condition remaining',
                index: 0,
                conditions: [
                    {
                        conditionId: '2',
                        attributeDisplayText: '',
                        attributeKey: null,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
                        valueKey: null,
                    },
                    {
                        conditionId: '3',
                        attributeDisplayText: '',
                        attributeKey: null,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
                        valueKey: null,
                    },
                ],
                fieldDisplayText: 'myAttribute',
                fieldDisplayTextType: 'attributeDisplayText',
                fieldType: 'attribute',
                fieldKey: 0,
                fieldKeyType: 'attributeKey',
                updatedConditions: [
                    {
                        conditionId: '3',
                        attributeDisplayText: '',
                        attributeKey: null,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
                        valueKey: null,
                    },
                ],
                isDisabled: true,
            },
            {
                description:
                    'should delete condition at index 0 and set isDisabled to false since there are no conditions remaining',
                index: 0,
                conditions: [
                    {
                        conditionId: '2',
                        attributeDisplayText: '',
                        attributeKey: null,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
                        valueKey: null,
                    },
                ],
                fieldDisplayText: 'myAttribute',
                fieldDisplayTextType: 'attributeDisplayText',
                fieldType: 'attribute',
                fieldKey: 0,
                fieldKeyType: 'attributeKey',
                updatedConditions: [],
                isDisabled: false,
            },
        ].forEach(
            ({
                description,
                index,
                conditions,
                fieldDisplayText,
                fieldDisplayTextType,
                fieldKey,
                fieldKeyType,
                updatedConditions,
                isDisabled,
            }) => {
                test(`${description}`, () => {
                    const wrapper = getWrapper();
                    wrapper.instance().setState({
                        filterConditions: conditions,
                    });
                    wrapper.instance().deleteCondition(index);

                    expect(wrapper.state('filterConditions')).toEqual(updatedConditions);
                    expect(wrapper.state('isDisabled')).toEqual(isDisabled);
                });
            },
        );
    });

    describe('onClose()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isFilterMenuOpen: false,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().onClose();

                expect(wrapper.state('isFilterMenuOpen')).toEqual(updatedState.isFilterMenuOpen);
            });
        });
    });

    describe('onOpen()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isFilterMenuOpen: true,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().onOpen();

                expect(wrapper.state('isFilterMenuOpen')).toEqual(updatedState.isFilterMenuOpen);
            });
        });
    });

    describe('toggleFilterButton()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isFilterMenuOpen: true,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().toggleFilterButton();

                expect(wrapper.state('isFilterMenuOpen')).toEqual(updatedState.isFilterMenuOpen);
            });
        });
    });

    describe('checkValidCondition()', () => {
        [
            {
                description: 'Should return true if the condition is a float and has keys that are not null',
                condition: {
                    valueType: 'float',
                    valueKey: 1,
                },
                result: true,
            },
            {
                description: 'Should return true if the condition is not a float and has keys that are not null',
                condition: {
                    valueType: 'string',
                    attributeKey: 'attributeKey',
                    valueKey: 1,
                    operatorKey: 'operatorKey',
                },
                result: true,
            },
            {
                description: 'Should return false if the condition is not a float and has keys that are null',
                condition: {
                    valueType: null,
                    attributeKey: null,
                    valueKey: 1,
                    operatorKey: null,
                },
                result: false,
            },
        ].forEach(({ description, condition, result }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                const checkValidConditionResult = wrapper.instance().checkValidCondition(condition);
                expect(checkValidConditionResult).toEqual(result);
            });
        });
    });

    describe('getValidConditions()', () => {
        [
            {
                description: 'Should return the valid conditions from filteredConditions',
                filterConditions: [
                    {
                        isValidCondition: true,
                    },
                    {
                        isValidCondition: false,
                    },
                ],
                validConditions: [
                    {
                        isValidCondition: true,
                    },
                ],
            },
        ].forEach(({ description, filterConditions, validConditions }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    filterConditions,
                });

                const result = wrapper.instance().getValidConditions(filterConditions);
                expect(result).toEqual(validConditions);
            });
        });
    });

    describe('closeOnClickPredicate()', () => {
        [
            {
                description: 'Should return true if className is apply-filters-button',
                result: true,
            },
        ].forEach(({ description, result }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.setState({
                    isDisabled: false,
                });
                const targetWithClassName = {
                    target: document.createElement('button'),
                };
                targetWithClassName.target.className = 'apply-filters-button';
                const closeOnClickPredicateResult = wrapper.instance().shouldClose(targetWithClassName);

                wrapper.update();
                expect(closeOnClickPredicateResult).toEqual(result);
            });
        });
    });
});
