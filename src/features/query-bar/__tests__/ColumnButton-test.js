import * as React from 'react';

import { columnForDateType, columnWithFloatType, template } from '../components/fixtures';
import ColumnButton from '../components/ColumnButton';

const columns = [columnForDateType, columnWithFloatType];

describe('features/query-bar/components/ColumnButton', () => {
    const getWrapper = (props = {}) => {
        return shallow(<ColumnButton onColumnChange={jest.fn()} columns={columns} {...props} />);
    };

    describe('render', () => {
        test('should render ColumnButton default state when menu is closed', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render ColumnButton default state when menu is open', () => {
            const wrapper = getWrapper();
            wrapper.instance().setState({
                isColumnMenuOpen: true,
            });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render ColumnButton with template passed in', () => {
            const wrapper = getWrapper({ template });
            expect(wrapper).toMatchSnapshot();
        });

        test('should render ColumnButton with correct message when no columns are hidden', () => {
            const wrapper = getWrapper({ columns });
            const FormattedMessage = wrapper.find('FormattedMessage');
            expect(FormattedMessage.props().defaultMessage).toBe('Columns');
        });

        test('should render ColumnButton with correct message when one column is hidden', () => {
            const wrapper = getWrapper({ columns: [{ ...columnForDateType, isShown: false }] });
            const FormattedMessage = wrapper.find('FormattedMessage');
            expect(FormattedMessage.props().defaultMessage).toBe('{number} Column Hidden');
        });

        test('should render ColumnButton with correct message when one column is hidden', () => {
            const wrapper = getWrapper({
                columns: [{ ...columnForDateType, isShown: false }, { ...columnWithFloatType, isShown: false }],
            });
            const FormattedMessage = wrapper.find('FormattedMessage');
            expect(FormattedMessage.props().defaultMessage).toBe('{number} Columns Hidden');
        });
    });

    describe('onClose()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isColumnMenuOpen: false,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().onClose();

                expect(wrapper.state('isColumnMenuOpen')).toEqual(updatedState.isColumnMenuOpen);
            });
        });
    });

    describe('onOpen()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isColumnMenuOpen: true,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().onOpen();

                expect(wrapper.state('isColumnMenuOpen')).toEqual(updatedState.isColumnMenuOpen);
            });
        });
    });

    describe('toggleColumnButton()', () => {
        [
            {
                description: 'Should update state with new ordering',
                updatedState: {
                    isColumnMenuOpen: true,
                },
            },
        ].forEach(({ description, updatedState }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().toggleColumnButton();

                expect(wrapper.state('isColumnMenuOpen')).toEqual(updatedState.isColumnMenuOpen);
            });
        });
    });

    describe('getNumberOfHiddenColumns()', () => {
        [
            {
                description: 'Should return the number of hidden columns',
                numberOfHiddenColumns: 0,
            },
        ].forEach(({ description, numberOfHiddenColumns }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                const result = wrapper.instance().getNumberOfHiddenColumns();

                expect(result).toEqual(numberOfHiddenColumns);
            });
        });
    });
});
