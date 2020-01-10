// @flow strict

import React, { type Element, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import classNames from 'classnames';
import find from 'lodash/find';
import getProp from 'lodash/get';
import MultiGrid from 'react-virtualized/dist/es/MultiGrid/MultiGrid';

import FileIcon from '../../icons/file-icon';
import PlainButton from '../../components/plain-button';

import { getFileExtension } from '../../utils/file';
import messages from '../../elements/common/messages';

import './MetadataBasedItemList.scss';

import type { MetadataColumnConfig, MetadataColumnsToShow } from '../../common/types/metadataQueries';
import type { StringAnyMap, Collection, BoxItem } from '../../common/types/core';

import {
    FILE_ICON_COLUMN_INDEX,
    FILE_ICON_COLUMN_WIDTH,
    FILE_ICON_SIZE,
    FILE_NAME_COLUMN_INDEX,
    FILE_NAME_COLUMN_WIDTH,
    FIXED_COLUMNS_NUMBER,
    FIXED_ROW_NUMBER,
    HEADER_ROW_INDEX,
    MIN_METADATA_COLUMN_WIDTH,
} from './constants';

type State = { hoveredRowIndex: number, scrollLeftOffset: number, scrollRightOffset: number };

type Props = {
    currentCollection: Collection,
    metadataColumnsToShow: MetadataColumnsToShow,
    onItemClick: BoxItem => void,
};

type CellRendererArgs = {
    columnIndex: number,
    key: string,
    rowIndex: number,
    style: StringAnyMap,
};

type ColumnWidthCallback = ({ index: number }) => number;
type GridCellData = Element<typeof FileIcon | typeof PlainButton | typeof Fragment>;

type ScrollPositionClasses = {
    'is-scrolledLeft': boolean,
    'is-scrolledMiddle': boolean,
    'is-scrolledRight': boolean,
};

type ScrollEventData = {
    clientWidth: number,
    scrollLeft: number,
    scrollWidth: number,
};

class MetadataBasedItemList extends React.Component<Props, State> {
    props: Props;

    constructor(props: Props) {
        super(props);
        this.state = { hoveredRowIndex: -1, scrollLeftOffset: 0, scrollRightOffset: 0 };
    }

    getColumnWidth(width: number): ColumnWidthCallback {
        const { metadataColumnsToShow }: Props = this.props;

        return ({ index }: { index: number }): number => {
            if (index === FILE_ICON_COLUMN_INDEX) {
                return FILE_ICON_COLUMN_WIDTH;
            }

            if (index === FILE_NAME_COLUMN_INDEX) {
                return FILE_NAME_COLUMN_WIDTH;
            }

            const availableWidth = width - FILE_NAME_COLUMN_WIDTH - FILE_ICON_COLUMN_WIDTH; // total width minus width of sticky columns
            // Maintain min column width, else occupy the rest of the space equally
            return Math.max(availableWidth / metadataColumnsToShow.length, MIN_METADATA_COLUMN_WIDTH);
        };
    }

    getItemWithPermissions = (item: BoxItem): BoxItem => {
        /*
            - @TODO: Remove permissions object once its part of API response.
            - add "can_preview: true" so that users can click to launch the Preview modal. If users don't have access, they will see the error when Preview loads.
        */
        const permissions = { can_preview: true };
        return { ...item, permissions };
    };

    getMetadataColumnName(column: MetadataColumnConfig | string): string {
        return typeof column === 'string' ? column : getProp(column, 'name');
    }

    handleItemClick(item: BoxItem): void {
        const { onItemClick }: Props = this.props;
        onItemClick(this.getItemWithPermissions(item));
    }

    handleMouseEnter = (rowIndex: number): void => this.setState({ hoveredRowIndex: rowIndex });

    handleMouseLeave = (): void => this.setState({ hoveredRowIndex: -1 });

    handleContentScroll = ({ clientWidth, scrollLeft, scrollWidth }: ScrollEventData): void => {
        this.setState({
            scrollLeftOffset: scrollLeft,
            scrollRightOffset: scrollWidth - clientWidth - scrollLeft,
        });
    };

    getGridCellData(columnIndex: number, rowIndex: number): GridCellData | void {
        const {
            currentCollection: { items = [] },
            metadataColumnsToShow,
        }: Props = this.props;
        const metadataColumn = metadataColumnsToShow[columnIndex - FIXED_COLUMNS_NUMBER];
        const item = items[rowIndex - 1];
        const { name } = item;
        const fields = getProp(item, 'metadata.enterprise.fields', []);
        let cellData;

        switch (columnIndex) {
            case FILE_ICON_COLUMN_INDEX:
                cellData = <FileIcon dimension={FILE_ICON_SIZE} extension={getFileExtension(name)} />;
                break;
            case FILE_NAME_COLUMN_INDEX:
                cellData = (
                    <PlainButton type="button" onClick={() => this.handleItemClick(item)}>
                        {name}
                    </PlainButton>
                );
                break;
            default: {
                const mdFieldName = this.getMetadataColumnName(metadataColumn);
                const field = find(fields, ['name', mdFieldName]);
                if (!field) {
                    return cellData;
                }
                const { value } = field;
                cellData = value;
            }
        }

        return cellData;
    }

    getGridHeaderData(columnIndex: number): string | Element<typeof FormattedMessage> {
        const { metadataColumnsToShow } = this.props;

        if (columnIndex === FILE_NAME_COLUMN_INDEX) {
            return <FormattedMessage {...messages.name} />; // "Name" column header
        }

        return this.getMetadataColumnName(metadataColumnsToShow[columnIndex - FIXED_COLUMNS_NUMBER]); // column header
    }

    cellRenderer = ({ columnIndex, rowIndex, key, style }: CellRendererArgs): Element<'div'> => {
        const { hoveredRowIndex } = this.state;
        const isHeaderRow = rowIndex === HEADER_ROW_INDEX;
        const isFileIconCell = !isHeaderRow && columnIndex === FILE_ICON_COLUMN_INDEX;
        const isFileNameCell = !isHeaderRow && columnIndex === FILE_NAME_COLUMN_INDEX;
        const isGridRowHovered = !isHeaderRow && rowIndex === hoveredRowIndex;

        const data = isHeaderRow ? this.getGridHeaderData(columnIndex) : this.getGridCellData(columnIndex, rowIndex);

        const classes = classNames('bdl-MetadataBasedItemList-cell', {
            'bdl-MetadataBasedItemList-cell--fileIcon': isFileIconCell,
            'bdl-MetadataBasedItemList-cell--filename': isFileNameCell,
            'bdl-MetadataBasedItemList-cell--hover': isGridRowHovered,
        });

        return (
            <div
                className={classes}
                key={key}
                onMouseEnter={() => this.handleMouseEnter(rowIndex)}
                onMouseLeave={this.handleMouseLeave}
                style={style}
            >
                {data}
            </div>
        );
    };

    scrollPositionClasses(width: number): ScrollPositionClasses {
        const { scrollLeftOffset, scrollRightOffset } = this.state;
        const isViewScrolledLeft = this.totalContentWidth() > width && scrollRightOffset > 0;
        const isViewScrolledRight = scrollLeftOffset > 0;
        const isViewScrolledInMiddle = isViewScrolledLeft && isViewScrolledRight;

        return {
            'is-scrolledLeft': isViewScrolledLeft && !isViewScrolledInMiddle, // content scrolled all the way to the left
            'is-scrolledRight': isViewScrolledRight && !isViewScrolledInMiddle, // content scrolled all the way to the right
            'is-scrolledMiddle': isViewScrolledInMiddle, // content scrolled somewhere in between
        };
    }

    totalContentWidth(): number {
        const { metadataColumnsToShow }: Props = this.props;
        // total width = sum of widths of sticky & non-sticky columns
        return (
            FILE_ICON_COLUMN_WIDTH + FILE_NAME_COLUMN_WIDTH + metadataColumnsToShow.length * MIN_METADATA_COLUMN_WIDTH
        );
    }

    render() {
        const { currentCollection, metadataColumnsToShow }: Props = this.props;
        const rowCount = currentCollection.items ? currentCollection.items.length : 0;

        return (
            <AutoSizer>
                {({ width, height }) => {
                    const scrollClasses = this.scrollPositionClasses(width);
                    const classesTopRightGrid = classNames('bdl-MetadataBasedItemList-topRightGrid', scrollClasses);
                    const classesBottomRightGrid = classNames(
                        'bdl-MetadataBasedItemList-bottomRightGrid',
                        scrollClasses,
                    );
                    return (
                        <div className="bdl-MetadataBasedItemList">
                            <MultiGrid
                                cellRenderer={this.cellRenderer}
                                classNameBottomRightGrid={classesBottomRightGrid}
                                classNameTopRightGrid={classesTopRightGrid}
                                columnCount={metadataColumnsToShow.length + FIXED_COLUMNS_NUMBER}
                                columnWidth={this.getColumnWidth(width)}
                                fixedColumnCount={FIXED_COLUMNS_NUMBER}
                                fixedRowCount={FIXED_ROW_NUMBER}
                                height={height}
                                hideBottomLeftGridScrollbar
                                hideTopRightGridScrollbar
                                rowCount={rowCount + FIXED_ROW_NUMBER}
                                rowHeight={50}
                                width={width}
                                onScroll={this.handleContentScroll}
                            />
                        </div>
                    );
                }}
            </AutoSizer>
        );
    }
}

export default MetadataBasedItemList;
