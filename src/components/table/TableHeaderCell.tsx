import * as React from 'react';
import classNames from 'classnames';

export interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    /** Contents of the header cell */
    children?: React.ReactNode;
    /** Additional CSS class for the header cell */
    className?: string;
    /** Whether the header cell has a fixed width */
    isFixedWidth?: boolean;
}

const TableHeaderCell = ({ children, className = '', isFixedWidth = false, ...rest }: TableHeaderCellProps) => (
    <th
        className={classNames('table-cell', className, {
            'is-fixed-width': isFixedWidth,
        })}
        {...rest}
    >
        {children}
    </th>
);

export default TableHeaderCell;
