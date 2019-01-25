import * as React from 'react';

import { visibleColumns } from '../fixtures';
import ColumnButton from '../ColumnButton';

describe('features/metadata-view/components/ColumnButton', () => {
    const getWrapper = (props = {}) => {
        return shallow(<ColumnButton onColumnChange={jest.fn()} visibleColumns={visibleColumns} {...props} />);
    };

    describe('render', () => {
        test('should render ColumnButton default state', () => {
            const wrapper = getWrapper();
            expect(wrapper).toMatchSnapshot();
        });

        test('should render ColumnButton with template passed in', () => {
            const template = {
                'Vendor Name': {
                    operators: ['is', 'is greater than', 'is less than', 'is not', 'is blank', 'matches any'],
                    values: ['Google', 'Apple', 'Facebook'],
                },
                'Expiration Month': {
                    operators: ['is', 'is greater than', 'is less than', 'is not'],
                    values: ['August 2018', 'September 2018', 'October 2018'],
                },
                'File Type': {
                    operators: ['is', 'is not'],
                    values: ['.docx', '.mp3', 'mp4'],
                },
            };

            const wrapper = getWrapper({ template });
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('onDragEnd()', () => {
        [
            {
                description: 'Should update state with new ordering',
                sourceIndex: 0,
                destinationIndex: 2,
                updatedColumns: [
                    {
                        displayName: 'Vendor Name',
                        id: 'item_28',
                        isChecked: true,
                        key: 'vendor name',
                        label: 'Vendor Name',
                    },
                    {
                        displayName: 'Updated',
                        id: 'item_26',
                        isChecked: true,
                        key: 'updated',
                        label: 'Updated',
                    },
                    {
                        displayName: 'Size',
                        id: 'item_27',
                        isChecked: true,
                        key: 'size',
                        label: 'Size',
                    },
                    {
                        displayName: 'Contract Value',
                        id: 'item_29',
                        isChecked: true,
                        key: 'contract value',
                        label: 'Contract Value',
                    },
                    {
                        displayName: 'Expiration Month',
                        id: 'item_30',
                        isChecked: true,
                        key: 'expiration month',
                        label: 'Expiration Month',
                    },
                    {
                        displayName: 'Country',
                        id: 'item_31',
                        isChecked: true,
                        key: 'country',
                        label: 'Country',
                    },
                    {
                        displayName: 'State',
                        id: 'item_32',
                        isChecked: true,
                        key: 'state',
                        label: 'State',
                    },
                    {
                        displayName: 'Function',
                        id: 'item_33',
                        isChecked: true,
                        key: 'function',
                        label: 'Function',
                    },
                ],
            },
            {
                description: 'Should not update state due to no destinationIndex',
                sourceIndex: 0,
                updatedColumns: [
                    {
                        displayName: 'Size',
                        id: 'item_27',
                        isChecked: true,
                        key: 'size',
                        label: 'Size',
                    },
                    {
                        displayName: 'Vendor Name',
                        id: 'item_28',
                        isChecked: true,
                        key: 'vendor name',
                        label: 'Vendor Name',
                    },
                    {
                        displayName: 'Updated',
                        id: 'item_26',
                        isChecked: true,
                        key: 'updated',
                        label: 'Updated',
                    },
                    {
                        displayName: 'Contract Value',
                        id: 'item_29',
                        isChecked: true,
                        key: 'contract value',
                        label: 'Contract Value',
                    },
                    {
                        displayName: 'Expiration Month',
                        id: 'item_30',
                        isChecked: true,
                        key: 'expiration month',
                        label: 'Expiration Month',
                    },
                    {
                        displayName: 'Country',
                        id: 'item_31',
                        isChecked: true,
                        key: 'country',
                        label: 'Country',
                    },
                    {
                        displayName: 'State',
                        id: 'item_32',
                        isChecked: true,
                        key: 'state',
                        label: 'State',
                    },
                    {
                        displayName: 'Function',
                        id: 'item_33',
                        isChecked: true,
                        key: 'function',
                        label: 'Function',
                    },
                ],
            },
        ].forEach(({ description, sourceIndex, destinationIndex, updatedColumns }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();
                wrapper.instance().onDragEnd(sourceIndex, destinationIndex);

                expect(wrapper.state('unsavedVisibleColumns')).toEqual(updatedColumns);
            });
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

    describe('applyFilters()', () => {
        [
            {
                description: 'Should apply filters to parent state',
                unsavedVisibleColumns: [
                    {
                        id: 'item_27',
                        isChecked: true,
                        label: 'Size',
                        key: 'size',
                        displayName: 'Size',
                    },
                    {
                        id: 'item_28',
                        isChecked: true,
                        label: 'Vendor Name',
                        key: 'vendor name',
                        displayName: 'Vendor Name',
                    },
                    {
                        id: 'item_26',
                        isChecked: true,
                        label: 'Updated',
                        key: 'updated',
                        displayName: 'Updated',
                    },
                    {
                        id: 'item_29',
                        isChecked: true,
                        label: 'Contract Value',
                        key: 'contract value',
                        displayName: 'Contract Value',
                    },
                    {
                        id: 'item_30',
                        isChecked: true,
                        label: 'Expiration Month',
                        key: 'expiration month',
                        displayName: 'Expiration Month',
                    },
                    {
                        id: 'item_31',
                        isChecked: true,
                        label: 'Country',
                        key: 'country',
                        displayName: 'Country',
                    },
                    {
                        id: 'item_32',
                        isChecked: true,
                        label: 'State',
                        key: 'state',
                        displayName: 'State',
                    },
                    {
                        id: 'item_33',
                        isChecked: true,
                        label: 'Function',
                        key: 'function',
                        displayName: 'Function',
                    },
                ],
            },
        ].forEach(({ description, unsavedVisibleColumns }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();

                wrapper.setState({
                    unsavedVisibleColumns,
                });
                wrapper.instance().applyFilters();
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

    describe('updateUnsavedVisibleColumns()', () => {
        [
            {
                description: 'Should update state with unsavedVisibleColumns',
                numberOfHiddenColumns: 0,
                column: {
                    id: 'item_27',
                    isChecked: true,
                    label: 'Size',
                    key: 'size',
                    displayName: 'Size',
                },
                unsavedVisibleColumns: [
                    {
                        id: 'item_27',
                        isChecked: true,
                        label: 'Size',
                        key: 'size',
                        displayName: 'Size',
                    },
                    {
                        id: 'item_28',
                        isChecked: true,
                        label: 'Vendor Name',
                        key: 'vendor name',
                        displayName: 'Vendor Name',
                    },
                    {
                        id: 'item_26',
                        isChecked: true,
                        label: 'Updated',
                        key: 'updated',
                        displayName: 'Updated',
                    },
                    {
                        id: 'item_29',
                        isChecked: true,
                        label: 'Contract Value',
                        key: 'contract value',
                        displayName: 'Contract Value',
                    },
                    {
                        id: 'item_30',
                        isChecked: true,
                        label: 'Expiration Month',
                        key: 'expiration month',
                        displayName: 'Expiration Month',
                    },
                    {
                        id: 'item_31',
                        isChecked: true,
                        label: 'Country',
                        key: 'country',
                        displayName: 'Country',
                    },
                    {
                        id: 'item_32',
                        isChecked: true,
                        label: 'State',
                        key: 'state',
                        displayName: 'State',
                    },
                    {
                        id: 'item_33',
                        isChecked: true,
                        label: 'Function',
                        key: 'function',
                        displayName: 'Function',
                    },
                ],
                updatedUnsavedVisibleColumns: [
                    {
                        id: 'item_27',
                        isChecked: false,
                        label: 'Size',
                        key: 'size',
                        displayName: 'Size',
                    },
                    {
                        id: 'item_28',
                        isChecked: true,
                        label: 'Vendor Name',
                        key: 'vendor name',
                        displayName: 'Vendor Name',
                    },
                    {
                        id: 'item_26',
                        isChecked: true,
                        label: 'Updated',
                        key: 'updated',
                        displayName: 'Updated',
                    },
                    {
                        id: 'item_29',
                        isChecked: true,
                        label: 'Contract Value',
                        key: 'contract value',
                        displayName: 'Contract Value',
                    },
                    {
                        id: 'item_30',
                        isChecked: true,
                        label: 'Expiration Month',
                        key: 'expiration month',
                        displayName: 'Expiration Month',
                    },
                    {
                        id: 'item_31',
                        isChecked: true,
                        label: 'Country',
                        key: 'country',
                        displayName: 'Country',
                    },
                    {
                        id: 'item_32',
                        isChecked: true,
                        label: 'State',
                        key: 'state',
                        displayName: 'State',
                    },
                    {
                        id: 'item_33',
                        isChecked: true,
                        label: 'Function',
                        key: 'function',
                        displayName: 'Function',
                    },
                ],
            },
        ].forEach(({ description, column, unsavedVisibleColumns, updatedUnsavedVisibleColumns }) => {
            test(`${description}`, () => {
                const wrapper = getWrapper();

                wrapper.setState({
                    unsavedVisibleColumns,
                });

                wrapper.instance().updateUnsavedVisibleColumns(column);

                expect(wrapper.state('unsavedVisibleColumns')).toEqual(updatedUnsavedVisibleColumns);
            });
        });
    });
});
