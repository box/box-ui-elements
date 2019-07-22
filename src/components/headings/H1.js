// @flow
import * as React from 'react';
import classNames from 'classnames';

import './H1.scss';

type Props = {
    children: React.Node,
    className?: string,
};

const H1 = ({ children, className }: Props) => <h1 className={classNames('bdl-H1', className)}>{children}</h1>;

export default H1;
