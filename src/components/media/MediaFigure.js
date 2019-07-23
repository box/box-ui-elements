// @flow
import * as React from 'react';
import classnames from 'classnames';
import './Media.scss';

type Props = {
    /** Component to use as outermost element, e.g., 'div' */
    as: React.ElementType,
    /** Child elements */
    children: React.Node,
    /** Additional class names */
    className?: string,
};

const MediaFigure = ({ as: Wrapper, className, children, ...rest }: Props) => (
    <Wrapper className={classnames('bdl-Media-figure', className)} {...rest}>
        {children}
    </Wrapper>
);

// Use this instead of default value because of param destructuring bug in Flow
// that affects union types
// https://github.com/facebook/flow/issues/5461
MediaFigure.defaultProps = {
    as: 'figure',
};

export default MediaFigure;
