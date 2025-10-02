// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children?: React.Node,
    className?: string,
    isFixedWidth?: boolean,
};

const TableHeaderCell = ({ children, className = '', isFixedWidth = false, ...rest }: Props) => (
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
