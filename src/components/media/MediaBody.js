// @flow
import * as React from 'react';
import classnames from 'classnames';
import './Media.scss';

type Props = {
    /** Child elements */
    children: React.Node,
    /** Additional class names */
    className?: string,
};

const MediaBody = ({ className, children, ...rest }: Props) => (
    <div className={classnames('bdl-Media-body', className)} {...rest}>
        {children}
    </div>
);

export default MediaBody;
