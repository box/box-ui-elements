// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
};

const TableBody = ({ children, className = '' }: Props) => (
    <tbody className={classNames('table-body', className)}>{children}</tbody>
);

export default TableBody;
