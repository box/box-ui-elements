// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
    rowRef?: Function,
};

const TableRow = ({ children, className = '', rowRef, ...rest }: Props) => (
    <tr ref={rowRef} className={classNames('table-row', className)} {...rest}>
        {children}
    </tr>
);

export default TableRow;
