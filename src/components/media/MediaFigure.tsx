import * as React from 'react';
import classnames from 'classnames';

import './Media.scss';

type Props = {
    /** Component to use as outermost element, e.g., 'div' */
    as?: React.ElementType;

    /** Child elements */
    children: React.ReactNode;

    /** Additional class names */
    className?: string;
} & React.HTMLAttributes<HTMLOrSVGElement>;

const MediaFigure = ({ as: Wrapper = 'figure', className, children, ...rest }: Props) => (
    <Wrapper className={classnames('bdl-Media-figure', className)} {...rest}>
        {children}
    </Wrapper>
);

export default MediaFigure;
