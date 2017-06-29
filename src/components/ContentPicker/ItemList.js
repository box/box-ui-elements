/**
 * @flow
 * @file Item list component
 * @author Box
 */

import React from 'react';
import classNames from 'classnames';
import { Table, Column } from 'react-virtualized/dist/es/Table';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import 'react-virtualized/styles.css';
import shareAccessCellRenderer from './shareAccessCellRenderer';
import checkboxCellRenderer from './checkboxCellRenderer';
import nameCellRenderer from '../Item/nameCellRenderer';
import iconCellRenderer from '../Item/iconCellRenderer';
import isRowSelectable from './cellRendererHelper';
import isActionableElement from '../../util/dom';
import { VIEW_SELECTED, FIELD_NAME, FIELD_ID, FIELD_SHARED_LINK, TYPE_FOLDER } from '../../constants';
import type { View, BoxItem } from '../../flowTypes';
import './ItemList.scss';

type Props = {
    rootId: string,
    onItemSelect: Function,
    onItemClick: Function,
    canSetShareAccess: boolean,
    tableRef: Function,
    selectableType: string,
    hasHitSelectionLimit: boolean,
    onShareAccessChange: Function,
    extensionsWhitelist: string[],
    getLocalizedMessage: Function,
    items?: BoxItem[],
    isSmall: boolean,
    view: View
};

const ItemList = ({
    view,
    rootId,
    isSmall,
    selectableType,
    canSetShareAccess,
    hasHitSelectionLimit,
    extensionsWhitelist,
    onItemSelect,
    onItemClick,
    onShareAccessChange,
    items = [],
    tableRef,
    getLocalizedMessage
}: Props) =>
    <AutoSizer>
        {({ width, height }) => {
            const iconCell = iconCellRenderer();
            const nameCell = nameCellRenderer(rootId, getLocalizedMessage, view, onItemClick);
            const checkboxCell = checkboxCellRenderer(
                onItemSelect,
                selectableType,
                extensionsWhitelist,
                hasHitSelectionLimit
            );
            const shareAccessCell = shareAccessCellRenderer(
                onShareAccessChange,
                canSetShareAccess,
                selectableType,
                extensionsWhitelist,
                hasHitSelectionLimit,
                getLocalizedMessage
            );

            const rowClassName = ({ index }) => {
                if (index === -1) {
                    return '';
                }
                const { selected, type } = items[index];
                const isSelectable = isRowSelectable(
                    selectableType,
                    extensionsWhitelist,
                    hasHitSelectionLimit,
                    items[index]
                );
                return classNames('bcp-item-row', {
                    'bcp-item-row-selected': selected && view !== VIEW_SELECTED,
                    'bcp-item-row-unselectable': type !== TYPE_FOLDER && !isSelectable // folder row should never dim
                });
            };

            const onRowClick = ({ event, rowData }: { event: Event & { target: HTMLElement }, rowData: BoxItem }) => {
                // If the click is happening on a clickable element on the item row, ignore row selection
                if (
                    isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData) &&
                    !isActionableElement(event.target)
                ) {
                    onItemSelect(rowData);
                }
            };

            return (
                <Table
                    width={width}
                    height={height}
                    disableHeader
                    headerHeight={0}
                    rowHeight={50}
                    rowCount={items.length}
                    rowGetter={({ index }) => items[index]}
                    ref={tableRef}
                    rowClassName={rowClassName}
                    onRowClick={onRowClick}
                >
                    <Column dataKey={FIELD_ID} cellRenderer={iconCell} width={isSmall ? 30 : 50} flexShrink={0} />
                    <Column dataKey={FIELD_NAME} cellRenderer={nameCell} width={300} flexGrow={1} />
                    {isSmall
                        ? null
                        : <Column
                            dataKey={FIELD_SHARED_LINK}
                            cellRenderer={shareAccessCell}
                            width={220}
                            flexShrink={0}
                          />}
                    <Column dataKey={FIELD_ID} cellRenderer={checkboxCell} width={isSmall ? 20 : 30} flexShrink={0} />
                </Table>
            );
        }}
    </AutoSizer>;

export default ItemList;
