import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FileIcon from '../../../icons/file-icon';
import PlainButton from '../../../components/plain-button';

import MetadataBasedItemList from '../MetadataBasedItemList';

import { FILE_ICON_COLUMN_WIDTH, FILE_NAME_COLUMN_WIDTH, MIN_METADATA_COLUMN_WIDTH } from '../constants';

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
                instance.handleMouseEnter(rowIndex);
            }

            const data = instance.getGridCellData(columnIndex, rowIndex);
            expect(data).toEqual(cellData);
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

    describe('getMetadataColumnName()', () => {
        test('should return the column name when either column or column config object is passed', () => {
            const column = 'amount';
            const columnConfig = {
                name: 'amount',
                canEdit: true,
            };
            expect(instance.getMetadataColumnName(column)).toBe('amount');
            expect(instance.getMetadataColumnName(columnConfig)).toBe('amount');
        });
    });

    describe('handleItemClick(item)', () => {
        test('should invoke the onItemClick after adding can_preview permissions', () => {
            const permissions = { can_preview: true };
            const item = currentCollection.items[0];
            const itemWithPreviewPermission = { ...item, permissions };
            instance.handleItemClick(item);
            expect(onItemClick).toHaveBeenCalledWith(itemWithPreviewPermission);
        });
    });

    describe('handleMouseEnter()', () => {
        test('should handle mouse over event by setting state accordingly', () => {
            instance.handleMouseEnter(8);
            expect(instance.state.hoveredRowIndex).toBe(8);
        });
    });

    describe('handleMouseLeave()', () => {
        test('should handle mouse leave event by setting state accordingly', () => {
            instance.handleMouseLeave();
            expect(instance.state.hoveredRowIndex).toBe(-1);
        });
    });
    describe('handleContentScroll()', () => {
        test('should handle content scroll in non-sticky columns', () => {
            const clientWidth = 50;
            const scrollLeft = 10;
            const scrollWidth = 100;
            instance.setState = jest.fn();

            instance.handleContentScroll({ clientWidth, scrollLeft, scrollWidth });
            expect(instance.setState).toHaveBeenCalledWith({
                scrollLeftOffset: scrollLeft,
                scrollRightOffset: scrollWidth - clientWidth - scrollLeft,
            });
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
            instance.handleMouseEnter(hoverRowIndex); // Hover over row

            const cell = shallow(
                instance.cellRenderer({ columnIndex: 0, rowIndex: hoverRowIndex, key: 'key', style: {} }),
            );
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell--hover')).toBe(true);
        });
    });

    describe('getScrollPositionClasses(width)', () => {
        test.each`
            scrollLeftOffset | scrollRightOffset | scrolledLeft | scrolledRight | scrolledMiddle | desc
            ${0}             | ${100}            | ${true}      | ${false}      | ${false}       | ${'all the way to the left'}
            ${100}           | ${0}              | ${false}     | ${true}       | ${false}       | ${'all the way to the right'}
            ${50}            | ${50}             | ${false}     | ${false}      | ${true}        | ${'in the middle'}
        `(
            'should return correct classes when content is scrolled $desc',
            ({ scrollLeftOffset, scrollRightOffset, scrolledLeft, scrolledRight, scrolledMiddle }) => {
                instance.calculateContentWidth = jest.fn().mockReturnValue(600);
                wrapper.setState({ scrollLeftOffset, scrollRightOffset });
                const classes = instance.getScrollPositionClasses(500);
                expect(classes['is-scrolledLeft']).toBe(scrolledLeft);
                expect(classes['is-scrolledRight']).toBe(scrolledRight);
                expect(classes['is-scrolledMiddle']).toBe(scrolledMiddle);
            },
        );
    });

    describe('calculateContentWidth()', () => {
        test('should return total width of the content', () => {
            const width =
                FILE_ICON_COLUMN_WIDTH +
                FILE_NAME_COLUMN_WIDTH +
                metadataColumnsToShow.length * MIN_METADATA_COLUMN_WIDTH;

            expect(instance.calculateContentWidth()).toBe(width);
        });
    });

    describe('render()', () => {
        test('should render a default component correctly', () => {
            expect(wrapper.find('AutoSizer')).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
