import * as React from 'react';
import classNames from 'classnames';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    /** Contents of the table cell */
    children: React.ReactNode;
    /** Additional CSS class for the cell */
    className?: string;
    /** Whether the cell has a fixed width */
    isFixedWidth?: boolean;
}

const TableCell = ({ children, className = '', isFixedWidth = false, ...rest }: TableCellProps) => (
    <td
        className={classNames('table-cell', className, {
            'is-fixed-width': isFixedWidth,
        })}
        {...rest}
    >
        {children}
    </td>
);

export default TableCell;
