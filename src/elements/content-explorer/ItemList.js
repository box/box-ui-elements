/**
 * @flow
 * @file Item list component
 * @author Box
 */

import React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import { Table, Column } from '@box/react-virtualized/dist/es/Table';
import AutoSizer from '@box/react-virtualized/dist/es/AutoSizer';
import KeyBinder from '../common/KeyBinder';
import nameCellRenderer from '../common/item/nameCellRenderer';
import iconCellRenderer from '../common/item/iconCellRenderer';
import { focus } from '../../utils/dom';
import messages from '../common/messages';
import headerCellRenderer from './headerCellRenderer';
import sizeCellRenderer from './sizeCellRenderer';
import dateCellRenderer from './dateCellRenderer';
import moreOptionsCellRenderer from './moreOptionsCellRenderer';
import { FIELD_DATE, FIELD_ID, FIELD_NAME, FIELD_SIZE, VIEW_FOLDER, VIEW_RECENTS } from '../../constants';
import type { View, Collection } from '../../common/types/core';
import '@box/react-virtualized/styles.css';
import './ItemList.scss';

type Props = {
    canDelete: boolean,
    canDownload: boolean,
    canPreview: boolean,
    canRename: boolean,
    canShare: boolean,
    currentCollection: Collection,
    focusedRow: number,
    isMedium: boolean,
    isSmall: boolean,
    isTouch: boolean,
    onItemClick: Function,
    onItemDelete: Function,
    onItemDownload: Function,
    onItemPreview: Function,
    onItemRename: Function,
    onItemSelect: Function,
    onItemShare: Function,
    onSortChange: Function,
    rootElement: HTMLElement,
    rootId: string,
    tableRef: Function,
    view: View,
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
    intl,
}: Props) => {
    const nameCell = nameCellRenderer(
        rootId,
        view,
        onItemClick,
        onItemSelect,
        canPreview,
        isSmall, // shows details if false
        isTouch,
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
        isSmall,
    );
    const isRecents: boolean = view === VIEW_RECENTS;
    const hasSort: boolean = view === VIEW_FOLDER;
    const { id, items = [], sortBy, sortDirection }: Collection = currentCollection;
    const rowCount: number = items.length;
    const rowClassName = ({ index }) => {
        if (index === -1) {
            return 'bce-item-header-row';
        }

        const { selected } = items[index];
        return classNames(`bce-item-row bce-item-row-${index}`, {
            'bce-item-row-selected': selected,
        });
    };

    const sort = ({ sortBy: by, sortDirection: direction }) => {
        onSortChange(by, direction);
    };

    return (
        <KeyBinder
            className="bce-item-grid"
            columnCount={1}
            id={id}
            items={items}
            onDelete={onItemDelete}
            onDownload={onItemDownload}
            onOpen={onItemClick}
            onRename={onItemRename}
            onScrollToChange={({ scrollToRow }) => focus(rootElement, `.bce-item-row-${scrollToRow}`)}
            onSelect={onItemSelect}
            onShare={onItemShare}
            rowCount={rowCount}
            scrollToRow={focusedRow}
        >
            {({ onSectionRendered, scrollToRow, focusOnRender }) => (
                <AutoSizer>
                    {({ width, height }) => (
                        <Table
                            ref={tableRef}
                            headerHeight={isSmall ? 0 : 40}
                            height={height}
                            onRowClick={({ rowData }) => onItemSelect(rowData)}
                            onRowsRendered={({ startIndex, stopIndex }) => {
                                onSectionRendered({
                                    rowStartIndex: startIndex,
                                    rowStopIndex: stopIndex,
                                });
                                if (focusOnRender) {
                                    focus(rootElement, `.bce-item-row-${scrollToRow}`);
                                }
                            }}
                            rowClassName={rowClassName}
                            rowCount={rowCount}
                            rowGetter={({ index }) => items[index]}
                            rowHeight={50}
                            scrollToIndex={scrollToRow}
                            sort={sort}
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            width={width}
                        >
                            <Column
                                cellRenderer={iconCell}
                                dataKey={FIELD_ID}
                                disableSort
                                flexShrink={0}
                                headerRole="gridcell"
                                width={isSmall ? 30 : 50}
                            />
                            <Column
                                cellRenderer={nameCell}
                                dataKey={FIELD_NAME}
                                disableSort={!hasSort}
                                flexGrow={1}
                                headerRenderer={headerCellRenderer}
                                label={intl.formatMessage(messages.name)}
                                width={300}
                            />
                            {isSmall ? null : (
                                <Column
                                    cellRenderer={dateCell}
                                    className="bce-item-column"
                                    dataKey={FIELD_DATE}
                                    disableSort={!hasSort}
                                    flexGrow={1}
                                    headerRenderer={headerCellRenderer}
                                    label={
                                        isRecents
                                            ? intl.formatMessage(messages.interacted)
                                            : intl.formatMessage(messages.modified)
                                    }
                                    width={isRecents ? 120 : 300}
                                />
                            )}
                            {isSmall || isMedium ? null : (
                                <Column
                                    cellRenderer={sizeAccessCell}
                                    className="bce-item-column"
                                    dataKey={FIELD_SIZE}
                                    disableSort={!hasSort}
                                    flexShrink={0}
                                    headerRenderer={headerCellRenderer}
                                    label={intl.formatMessage(messages.size)}
                                    width={80}
                                />
                            )}
                            <Column
                                cellRenderer={moreOptionsCell}
                                dataKey={FIELD_ID}
                                disableSort
                                flexShrink={0}
                                headerRole="gridcell"
                                width={isSmall || !canShare ? 58 : 140}
                            />
                        </Table>
                    )}
                </AutoSizer>
            )}
        </KeyBinder>
    );
};

export default injectIntl(ItemList);
