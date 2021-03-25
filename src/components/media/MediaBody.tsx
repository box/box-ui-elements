import * as React from 'react';
import classnames from 'classnames';

import './Media.scss';

export interface MediaBodyProps {
    /** Child elements */
    children: React.ReactNode;

    /** Additional class names */
    className?: string;

    /** Additional inline styles */
    style?: React.CSSProperties;
}

const MediaBody = ({ className, children, ...rest }: MediaBodyProps) => (
    <div className={classnames('bdl-Media-body', className)} {...rest}>
        {children}
    </div>
);

export default MediaBody;
