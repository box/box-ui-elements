// @flow
import * as React from 'react';
import classnames from 'classnames';
import MediaFigure from './MediaFigure';
import MediaBody from './MediaBody';
import MediaMenu from './MediaMenu';
import './Media.scss';

type Props = {
    /** Component to use as outermost element, e.g., 'li' */
    as: React.ElementType,
    /** Child elements */
    children: React.ChildrenArray<React.Element<typeof MediaFigure | typeof MediaBody | typeof MediaMenu>>,
    /** Additional class names */
    className?: string,
};

function Media({ as: Wrapper, children, className, ...rest }: Props) {
    return (
        <Wrapper className={classnames('bdl-Media', className)} {...rest}>
            {children}
        </Wrapper>
    );
}

Media.defaultProps = {
    as: 'div',
};

Media.Body = MediaBody;
Media.Menu = MediaMenu;
Media.Figure = MediaFigure;

export default Media;
