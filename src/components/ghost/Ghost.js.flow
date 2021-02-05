// @flow
import * as React from 'react';
import classNames from 'classnames';
import './Ghost.scss';

// A dimension compatible with React's handling of the "style" prop
type Dimension = string | number;

type Props = {
    /** style.borderRadius */
    borderRadius?: Dimension,
    /** classnames in addition to .bdl-Ghost */
    className?: string,
    /** style.height */
    height?: Dimension,
    /** Set to false to remove animated background effect */
    isAnimated?: boolean,
    /** inline styles merged with height/width/radius options */
    style?: {},
    /** style.width */
    width?: Dimension,
};

const Ghost = ({ isAnimated = true, className, height, width, borderRadius, style = {}, ...rest }: Props) => (
    <span
        className={classNames(className, 'bdl-Ghost', { 'bdl-Ghost--isAnimated': isAnimated })}
        style={{ height, width, borderRadius, ...style }}
        {...rest}
    />
);

export default Ghost;
