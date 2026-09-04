import * as React from 'react';
import classNames from 'classnames';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    /** Contents of the table */
    children: React.ReactNode;
    /** Additional CSS class for the table */
    className?: string;
    /** Whether to render the table in compact mode */
    isCompact?: boolean;
}

const Table = ({ children, className = '', isCompact = false, ...rest }: TableProps) => (
    <table
        className={classNames('table', className, {
            'is-compact': isCompact,
        })}
        {...rest}
    >
        {children}
    </table>
);

export default Table;
