import * as React from 'react';

import { columnForDateType, columnWithFloatType, template } from '../components/fixtures';
import ColumnButton from '../components/ColumnButton';

describe('features/query-bar/components/ColumnButton', () => {
    const getWrapper = (props = {}) => {
        const columns = [columnForDateType, columnWithFloatType];
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

        const visibleColumns = [columnForDateType, columnWithFloatType];
        const oneHiddenColumn = [{ ...columnForDateType, isShown: false }];
        const twoHiddenColumns = [
            { ...columnForDateType, isShown: false },
            { ...columnWithFloatType, isShown: false },
        ];

        test.each`
            columns             | values          | should
            ${visibleColumns}   | ${undefined}    | ${'should render ColumnButton with no column count when all columns are visible'}
            ${oneHiddenColumn}  | ${{ count: 1 }} | ${'should render ColumnButton with a column count of 1 when one column is hidden'}
            ${twoHiddenColumns} | ${{ count: 2 }} | ${'should render ColumnButton with a column count of 2 when multiple columns are hidden'}
        `('$should', ({ columns, values }) => {
            const wrapper = getWrapper({ columns });
            const FormattedMessage = wrapper.find('FormattedMessage');
            expect(FormattedMessage.props().values).toEqual(values);
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
