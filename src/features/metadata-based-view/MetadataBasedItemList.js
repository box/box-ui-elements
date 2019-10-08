// @flow strict

import React, { type Element } from 'react';
import classNames from 'classnames';
import { injectIntl, type IntlShape } from 'react-intl';
import MultiGrid from 'react-virtualized/dist/es/MultiGrid/MultiGrid';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import getProp from 'lodash/get';
import FileIcon from '../../icons/file-icon';
import messages from '../../elements/common/messages';
import PlainButton from '../../components/plain-button';
import { getFileExtension } from '../../utils/file';
import './MetadataBasedItemList.scss';

import type {
    FlattenedMetadataQueryResponseCollection,
    FlattenedMetadataQueryResponseEntry,
    MetadataColumnConfig,
    MetadataColumnsToShow,
} from '../../common/types/metadataQueries';

const FILE_ICON_COLUMN_INDEX = 0;
const FILE_ICON_COLUMN_WIDTH = 54;
const FILE_ICON_SIZE = 32;
const FILE_NAME_COLUMN_INDEX = 1;
const FILE_NAME_COLUMN_WIDTH = 350;
const FIXED_COLUMNS_NUMBER = 2; // 2 Sticky columns - 1. file-icon, 2. file-name for each row
const FIXED_ROW_NUMBER = 1; // Header row
const HEADER_ROW_INDEX = 0;
const MIN_METADATA_COLUMN_WIDTH = 250;

type State = {
    hoveredRowIndex: number,
};

type Props = {
    currentCollection: FlattenedMetadataQueryResponseCollection,
    intl: IntlShape,
    metadataColumnsToShow: MetadataColumnsToShow,
    onItemClick: FlattenedMetadataQueryResponseEntry => void,
} & InjectIntlProvidedProps;

type CellRendererArgs = {
    columnIndex: number,
    key: string,
    rowIndex: number,
    style: StringAnyMap,
};

type ColumnWidthCallback = ({ index: number }) => number;

class MetadataBasedItemList extends React.Component<Props, State> {
    props: Props;

    constructor(props: Props) {
        super(props);

        this.state = {
            hoveredRowIndex: -1, // initial MultiGrid load
        };
    }

    getMetadataColumnName(column: MetadataColumnConfig | string): string {
        return typeof column === 'string' ? column : getProp(column, 'name');
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

    handleOnClick(item: FlattenedMetadataQueryResponseEntry): void {
        const { onItemClick }: Props = this.props;
        /*
            - @TODO: Remove permissions object once its part of API response.
            - In Content Explorer element, if can_preview permission is false, there is no action taken onClick(item).
            - Until the response has permissions, add "can_preview: true" so that users can click to launch the Preview modal. If users don't have access, they will see the error when Preview loads.
        */
        const permissions = { can_preview: true };
        const itemWithPreviewPermission = { ...item, permissions };

        onItemClick(itemWithPreviewPermission);
    }

    getGridCellData(columnIndex: number, rowIndex: number): Element<typeof FileIcon | typeof PlainButton> | string {
        const {
            currentCollection: { items },
            metadataColumnsToShow,
        }: Props = this.props;
        const item = items[rowIndex - 1];
        const { name } = item;
        let cellData;

        switch (columnIndex) {
            case FILE_ICON_COLUMN_INDEX:
                cellData = <FileIcon dimension={FILE_ICON_SIZE} extension={getFileExtension(name)} />;
                break;
            case FILE_NAME_COLUMN_INDEX:
                cellData = (
                    <PlainButton type="button" onClick={() => this.handleOnClick(item)}>
                        {name}
                    </PlainButton>
                );
                break;
            default: {
                const data = getProp(item, 'metadata.data', {});
                const mdFieldName = this.getMetadataColumnName(
                    metadataColumnsToShow[columnIndex - FIXED_COLUMNS_NUMBER],
                );
                cellData = data[mdFieldName];
            }
        }

        return cellData;
    }

    getGridHeaderData(columnIndex: number): string | void {
        const { intl, metadataColumnsToShow } = this.props;

        let headerData;

        if (columnIndex === FILE_NAME_COLUMN_INDEX) {
            headerData = intl.formatMessage(messages.name); // "Name" column header
        }

        if (columnIndex > FILE_NAME_COLUMN_INDEX) {
            headerData = this.getMetadataColumnName(metadataColumnsToShow[columnIndex - FIXED_COLUMNS_NUMBER]); // column header
        }

        return headerData;
    }

    handleMouseEnter = (rowIndex: number): void => this.setState({ hoveredRowIndex: rowIndex });

    handleMouseLeave = (): void => this.setState({ hoveredRowIndex: -1 });

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
                key={key}
                className={classes}
                style={style}
                onMouseLeave={this.handleMouseLeave}
                onMouseEnter={() => this.handleMouseEnter(rowIndex)}
            >
                {data}
            </div>
        );
    };

    render() {
        const { currentCollection, metadataColumnsToShow }: Props = this.props;
        const rowCount = currentCollection.items ? currentCollection.items.length : 0;

        return (
            <AutoSizer>
                {({ width, height }) => (
                    <div className="bdl-MetadataBasedItemList">
                        <MultiGrid
                            cellRenderer={this.cellRenderer}
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
                        />
                    </div>
                )}
            </AutoSizer>
        );
    }
}

export { MetadataBasedItemList as MetadataBasedItemListComponent };
export default injectIntl(MetadataBasedItemList);
