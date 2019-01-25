// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
    rowRef?: Function,
};

const TableRow = ({ children, className = '', rowRef, ...rest }: Props) => (
    <tr className={classNames('table-row', className)} ref={rowRef} {...rest}>
        {children}
    </tr>
);

export default TableRow;
