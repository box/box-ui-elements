// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
    isCompact?: boolean,
};

const Table = ({ children, className = '', isCompact = false, ...rest }: Props) => (
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
