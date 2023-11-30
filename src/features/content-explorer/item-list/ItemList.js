import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import AutoSizer from '@box/react-virtualized/dist/commonjs/AutoSizer';
import Column from '@box/react-virtualized/dist/commonjs/Table/Column';
import Table from '@box/react-virtualized/dist/commonjs/Table';
import defaultTableRowRenderer from '@box/react-virtualized/dist/commonjs/Table/defaultRowRenderer';
import '@box/react-virtualized/styles.css';

import { withInfiniteLoader } from '../../../components/react-virtualized-helpers';

import { ContentExplorerModePropType, ItemsPropType, ItemsMapPropType } from '../prop-types';

import ItemListIcon from './ItemListIcon';
import ItemListLoadingPlaceholder from './ItemListLoadingPlaceholder';
import ItemListName from './ItemListName';
import ItemListButton from './ItemListButton';

import './ItemList.scss';

const TABLE_CELL_CLASS = 'table-cell';

const InfiniteLoaderTable = withInfiniteLoader(Table);

const DEFAULT_ROW_HEIGHT = 40;

const withAutoSizer = WrappedComponent => {
    return props => {
        return (
            <div style={{ flex: 1 }}>
                <AutoSizer>
                    {({ width: w, height: h }) => <WrappedComponent {...props} height={h} width={w} />}
                </AutoSizer>
            </div>
        );
    };
};

const TableResponsive = withAutoSizer(Table);

const itemIconCellRenderer = rendererParams => {
    const {
        rowData: { type, extension, hasCollaborations, isExternallyOwned },
        columnData: { itemIconRenderer },
    } = rendererParams;
    return (
        <div className={TABLE_CELL_CLASS}>
            {itemIconRenderer ? (
                itemIconRenderer(rendererParams)
            ) : (
                <ItemListIcon
                    extension={extension}
                    hasCollaborations={hasCollaborations}
                    isExternallyOwned={isExternallyOwned}
                    type={type}
                />
            )}
        </div>
    );
};

const isItemSelected = (itemId, selectedItems) => selectedItems[itemId] !== undefined;

const itemNameCellRenderer = rendererParams => {
    const {
        rowIndex,
        rowData: { id, type, name, label },
        columnData: { selectedItems, onItemNameClick, itemNameLinkRenderer },
    } = rendererParams;
    // loading placeholder may not have name and ItemListName requires name
    return (
        name && (
            <div className={TABLE_CELL_CLASS}>
                <ItemListName
                    isSelected={isItemSelected(id, selectedItems)}
                    itemId={id}
                    label={label}
                    linkRenderer={itemNameLinkRenderer}
                    name={name}
                    onClick={event => onItemNameClick(event, rowIndex)}
                    type={type}
                />
            </div>
        )
    );
};

const renderItemListButton = (contentExplorerMode, id, isActionDisabled, isDisabled, name, selectedItems) =>
    name && (
        <ItemListButton
            contentExplorerMode={contentExplorerMode}
            id={id}
            isDisabled={isActionDisabled}
            isSelected={isItemSelected(id, selectedItems)}
            name={name}
        />
    );

const itemButtonCellRenderer = rendererParams => {
    const {
        columnData: { contentExplorerMode, itemButtonRenderer, selectedItems },
        rowData: { id, isActionDisabled, isDisabled, name },
    } = rendererParams;
    return (
        !isDisabled && (
            <div className={TABLE_CELL_CLASS}>
                {itemButtonRenderer
                    ? itemButtonRenderer(rendererParams)
                    : renderItemListButton(contentExplorerMode, id, isActionDisabled, isDisabled, name, selectedItems)}
            </div>
        )
    );
};

const itemLoadingPlaceholderRenderer = rendererParams => {
    const { loadingPlaceholderColumnWidths, columnIndex } = rendererParams;
    return (
        <div className={TABLE_CELL_CLASS}>
            <ItemListLoadingPlaceholder
                width={loadingPlaceholderColumnWidths && loadingPlaceholderColumnWidths[columnIndex]}
            />
        </div>
    );
};

const ItemList = ({
    additionalColumns,
    contentExplorerMode,
    className = '',
    isResponsive = false,
    items,
    numItemsPerPage,
    numTotalItems,
    selectedItems = {},
    onItemClick,
    onItemDoubleClick,
    onItemNameClick,
    onLoadMoreItems,
    headerHeight,
    headerRenderer,
    itemIconRenderer,
    itemNameLinkRenderer,
    itemButtonRenderer,
    itemRowRenderer = defaultTableRowRenderer,
    noItemsRenderer,
    width,
    height,
    rowHeight = DEFAULT_ROW_HEIGHT,
}) => {
    const getRow = ({ index }) => items[index];

    const getRowClassNames = (index, item) => {
        let result = index === -1 ? 'table-header' : 'table-row';

        if (isItemSelected(item.id, selectedItems)) {
            result = classNames('is-selected', result);
        }
        if (item && (item.isDisabled || item.isLoading)) {
            result = classNames('disabled', result);
        }

        return result;
    };

    const renderRow = rendererParams => {
        const { index, key, style, className: rowClassName, columns } = rendererParams;
        const item = items[index];
        const itemRowClassname = classNames(rowClassName, getRowClassNames(index, item));
        const testId = getProp(rendererParams, 'rowData.id', '');

        if (item.isLoading) {
            return (
                <div key={key} className={itemRowClassname} role="row" style={style}>
                    {columns.map((column, columnIndex) => (
                        <div
                            key={columnIndex}
                            className={column.props.className}
                            role="gridcell"
                            style={column.props.style}
                        >
                            {itemLoadingPlaceholderRenderer({
                                item,
                                columnIndex,
                            })}
                        </div>
                    ))}
                </div>
            );
        }

        const defaultRow = itemRowRenderer({
            ...rendererParams,
            className: itemRowClassname,
        });
        return React.cloneElement(defaultRow, { 'data-testid': `item-row-${testId}` });
    };

    let TableComponent = isResponsive ? TableResponsive : Table;
    const tableProps = {};

    if (onLoadMoreItems) {
        TableComponent = InfiniteLoaderTable;
        tableProps.infiniteLoaderProps = {
            isRowLoaded: getRow,
            loadMoreRows: onLoadMoreItems,
            minimumBatchSize: numItemsPerPage,
            rowCount: numTotalItems,
            threshold: numItemsPerPage,
        };
    }

    if (!noItemsRenderer || items.length > 0) {
        tableProps.headerHeight = headerHeight;
        tableProps.headerRowRenderer = headerRenderer;
    }

    return (
        <div
            className={classNames('content-explorer-item-list table', className, {
                'bdl-ContentExplorerItemList--responsive': isResponsive,
            })}
        >
            <TableComponent
                gridClassName="table-body"
                headerClassName="table-header-item"
                height={height}
                noRowsRenderer={noItemsRenderer}
                onRowClick={onItemClick}
                onRowDoubleClick={onItemDoubleClick}
                rowCount={items.length}
                rowGetter={getRow}
                rowHeight={rowHeight}
                rowRenderer={renderRow}
                width={width}
                {...tableProps}
            >
                <Column
                    cellRenderer={itemIconCellRenderer}
                    className="item-list-icon-col"
                    columnData={{
                        itemIconRenderer,
                    }}
                    dataKey="icon"
                    width={32}
                />
                <Column
                    cellRenderer={itemNameCellRenderer}
                    className="item-list-name-col"
                    columnData={{
                        selectedItems,
                        onItemNameClick,
                        itemNameLinkRenderer,
                    }}
                    dataKey="name"
                    flexGrow={1}
                    flexShrink={0}
                    width={0}
                />
                {additionalColumns}
                <Column
                    cellRenderer={itemButtonCellRenderer}
                    className="item-list-button-col"
                    columnData={{
                        contentExplorerMode,
                        itemButtonRenderer,
                        selectedItems,
                    }}
                    dataKey="button"
                    width={30}
                />
            </TableComponent>
        </div>
    );
};

ItemList.displayName = 'ItemList';

ItemList.propTypes = {
    additionalColumns: PropTypes.arrayOf(PropTypes.element),
    className: PropTypes.string,
    contentExplorerMode: ContentExplorerModePropType.isRequired,
    isResponsive: PropTypes.bool,
    items: ItemsPropType.isRequired,
    numItemsPerPage: PropTypes.number,
    numTotalItems: PropTypes.number,
    selectedItems: ItemsMapPropType.isRequired,
    onItemClick: PropTypes.func,
    onItemDoubleClick: PropTypes.func,
    onItemNameClick: PropTypes.func,
    onLoadMoreItems: PropTypes.func,
    headerHeight: PropTypes.number,
    headerRenderer: PropTypes.func,
    itemIconRenderer: PropTypes.func,
    itemNameLinkRenderer: PropTypes.func,
    itemButtonRenderer: PropTypes.func,
    itemRowRenderer: PropTypes.func,
    noItemsRenderer: PropTypes.func,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rowHeight: PropTypes.number,
};

export { ItemList as ItemListBase };
export default ItemList;
