// @flow

import React, { Component } from 'react';
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
    style: Object,
};

class MetadataBasedItemList extends Component<Props> {
    props: Props;

    getColumnWidth(width) {
        const { metadataColumnsToShow }: Props = this.props;
        const availableWidth = width - FILENAME_COLUMN_WIDTH - FILE_ICON_COLUMN_WIDTH; // total width minus width of sticky columns
        // Maintain min column width, else occupy the rest of the space equally
        const mdColumnWidth = Math.max(availableWidth / metadataColumnsToShow.length, MIN_METADATA_COLUMN_WIDTH);

        return ({ index }) => {
            if (index === 0) {
                return FILE_ICON_COLUMN_WIDTH;
            }

            if (index === 1) {
                return FILENAME_COLUMN_WIDTH;
            }

            return mdColumnWidth;
        };
    }

    getGridCell(columnIndex, rowIndex) {
        const { currentCollection, metadataColumnsToShow }: Props = this.props;
        const { items } = currentCollection;
        const { name, metadata } = items[rowIndex];

        if (columnIndex === 0) {
            return <FileIcon dimension={FILE_ICON_SIZE} extension={getFileExtension(name) || ''} />;
        }

        if (columnIndex === 1) {
            return <span>{name}</span>;
        }

        const { data = {} } = metadata;
        const mdFieldName = metadataColumnsToShow[columnIndex - FIXED_COLUMNS_NUMBER];
        return <span>{data[mdFieldName]}</span>;
    }

    getGridHeader(columnIndex, style) {
        const { intl, metadataColumnsToShow } = this.props;

        let displayName;

        switch (columnIndex) {
            case 0:
                displayName = null; // No column header for file icon
                break;
            case 1:
                displayName = <span>{intl.formatMessage(messages.name)}</span>; // Column header "Name" for fileName
                break;
            default:
                displayName = <span>{metadataColumnsToShow[columnIndex - FIXED_COLUMNS_NUMBER]}</span>; // Column to show
        }

        return (
            <div className="bdl-MetadataBasedItemList-gridHeader" style={style}>
                {displayName}
            </div>
        );
    }

    cellRenderer = ({ columnIndex, key, rowIndex, style }: CellRendererArgs) => {
        if (rowIndex === 0) {
            // Render Header Row
            return this.getGridHeader(columnIndex, style);
        }

        const classes = classNames('bdl-MetadataBasedItemList-gridCell', {
            'bdl-MetadataBasedItemList-filename': columnIndex === 1 && rowIndex !== 0, // file name cell
        });
        // Render data row
        const cellData = this.getGridCell(columnIndex, rowIndex - 1);

        return (
            <div key={key} className={classes} style={style}>
                {cellData}
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
