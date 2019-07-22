// @flow
import * as React from 'react';
import classNames from 'classnames';

import './H2.scss';

type Props = {
    children: React.Node,
    className?: string,
};

const H2 = ({ children, className }: Props) => <h2 className={classNames('bdl-H2', className)}>{children}</h2>;

export default H2;
