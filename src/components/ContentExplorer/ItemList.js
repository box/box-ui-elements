/**
 * @flow
 * @file Item list component
 * @author Box
 */

import React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/styles.css';
import KeyBinder from '../KeyBinder';
import headerCellRenderer from './headerCellRenderer';
import sizeCellRenderer from './sizeCellRenderer';
import dateCellRenderer from './dateCellRenderer';
import nameCellRenderer from '../Item/nameCellRenderer';
import iconCellRenderer from '../Item/iconCellRenderer';
import moreOptionsCellRenderer from './moreOptionsCellRenderer';
import { focus } from '../../util/dom';
import messages from '../messages';
import {
    FIELD_NAME,
    FIELD_ID,
    FIELD_MODIFIED_AT,
    FIELD_INTERACTED_AT,
    FIELD_SIZE,
    VIEW_RECENTS
} from '../../constants';

import './ItemList.scss';

type Props = {
    view: View,
    rootElement: HTMLElement,
    isSmall: boolean,
    isMedium: boolean,
    isTouch: boolean,
    rootId: string,
    focusedRow: number,
    canShare: boolean,
    canDownload: boolean,
    canDelete: boolean,
    canPreview: boolean,
    canRename: boolean,
    onItemClick: Function,
    onItemDownload: Function,
    onItemSelect: Function,
    onItemDelete: Function,
    onItemRename: Function,
    onItemShare: Function,
    onItemPreview: Function,
    onSortChange: Function,
    tableRef: Function,
    currentCollection: Collection
} & InjectIntlProvidedProps;

const ItemList = ({
    view,
    isSmall,
    isMedium,
    isTouch,
    rootId,
    rootElement,
    canShare,
    canDownload,
    canDelete,
    canPreview,
    canRename,
    onItemClick,
    onItemSelect,
    onItemDelete,
    onItemDownload,
    onItemRename,
    onItemShare,
    onItemPreview,
    onSortChange,
    currentCollection,
    tableRef,
    focusedRow,
    intl
}: Props) => {
    const nameCell = nameCellRenderer(
        rootId,
        view,
        onItemClick,
        onItemSelect,
        canPreview,
        isSmall, // shows details if false
        isTouch
    );
    const iconCell = iconCellRenderer();
    const dateCell = dateCellRenderer();
    const sizeAccessCell = sizeCellRenderer();
    const moreOptionsCell = moreOptionsCellRenderer(
        canPreview,
        canShare,
        canDownload,
        canDelete,
        canRename,
        onItemSelect,
        onItemDelete,
        onItemDownload,
        onItemRename,
        onItemShare,
        onItemPreview,
        isSmall
    );
    const isRecents: boolean = view === VIEW_RECENTS;
    const { id, items = [], sortBy, sortDirection }: Collection = currentCollection;
    const rowCount: number = items.length;
    const rowClassName = ({ index }) => {
        if (index === -1) {
            return 'bce-item-header-row';
        }
        const { selected } = items[index];
        return classNames(`bce-item-row bce-item-row-${index}`, {
            'bce-item-row-selected': selected
        });
    };
    const sort = ({ sortBy: by, sortDirection: direction }) => {
        onSortChange(by, direction);
    };

    return (
        <KeyBinder
            id={id}
            items={items}
            columnCount={1}
            rowCount={rowCount}
            className='bce-item-grid'
            onRename={onItemRename}
            onShare={onItemShare}
            onDownload={onItemDownload}
            onOpen={onItemClick}
            onSelect={onItemSelect}
            onDelete={onItemDelete}
            scrollToRow={focusedRow}
            onScrollToChange={({ scrollToRow }) => focus(rootElement, `.bce-item-row-${scrollToRow}`)}
        >
            {({ onSectionRendered, scrollToRow, focusOnRender }) => (
                <AutoSizer>
                    {({ width, height }) => (
                        <Table
                            width={width}
                            height={height}
                            headerHeight={isSmall ? 0 : 40}
                            rowHeight={50}
                            rowCount={rowCount}
                            rowGetter={({ index }) => items[index]}
                            ref={tableRef}
                            sort={sort}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            rowClassName={rowClassName}
                            onRowClick={({ rowData }) => onItemSelect(rowData)}
                            scrollToIndex={scrollToRow}
                            onRowsRendered={({ startIndex, stopIndex }) => {
                                onSectionRendered({ rowStartIndex: startIndex, rowStopIndex: stopIndex });
                                if (focusOnRender) {
                                    focus(rootElement, `.bce-item-row-${scrollToRow}`);
                                }
                            }}
                        >
                            <Column
                                disableSort
                                dataKey={FIELD_ID}
                                cellRenderer={iconCell}
                                width={isSmall ? 30 : 50}
                                flexShrink={0}
                            />
                            <Column
                                label={intl.formatMessage(messages.name)}
                                dataKey={FIELD_NAME}
                                cellRenderer={nameCell}
                                headerRenderer={headerCellRenderer}
                                width={300}
                                flexGrow={1}
                            />
                            {isSmall ? null : (
                                <Column
                                    className='bce-item-coloumn'
                                    label={
                                        isRecents
                                            ? intl.formatMessage(messages.interacted)
                                            : intl.formatMessage(messages.modified)
                                    }
                                    dataKey={isRecents ? FIELD_INTERACTED_AT : FIELD_MODIFIED_AT}
                                    cellRenderer={dateCell}
                                    headerRenderer={headerCellRenderer}
                                    width={isRecents ? 120 : 300}
                                    flexGrow={1}
                                />
                            )}
                            {isSmall || isMedium ? null : (
                                <Column
                                    className='bce-item-coloumn'
                                    label={intl.formatMessage(messages.size)}
                                    dataKey={FIELD_SIZE}
                                    cellRenderer={sizeAccessCell}
                                    headerRenderer={headerCellRenderer}
                                    width={80}
                                    flexShrink={0}
                                />
                            )}
                            <Column
                                disableSort
                                dataKey={FIELD_ID}
                                cellRenderer={moreOptionsCell}
                                width={isSmall || !canShare ? 58 : 140}
                                flexShrink={0}
                            />
                        </Table>
                    )}
                </AutoSizer>
            )}
        </KeyBinder>
    );
};

export default injectIntl(ItemList);
