import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FileIcon from '../../../icons/file-icon';
import IconPencil from '../../../icons/general/IconPencil';
import PlainButton from '../../../components/plain-button';
import Tooltip from '../../../components/tooltip';

import MetadataBasedItemList from '../MetadataBasedItemList';

jest.mock('react-virtualized/dist/es/AutoSizer', () => () => 'AutoSizer');

describe('features/metadata-based-view/MetadataBasedItemList', () => {
    let wrapper;
    let instance;
    const intl = { formatMessage: jest.fn().mockReturnValue('Name') };
    const onItemClick = jest.fn();
    const onClick = expect.any(Function);
    const currentCollection = {
        items: [
            {
                id: '1',
                metadata: {
                    enterprise: {
                        id: '11',
                        fields: [
                            {
                                name: 'type',
                                type: 'string',
                                value: 'bill',
                            },
                            {
                                name: 'amount',
                                type: 'float',
                                value: 100.12,
                            },
                        ],
                    },
                },
                name: 'name1.pdf',
                size: '123',
            },
            {
                id: '2',
                metadata: {
                    enterprise: {
                        id: '22',
                        fields: [
                            {
                                name: 'type',
                                type: 'string',
                                value: 'receipt',
                            },
                            {
                                name: 'amount',
                                type: 'float',
                                value: 200.88,
                            },
                        ],
                    },
                },
                name: 'name2.mp4',
                size: '456',
            },
        ],
        nextMarker: 'abc',
    };
    const metadataColumnsToShow = ['type', { name: 'amount', canEdit: true }];

    const pdfNameButton = (
        <PlainButton onClick={onClick} type="button">
            {currentCollection.items[0].name}
        </PlainButton>
    );
    const mp4NameButton = (
        <PlainButton onClick={onClick} type="button">
            {currentCollection.items[1].name}
        </PlainButton>
    );
    const pdfIcon = <FileIcon dimension={32} extension="pdf" />;
    const mp4Icon = <FileIcon dimension={32} extension="mp4" />;

    const defaultProps = {
        currentCollection,
        metadataColumnsToShow,
        intl,
        onItemClick,
    };

    const getWrapper = (props = defaultProps) => mount(<MetadataBasedItemList {...props} />);

    beforeEach(() => {
        wrapper = getWrapper();
        instance = wrapper.instance();
    });

    describe('getColumnWidth(columnIndex)', () => {
        test.each`
            columnIndex | columnWidth | desc
            ${0}        | ${54}       | ${'file icon'}
            ${1}        | ${350}      | ${'file name'}
            ${2}        | ${250}      | ${'metadata column'}
        `('getColumnWidth() for $desc', ({ columnIndex, columnWidth }) => {
            const availableWidth = 500; // width provided to AutoSizer Component
            const getWidth = instance.getColumnWidth(availableWidth);
            expect(getWidth({ index: columnIndex })).toBe(columnWidth);
        });
    });

    describe('getGridCellData(columnIndex, rowIndex)', () => {
        test.each`
            columnIndex | rowIndex | cellData
            ${0}        | ${1}     | ${pdfIcon}
            ${1}        | ${1}     | ${pdfNameButton}
            ${2}        | ${1}     | ${'bill'}
            ${3}        | ${1}     | ${100.12}
            ${0}        | ${2}     | ${mp4Icon}
            ${1}        | ${2}     | ${mp4NameButton}
            ${2}        | ${2}     | ${'receipt'}
            ${3}        | ${2}     | ${200.88}
        `('cellData for row: $rowIndex, column: $columnIndex', ({ columnIndex, rowIndex, cellData }) => {
            const editableColumnIndex = 3; // amount field is editable

            if (columnIndex === editableColumnIndex) {
                // Set state reflecting mouse-over action for every cell in editable column
                instance.handleMouseEnter(columnIndex, rowIndex);
            }

            const data = instance.getGridCellData(columnIndex, rowIndex);
            if (columnIndex < 2) {
                // i.e. FileIcon and FileName columns
                expect(data).toEqual(cellData);
                return;
            }

            const wrap = mount(data);
            expect(wrap.contains(cellData.toString())).toBe(true);

            if (columnIndex === editableColumnIndex) {
                // Expect edit icon for editable column
                expect(wrap.contains(Tooltip)).toBe(true);
                expect(wrap.contains(IconPencil)).toBe(true);
            }
        });
    });

    describe('getGridHeaderData(columnIndex)', () => {
        test.each`
            columnIndex | headerData
            ${0}        | ${undefined}
            ${1}        | ${'Name'}
            ${2}        | ${'type'}
            ${3}        | ${'amount'}
        `('headerData for column $columnIndex', ({ columnIndex, headerData }) => {
            const data = instance.getGridHeaderData(columnIndex);
            if (columnIndex === 1) {
                const formatMessageWrap = mount(data);
                expect(formatMessageWrap.find(FormattedMessage)).toHaveLength(1);
            } else {
                expect(data).toBe(headerData);
            }
        });
    });

    describe('handleItemClick(item)', () => {
        test('should invoke the onItemClick after adding can_preview permissions', () => {
            const permissions = { can_preview: true };
            const item = currentCollection.items[0];
            const itemWithPreviewPermission = { ...item, ...{ permissions } };
            instance.handleItemClick(item);
            expect(onItemClick).toHaveBeenCalledWith(itemWithPreviewPermission);
        });
    });

    describe('handleMouseEnter()', () => {
        test('should handle mouse over event by setting state accordingly', () => {
            instance.handleMouseEnter(5, 8);
            expect(instance.state.hoveredColumnIndex).toBe(5);
            expect(instance.state.hoveredRowIndex).toBe(8);
        });
    });

    describe('handleMouseLeave()', () => {
        test('should handle mouse leave event by setting state accordingly', () => {
            instance.handleMouseLeave();
            expect(instance.state.hoveredRowIndex).toBe(-1);
        });
    });

    describe('cellRenderer()', () => {
        test.each([
            [{ columnIndex: 0, rowIndex: 2, key: 'key', style: {} }, true, false],
            [{ columnIndex: 1, rowIndex: 2, key: 'key', style: {} }, false, true],
        ])('should have correct class names', (arg, hasFileIconClass, hasFileNameClass) => {
            const cell = shallow(instance.cellRenderer(arg));
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell')).toBe(true);
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell--fileIcon')).toBe(hasFileIconClass);
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell--filename')).toBe(hasFileNameClass);
        });

        test('should have hovered class for adding background color on row hover', () => {
            const hoverRowIndex = 1;
            const hoverColumnIndex = 1;
            instance.handleMouseEnter(hoverColumnIndex, hoverRowIndex); // Hover over row

            const cell = shallow(
                instance.cellRenderer({ columnIndex: 0, rowIndex: hoverRowIndex, key: 'key', style: {} }),
            );
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell--hover')).toBe(true);
        });
    });

    describe('render()', () => {
        test('should render a default component correctly', () => {
            expect(wrapper.find('AutoSizer')).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
