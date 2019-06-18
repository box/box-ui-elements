/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import Table from 'react-virtualized/dist/es/Table';
import 'react-virtualized/styles.css';

import pure from '../../pure-component';

import '../styles/Table.scss';

type Props = {
    autoHeight?: boolean,
    children?: any, // required
    className?: string,
    disableHeader?: boolean,
    headerClassName?: string,
    headerHeight?: number,
    height: number,
    isStriped: boolean,
    onRowClick?: Function,
    onRowsRendered?: Function,
    onScroll?: Function,
    rowCount: number,
    rowGetter: Function,
    rowHeight?: number,
    rowRenderer?: Function,
    scrollTop?: number,
    sortColumn?: string,
    sortDirection?: string,
    width: number,
};

const BaseTable = pure(
    ({
        autoHeight = false,
        children,
        className = '',
        disableHeader = false,
        headerClassName = '',
        headerHeight = 40,
        height,
        isStriped = false,
        onRowClick,
        onRowsRendered,
        onScroll,
        rowCount,
        rowGetter,
        rowHeight = 50,
        rowRenderer,
        scrollTop,
        sortColumn,
        sortDirection = 'ASC',
        width,
    }: Props) => {
        const rowClassName = ({ index }) => {
            if (index === -1) {
                return 'table-header';
            }
            let rowClass = 'table-row';
            if (isStriped && index % 2 === 0) {
                // can't target odd elements in css because row elements can disappear
                rowClass += ' has-stripe';
            }
            return rowClass;
        };

        return (
            <Table
                autoHeight={autoHeight}
                className={classNames('table', className, {
                    'is-striped': isStriped,
                })}
                disableHeader={disableHeader}
                gridClassName="table-body"
                headerClassName={`table-header-item ${headerClassName}`}
                headerHeight={headerHeight}
                height={height}
                onRowClick={onRowClick}
                onRowsRendered={onRowsRendered}
                onScroll={onScroll}
                rowClassName={rowClassName}
                rowCount={rowCount}
                rowGetter={rowGetter}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer || undefined}
                scrollTop={scrollTop}
                sortBy={sortColumn}
                sortDirection={sortDirection}
                tabIndex={null}
                width={width}
            >
                {children}
            </Table>
        );
    },
);

BaseTable.displayName = 'BaseTable';
export default BaseTable;
