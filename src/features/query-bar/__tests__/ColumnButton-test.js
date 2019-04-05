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

        const allVisibleColumns = [columnForDateType, columnWithFloatType];
        const oneHiddenColumn = [{ ...columnForDateType, isShown: false }];
        const twoHiddenColumns = [{ ...columnForDateType, isShown: false }, { ...columnWithFloatType, isShown: false }];

        test.each`
            columns              | should                                                                        | message
            ${allVisibleColumns} | ${'should render ColumnButton with message when all columns are visible'}     | ${'Columns'}
            ${oneHiddenColumn}   | ${'should render ColumnButton with message when one column is hidden'}        | ${'1 Column Hidden'}
            ${twoHiddenColumns}  | ${'should render ColumnButton with message when multiple columns are hidden'} | ${'{number} Columns Hidden'}
        `('$should', ({ columns, message }) => {
            const wrapper = getWrapper({ columns });
            const FormattedMessage = wrapper.find('FormattedMessage');
            expect(FormattedMessage.props().defaultMessage).toBe(message);
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
