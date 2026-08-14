// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
    isFixedWidth?: boolean,
};

const TableCell = ({ children, className = '', isFixedWidth = false, ...rest }: Props) => (
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
