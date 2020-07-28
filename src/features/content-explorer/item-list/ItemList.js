import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';

import Column from 'react-virtualized/dist/commonjs/Table/Column';
import Table from 'react-virtualized/dist/commonjs/Table';
import defaultTableRowRenderer from 'react-virtualized/dist/commonjs/Table/defaultRowRenderer';
import 'react-virtualized/styles.css';

import { withInfiniteLoader } from '../../../components/react-virtualized-helpers';

import { ContentExplorerModePropType, ItemsPropType, ItemsMapPropType } from '../prop-types';

import ItemListIcon from './ItemListIcon';
import ItemListLoadingPlaceholder from './ItemListLoadingPlaceholder';
import ItemListName from './ItemListName';
import ItemListButton from './ItemListButton';

import './ItemList.scss';

const TABLE_CELL_CLASS = 'table-cell';

const InfiniteLoaderTable = withInfiniteLoader(Table);

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
                    type={type}
                    extension={extension}
                    hasCollaborations={hasCollaborations}
                    isExternallyOwned={isExternallyOwned}
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
                    type={type}
                    name={name}
                    label={label}
                    isSelected={isItemSelected(id, selectedItems)}
                    onClick={event => onItemNameClick(event, rowIndex)}
                    linkRenderer={itemNameLinkRenderer}
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
    contentExplorerMode,
    className = '',
    items,
    numItemsPerPage,
    numTotalItems,
    selectedItems = {},
    onItemClick,
    onItemDoubleClick,
    onItemNameClick,
    onLoadMoreItems,
    itemIconRenderer,
    itemNameLinkRenderer,
    itemButtonRenderer,
    noItemsRenderer,
    width,
    height,
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
                <div key={key} style={style} className={itemRowClassname} role="row">
                    {columns.map((column, columnIndex) => (
                        <div
                            key={columnIndex}
                            className={column.props.className}
                            style={column.props.style}
                            role="gridcell"
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

        const defaultRow = defaultTableRowRenderer({
            ...rendererParams,
            className: itemRowClassname,
        });
        return React.cloneElement(defaultRow, { 'data-testid': `item-row-${testId}` });
    };

    let TableComponent = Table;
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

    return (
        <div className={classNames('content-explorer-item-list table', className)}>
            <TableComponent
                gridClassName="table-body"
                headerClassName="table-header-item"
                width={width}
                height={height}
                rowHeight={40}
                rowCount={items.length}
                onRowClick={onItemClick}
                onRowDoubleClick={onItemDoubleClick}
                rowGetter={getRow}
                rowRenderer={renderRow}
                noRowsRenderer={noItemsRenderer}
                {...tableProps}
            >
                <Column
                    className="item-list-icon-col"
                    cellRenderer={itemIconCellRenderer}
                    columnData={{
                        itemIconRenderer,
                    }}
                    dataKey="icon"
                    width={32}
                />
                <Column
                    className="item-list-name-col"
                    cellRenderer={itemNameCellRenderer}
                    columnData={{
                        selectedItems,
                        onItemNameClick,
                        itemNameLinkRenderer,
                    }}
                    dataKey="name"
                    width={0}
                    flexGrow={1}
                    flexShrink={0}
                />
                <Column
                    className="item-list-button-col"
                    cellRenderer={itemButtonCellRenderer}
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
    className: PropTypes.string,
    contentExplorerMode: ContentExplorerModePropType.isRequired,
    items: ItemsPropType.isRequired,
    numItemsPerPage: PropTypes.number,
    numTotalItems: PropTypes.number,
    selectedItems: ItemsMapPropType.isRequired,
    onItemClick: PropTypes.func,
    onItemDoubleClick: PropTypes.func,
    onItemNameClick: PropTypes.func,
    onLoadMoreItems: PropTypes.func,
    itemIconRenderer: PropTypes.func,
    itemNameLinkRenderer: PropTypes.func,
    itemButtonRenderer: PropTypes.func,
    noItemsRenderer: PropTypes.func,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};

export { ItemList as ItemListBase };
export default ItemList;
