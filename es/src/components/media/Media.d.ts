import * as React from 'react';
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
declare const Media: {
    ({ as: Wrapper, children, className, ...rest }: MediaProps): React.JSX.Element;
    Body: ({ className, children, ...rest }: import("./MediaBody").MediaBodyProps) => React.JSX.Element;
    Menu: React.FC<import("react-intl").WithIntlProps<import("./MediaMenu").MediaMenuProps>> & {
        WrappedComponent: React.ComponentType<import("./MediaMenu").MediaMenuProps>;
    };
    Figure: ({ as: Wrapper, className, children, ...rest }: import("./MediaFigure").MediaFigureProps) => React.JSX.Element;
};
export default Media;
