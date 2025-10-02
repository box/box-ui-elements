import * as React from 'react';
import './Ghost.scss';
type Dimension = string | number;
type Props = {
    /** style.borderRadius */
    borderRadius?: Dimension;
    /** classnames in addition to .bdl-Ghost */
    className?: string;
    /** style.height */
    height?: Dimension;
    /** Set to false to remove animated background effect */
    isAnimated?: boolean;
    /** inline styles merged with height/width/radius options */
    style?: {};
    /** style.width */
    width?: Dimension;
};
declare const Ghost: ({ isAnimated, className, height, width, borderRadius, style, ...rest }: Props) => React.JSX.Element;
export default Ghost;
