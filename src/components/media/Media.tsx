import * as React from 'react';
import classnames from 'classnames';

import MediaFigure from './MediaFigure';
import MediaBody from './MediaBody';
import MediaMenu from './MediaMenu';
import './Media.scss';

type Props = {
    /** Component to use as outermost element, e.g., 'li' */
    as?: React.ElementType;

    /** Child elements */
    children: Array<React.ReactElement<typeof MediaFigure | typeof MediaBody | typeof MediaMenu>> | React.ReactNode;

    /** Additional class names */
    className?: string;
} & React.HTMLAttributes<HTMLOrSVGElement>;

const Media = ({ as: Wrapper = 'div', children, className, ...rest }: Props) => (
    <Wrapper className={classnames('bdl-Media', className)} {...rest}>
        {children}
    </Wrapper>
);

Media.Body = MediaBody;
Media.Menu = MediaMenu;
Media.Figure = MediaFigure;

export default Media;
