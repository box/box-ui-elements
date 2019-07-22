// @flow
import * as React from 'react';
import classNames from 'classnames';

import './H6.scss';

type Props = {
    children: React.Node,
    className?: string,
};

const H6 = ({ children, className }: Props) => <h6 className={classNames('bdl-H6', className)}>{children}</h6>;

export default H6;
