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

function MediaImg(props: Props) {
    const { className, children, ...rest } = props;
    return (
        <div className={classnames('bdl-Media-img', className)} {...rest}>
            {children}
        </div>
    );
}

export default MediaImg;
