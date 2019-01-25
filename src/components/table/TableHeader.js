// @flow
import * as React from 'react';
import classNames from 'classnames';

import TableRow from './TableRow';

type Props = {
    children: React.Node,
    className?: string,
    rowClassName?: string,
};

const TableHeader = ({ children, className = '', rowClassName = '' }: Props) => (
    <thead className={classNames('table-header', className)}>
        <TableRow className={rowClassName}>{children}</TableRow>
    </thead>
);

export default TableHeader;
