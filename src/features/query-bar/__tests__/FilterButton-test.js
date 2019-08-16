// @flow
import * as React from 'react';

import { columnForTemplateFieldName, columnForDateType } from '../components/fixtures';
import FilterButton from '../components/filter/FilterButton';
import type { ConditionType } from '../flowTypes';
import { EQUALS, LESS_THAN } from '../constants';

const validCondition: ConditionType = {
    columnId: columnForTemplateFieldName.id,
    id: '0',
    operator: EQUALS,
    values: [1],
};
const invalidCondition: ConditionType = {
    ...validCondition,
    values: [],
};
const columns = [columnForTemplateFieldName, columnForDateType];
const validConditions = [validCondition];
const invalidConditions = [invalidCondition];

describe('feature/query-bar/components/filter/FilterButton', () => {
    const getWrapper = (props = {}) => {
        return shallow(<FilterButton conditions={validConditions} {...props} />);
    };

    describe('render', () => {
        test('should disable FilterButton when columns is undefined', () => {
            const wrapper = getWrapper({ columns: null });
            const Button = wrapper.find('Button');
            expect(Button.props().isDisabled).toBeTruthy();
        });

        test('should enable FilterButton when columns is non-empty', () => {
            const wrapper = getWrapper({ columns });
            const Button = wrapper.find('Button');
            expect(Button.props().isDisabled).toBeFalsy();
        });

        test('Should close the menu and clear out transientConditions when Apply button is clicked', () => {
            const wrapper = getWrapper({ conditions: validConditions });
            wrapper.instance().setState({
                transientConditions: validConditions,
                isMenuOpen: true,
            });

            wrapper.find('.apply-filters-button').simulate('click');

            const Flyout = wrapper.find('Flyout');
            expect(Flyout.props().overlayIsVisible).toBeFalsy();
            expect(wrapper.state('transientConditions')).toHaveLength(0);
        });

        test('Should set hasUserSubmitted to true for Condition if any condition is invalid', () => {
            const wrapper = getWrapper({ conditions: [{ values: [] }] });
            wrapper.instance().setState({
                transientConditions: invalidConditions,
                isMenuOpen: true,
            });

            wrapper.find('.apply-filters-button').simulate('click');

            const Condition = wrapper.find('Condition');
            expect(Condition.props().hasUserSubmitted).toBeTruthy();
        });
    });

    describe('componentDidUpdate()', () => {
        const initialCondition = {
            columnId: columnForTemplateFieldName.id,
            id: '1',
            operator: '=',
            values: [],
        };

        test.each`
            innerColumns | conditions         | transientConditions | expectedConditions    | should
            ${columns}   | ${validConditions} | ${[]}               | ${validConditions}    | ${'should reinitialize conditions from props.conditions when flyout is opened and props.conditions is not empty'}
            ${columns}   | ${[]}              | ${[]}               | ${[initialCondition]} | ${'should set initial condition if props.conditions is empty and transientConditions are empty'}
            ${[]}        | ${[]}              | ${[]}               | ${[]}                 | ${'should set empty array if props.conditions is empty and transientConditions are empty and columns are empty'}
        `('$should', ({ innerColumns, conditions, transientConditions, expectedConditions }) => {
            const wrapper = getWrapper({ columns: innerColumns, conditions });
            wrapper.setState({
                isMenuOpen: true,
                transientConditions,
            });
            wrapper.instance().componentDidUpdate({}, { isMenuOpen: false });

            expect(wrapper.state('transientConditions')).toEqual(expectedConditions);
        });
    });

    describe('handleColumnChange()', () => {
        test('should update condition to the selected column', () => {
            const conditions2 = {
                ...validConditions,
                columnId: columnForTemplateFieldName.id,
            };

            const wrapper = getWrapper({ columns });
            wrapper.setState({
                conditions: conditions2,
            });
            wrapper.instance().handleColumnChange(conditions2[0], columnForDateType.id);

            expect(wrapper.state('transientConditions')[0].columnId).toEqual(columnForDateType.id);
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
            expect(condition.columnId).toEqual(columnForTemplateFieldName.id);
            expect(condition.id).toBeDefined();
            expect(condition.operator).toEqual(EQUALS);
            expect(condition.values).toEqual([]);
        });

        test('Should throw an error if columns is empty', () => {
            const wrapper = getWrapper({ columns: [] });

            expect(() => {
                wrapper.instance().createCondition();
            }).toThrow('Columns Required');
        });
    });

    describe('closeOnClickPredicate()', () => {
        test.each`
            description                                                                | transientConditions  | shouldCloseResult
            ${'Should return true if Apply button was clicked and value is not empty'} | ${validConditions}   | ${true}
            ${'Should return false if Apply button was clicked and value is empty'}    | ${invalidConditions} | ${false}
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
