// @flow
import * as React from 'react';
import classNames from 'classnames';

import './H5.scss';

type Props = {
    children: React.Node,
    className?: string,
};

const H5 = ({ children, className }: Props) => <h5 className={classNames('bdl-H5', className)}>{children}</h5>;

export default H5;
