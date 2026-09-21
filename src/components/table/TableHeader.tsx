import * as React from 'react';
import classNames from 'classnames';

import TableRow from './TableRow';

export interface TableHeaderProps {
    /** Header cells of the table */
    children: React.ReactNode;
    /** Additional CSS class for the table header */
    className?: string;
    /** Additional CSS class for the header row */
    rowClassName?: string;
}

const TableHeader = ({ children, className = '', rowClassName = '' }: TableHeaderProps) => (
    <thead className={classNames('table-header', className)}>
        <TableRow className={rowClassName}>{children}</TableRow>
    </thead>
);

export default TableHeader;
