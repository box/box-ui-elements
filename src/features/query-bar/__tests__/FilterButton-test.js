// @flow
import * as React from 'react';

import { columns, initialCondition, conditions } from '../components/fixtures';
import FilterButton from '../components/filter/FilterButton';
import { EQUALS, LESS_THAN } from '../constants';

describe('feature/query-bar/components/filter/FilterButton', () => {
    const getWrapper = (props = {}) => {
        return shallow(<FilterButton conditions={conditions} {...props} />);
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

    describe('componentDidUpdate()', () => {
        const transientConditions = [];
        const wrapper = getWrapper({
            conditions,
        });
        wrapper.setState({
            transientConditions,
        });
        wrapper.instance().componentDidUpdate();
        expect(wrapper.state('transientConditions')).toEqual(conditions);
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
            columnId | transientConditions
            ${'2'}   | ${[condition]}
        `('should update condition.columnId', ({ columnId, transientConditions }) => {
            const wrapper = getWrapper({ columns });
            wrapper.setState({
                transientConditions,
            });
            wrapper.instance().handleColumnChange(condition, columnId);

            expect(wrapper.state('transientConditions')).toEqual(expectedConditions);
        });
    });

    describe('handleOperatorChange()', () => {
        const transientConditions = [
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
                transientConditions,
            });
            wrapper.instance().handleOperatorChange(conditionId, value);

            expect(wrapper.state('transientConditions')).toEqual(expectedConditions);
        });
    });

    describe('handleValueChange()', () => {
        const transientConditions = [
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
                transientConditions,
            });
            wrapper.instance().handleValueChange(conditionId, values);

            expect(wrapper.state('transientConditions')).toEqual(expectedConditions);
        });
    });

    describe('deleteCondition()', () => {
        const transientConditions = [
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
                transientConditions,
            });
            wrapper.instance().deleteCondition(index);

            expect(wrapper.state('transientConditions')).toEqual(expectedConditions);
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
            wrapper.instance().setState({
                transientConditions: [],
            });

            const condition = wrapper.instance().createCondition();
            expect(condition.columnId).toEqual('1');
            expect(condition.id).toBeDefined();
            expect(condition.operator).toEqual(EQUALS);
            expect(condition.values).toEqual([]);
        });

        test('Should return an empty object if columns is empty', () => {
            const wrapper = getWrapper({ columns: [] });
            const expected = {};

            const condition = wrapper.instance().createCondition();

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
            description                                                                | transientConditions          | shouldCloseResult
            ${'Should return true if Apply button was clicked and value is not empty'} | ${conditionsWithValues}      | ${true}
            ${'Should return false if Apply button was clicked and value is empty'}    | ${conditionsWithEmptyValues} | ${false}
        `('$description', ({ transientConditions, shouldCloseResult }) => {
            const wrapper = getWrapper({ columns });
            const targetWithClassName = {
                target: document.createElement('button'),
            };
            wrapper.instance().setState({
                transientConditions,
            });
            targetWithClassName.target.className = 'apply-filters-button';
            const closeOnClickPredicateResult = wrapper.instance().shouldClose(targetWithClassName);

            wrapper.update();
            expect(closeOnClickPredicateResult).toEqual(shouldCloseResult);
        });
    });
});
