import * as React from 'react';
import classNames from 'classnames';

export interface TableBodyProps {
    /** Body rows of the table */
    children: React.ReactNode;
    /** Additional CSS class for the table body */
    className?: string;
}

const TableBody = ({ children, className = '' }: TableBodyProps) => (
    <tbody className={classNames('table-body', className)}>{children}</tbody>
);

export default TableBody;
