import * as React from 'react';
import FileIcon from '../../../icons/file-icon';
import PlainButton from '../../../components/plain-button';

import { MetadataBasedItemListComponent as MetadataBasedItemList } from '../MetadataBasedItemList';

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
                metadata: {
                    data: { type: 'bill', amount: 500 },
                },
                name: 'name1.pdf',
            },
            {
                metadata: {
                    data: { type: 'receipt', amount: 200 },
                },
                name: 'name2.mp4',
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
            expect(getWidth({ index: columnIndex })).toEqual(columnWidth);
        });
    });

    describe('getGridCellData(columnIndex, rowIndex)', () => {
        test.each`
            columnIndex | rowIndex | cellData
            ${0}        | ${1}     | ${pdfIcon}
            ${1}        | ${1}     | ${pdfNameButton}
            ${2}        | ${1}     | ${'bill'}
            ${3}        | ${1}     | ${500}
            ${0}        | ${2}     | ${mp4Icon}
            ${1}        | ${2}     | ${mp4NameButton}
            ${2}        | ${2}     | ${'receipt'}
            ${3}        | ${2}     | ${200}
        `('cellData for row: $rowIndex, column: $columnIndex', ({ columnIndex, rowIndex, cellData }) => {
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
            expect(data).toEqual(headerData);
        });
    });

    describe('handleOnClick(item)', () => {
        test('should invoke the onItemClick after adding can_preview permissions', () => {
            const permissions = { can_preview: true };
            const item = currentCollection.items[0];
            const itemWithPreviewPermission = { ...item, ...{ permissions } };
            instance.handleOnClick(item);
            expect(onItemClick).toHaveBeenCalledWith(itemWithPreviewPermission);
        });
    });

    describe('handleMouseEnter()', () => {
        test('should handle mouse over event by setting state accordingly', () => {
            instance.handleMouseEnter(5);
            expect(instance.state.hoveredRowIndex).toEqual(5);
        });
    });

    describe('handleMouseLeave()', () => {
        test('should handle mouse leave event by setting state accordingly', () => {
            instance.handleMouseLeave();
            expect(instance.state.hoveredRowIndex).toEqual(-1);
        });
    });

    describe('cellRenderer()', () => {
        test.each([
            [{ columnIndex: 0, rowIndex: 2, key: 'key', style: {} }, true, false],
            [{ columnIndex: 1, rowIndex: 2, key: 'key', style: {} }, false, true],
        ])('should have correct class names', (arg, hasFileIconClass, hasFileNameClass) => {
            const cell = shallow(instance.cellRenderer(arg));
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell')).toEqual(true);
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell--fileIcon')).toEqual(hasFileIconClass);
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell--filename')).toEqual(hasFileNameClass);
        });

        test('should have hovered class for adding background color on row hover', () => {
            const hoverCellIndex = 1;
            instance.handleMouseEnter(hoverCellIndex); // Hover over row

            const cell = shallow(
                instance.cellRenderer({ columnIndex: 0, rowIndex: hoverCellIndex, key: 'key', style: {} }),
            );
            expect(cell.hasClass('bdl-MetadataBasedItemList-cell--hover')).toEqual(true);
        });
    });

    describe('render()', () => {
        test('should render a default component correctly', () => {
            expect(wrapper.find('AutoSizer')).toBeTruthy();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
