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

function MediaFigure({ as: Wrapper, className, children, ...rest }: Props) {
    return (
        <Wrapper className={classnames('bdl-Media-figure', className)} {...rest}>
            {children}
        </Wrapper>
    );
}

MediaFigure.defaultProps = {
    as: 'figure',
};

export default MediaFigure;
