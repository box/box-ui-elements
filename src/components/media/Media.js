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
    children: React.ChildrenArray<
        React.Element<typeof MediaFigure | typeof MediaBody | typeof MediaMenu> | false | null,
    >,
    /** Additional class names */
    className?: string,
};

const Media = ({ as: Wrapper, children, className, ...rest }: Props) => (
    <Wrapper className={classnames('bdl-Media', className)} {...rest}>
        {children}
    </Wrapper>
);

// Use this instead of default value because of param destructuring bug in Flow
// that affects union types
// https://github.com/facebook/flow/issues/5461
Media.defaultProps = {
    as: 'div',
};

Media.Body = MediaBody;
Media.Menu = MediaMenu;
Media.Figure = MediaFigure;

export default Media;
