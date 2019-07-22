// @flow
import * as React from 'react';
import classNames from 'classnames';

import './H4.scss';

type Props = {
    children: React.Node,
    className?: string,
};

const H4 = ({ children, className }: Props) => <h4 className={classNames('bdl-H4', className)}>{children}</h4>;

export default H4;
