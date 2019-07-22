// @flow
import * as React from 'react';
import classNames from 'classnames';

import './H3.scss';

type Props = {
    children: React.Node,
    className?: string,
};

const H3 = ({ children, className }: Props) => <h3 className={classNames('bdl-H3', className)}>{children}</h3>;

export default H3;
