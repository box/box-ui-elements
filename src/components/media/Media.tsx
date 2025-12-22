import * as React from 'react';
import classnames from 'classnames';

import MediaFigure from './MediaFigure';
import MediaBody from './MediaBody';
import MediaMenu from './MediaMenu';
import './Media.scss';

export interface MediaProps {
    /** Component to use as outermost element, e.g., 'li' */
    as?: React.ElementType;

    /** Child elements */
    children: Array<React.ReactElement<typeof MediaFigure | typeof MediaBody | typeof MediaMenu>>;

    /** Additional class names */
    className?: string;

    /** Additional inline styles */
    style?: React.CSSProperties;
}

type MediaComponent = React.FC<MediaProps> & {
    Body: typeof MediaBody;
    Menu: typeof MediaMenu;
    Figure: typeof MediaFigure;
};

const Media: MediaComponent = ({ as: Wrapper = 'div', children, className, ...rest }: MediaProps) =>
    (
        <Wrapper className={classnames('bdl-Media', className)} {...rest}>
            {children}
        </Wrapper>
    ) as MediaComponent;

Media.Body = MediaBody;
Media.Menu = MediaMenu;
Media.Figure = MediaFigure;

export default Media;
