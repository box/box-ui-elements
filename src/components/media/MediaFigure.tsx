import * as React from 'react';
import classnames from 'classnames';

import './Media.scss';

export interface MediaFigureProps {
    /** Component to use as outermost element, e.g., 'div' */
    as?: React.ElementType;

    /** Child elements */
    children: React.ReactNode;

    /** Additional class names */
    className?: string;

    /** Additional inline styles */
    style?: React.CSSProperties;
}

const MediaFigure = ({ as: Wrapper = 'figure', className, children, ...rest }: MediaFigureProps) => (
    <Wrapper className={classnames('bdl-Media-figure', className)} {...rest}>
        {children}
    </Wrapper>
);

export default MediaFigure;
