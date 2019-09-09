// @flow strict

import React, { type Element } from 'react';
import classNames from 'classnames';
import { injectIntl, type IntlShape } from 'react-intl';
import MultiGrid from 'react-virtualized/dist/es/MultiGrid/MultiGrid';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import FileIcon from '../../icons/file-icon';
import messages from '../../elements/common/messages';
import { getFileExtension } from '../../utils/file';
import './MetadataBasedItemList.scss';

import type { FlattenedMetadataQueryResponseCollection } from '../../common/types/metadataQueries';

const FILE_ICON_SIZE = 32;
const FILE_ICON_COLUMN_WIDTH = 52;
const FILENAME_COLUMN_WIDTH = 350;
const MIN_METADATA_COLUMN_WIDTH = 250;
const FIXED_COLUMNS_NUMBER = 2; // 2 Sticky columns - 1. file-icon, 2. file-name for each row
const FIXED_ROW_NUMBER = 1; // Header row

type Props = {
    currentCollection: FlattenedMetadataQueryResponseCollection,
    intl: IntlShape,
    metadataColumnsToShow: Array<string>,
} & InjectIntlProvidedProps;

type CellRendererArgs = {
    columnIndex: number,
    key: string,
    rowIndex: number,
    style: StringAnyMap,
};

type ColumnWidthCallback = ({ index: number }) => number;

class MetadataBasedItemList extends React.Component<Props> {
    props: Props;

    getColumnWidth(width: number): ColumnWidthCallback {
        const { metadataColumnsToShow }: Props = this.props;

        return ({ index }: { index: number }): number => {
            if (index === 0) {
                return FILE_ICON_COLUMN_WIDTH;
            }

            if (index === 1) {
                return FILENAME_COLUMN_WIDTH;
            }

            const availableWidth = width - FILENAME_COLUMN_WIDTH - FILE_ICON_COLUMN_WIDTH; // total width minus width of sticky columns
            // Maintain min column width, else occupy the rest of the space equally
            return Math.max(availableWidth / metadataColumnsToShow.length, MIN_METADATA_COLUMN_WIDTH);
        };
    }

    getGridCellData(columnIndex: number, rowIndex: number): Element<typeof FileIcon> | string {
        const { currentCollection, metadataColumnsToShow }: Props = this.props;
        const { items } = currentCollection;
        const { name = '', metadata = {} } = items[rowIndex - 1];
        let cellData;

        switch (columnIndex) {
            case 0:
                cellData = <FileIcon dimension={FILE_ICON_SIZE} extension={getFileExtension(name)} />;
                break;
            case 1:
                cellData = name;
                break;
            default: {
                const { data = {} } = metadata;
                const mdFieldName = metadataColumnsToShow[columnIndex - FIXED_COLUMNS_NUMBER];
                cellData = data[mdFieldName];
            }
        }

        return cellData;
    }

    getGridHeaderData(columnIndex: number): string | void {
        const { intl, metadataColumnsToShow } = this.props;

        let headerData;

        if (columnIndex === 1) {
            headerData = intl.formatMessage(messages.name); // "Name" column header
        }

        if (columnIndex > 1) {
            headerData = metadataColumnsToShow[columnIndex - FIXED_COLUMNS_NUMBER]; // column header
        }

        return headerData;
    }

    cellRenderer = ({ columnIndex, rowIndex, key, style }: CellRendererArgs): Element<'div'> => {
        const data = rowIndex === 0 ? this.getGridHeaderData(columnIndex) : this.getGridCellData(columnIndex, rowIndex);
        const classes = classNames('bdl-MetadataBasedItemList-cell', {
            'bdl-MetadataBasedItemList-cell--filename': columnIndex === 1, // file name cell
        });

        return (
            <div key={key} className={classes} style={style}>
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

export default injectIntl(MetadataBasedItemList);
