import * as React from 'react';
import classNames from 'classnames';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    /** Cells of the table row */
    children: React.ReactNode;
    /** Additional CSS class for the row */
    className?: string;
    /** Ref for the table row element */
    rowRef?: React.Ref<HTMLTableRowElement>;
}

const TableRow = ({ children, className = '', rowRef, ...rest }: TableRowProps) => (
    <tr ref={rowRef} className={classNames('table-row', className)} {...rest}>
        {children}
    </tr>
);

export default TableRow;
