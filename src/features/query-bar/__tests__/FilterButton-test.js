// @flow
import * as React from 'react';

import { template } from '../components/fixtures';
import FilterButton from '../components/FilterButton';

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

    describe('update()', () => {
        [
            {
                description: 'should set conditions with an object with attribute',
                index: 0,
                condition: {
                    id: '3',
                    attributeDisplayText: '',
                    attributeKey: null,
                    operatorDisplayText: '',
                    operatorKey: null,
                    valueDisplayText: '',
                    valueKey: null,
                },
                conditions: [
                    {
                        id: '3',
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
                fieldId: 1,
                fieldType: 'attribute',
                fieldKey: 0,
                fieldKeyType: 'attributeKey',
                valueType: 'string',
                updatedCondition: [
                    {
                        id: '3',
                        attributeDisplayText: 'myAttribute',
                        attributeKey: 0,
                        fieldId: 1,
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
                    id: '4',
                    attributeDisplayText: '',
                    attributeKey: null,
                    operatorDisplayText: '',
                    operatorKey: null,
                    valueDisplayText: '',
                    valueKey: null,
                },
                conditions: [
                    {
                        id: '4',
                        attributeDisplayText: '',
                        attributeKey: null,
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
                        id: '4',
                        attributeDisplayText: '',
                        attributeKey: null,
                        fieldId: 1,
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
                    id: '5',
                    attributeDisplayText: '',
                    attributeKey: null,
                    operatorDisplayText: '',
                    operatorKey: null,
                    valueDisplayText: '',
                    valueKey: null,
                },
                conditions: [
                    {
                        id: '5',
                        attributeDisplayText: '',
                        attributeKey: null,
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
                        id: '5',
                        attributeDisplayText: '',
                        attributeKey: null,
                        fieldId: 1,
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
                        id: '2',
                        attributeDisplayText: '',
                        attributeKey: null,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
                        valueKey: null,
                    },
                    {
                        id: '3',
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
                        id: '3',
                        attributeDisplayText: '',
                        attributeKey: null,
                        operatorDisplayText: '',
                        operatorKey: null,
                        valueDisplayText: '',
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
