import * as React from 'react';
import './Badgeable.scss';
type Props = {
    /** Component to render when badging the bottom left corner of the rendered container */
    bottomLeft?: React.ReactNode;
    /** Component to render when badging the bottom right corner of the rendered container */
    bottomRight?: React.ReactNode;
    /** the item(s) to receive the badge */
    children: React.ReactNode;
    className?: string;
    /** Component to render when badging the top left corner of the rendered container */
    topLeft?: React.ReactNode;
    /** Component to render when badging the top right corner of the rendered container */
    topRight?: React.ReactNode;
};
declare const Badgeable: (props: Props) => React.JSX.Element;
export default Badgeable;
