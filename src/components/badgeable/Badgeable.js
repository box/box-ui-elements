// @flow
import * as React from 'react';

import './Badgeable.scss';

type Props = {
    /** Component to render when badging the bottom left corner of the rendered container */
    bottomLeft?: React.Node,
    /** Component to render when badging the bottom right corner of the rendered container */
    bottomRight?: React.Node,
    /** the item to receive the badge */
    children: React.Element<any>,
    className?: string,
    /** Component to render when badging the top left corner of the rendered container */
    topLeft?: React.Node,
    /** Component to render when badging the top right corner of the rendered container */
    topRight?: React.Node,
};

const Badgeable = (props: Props) => {
    const {
        children,
        className = '',
        topLeft = null,
        topRight = null,
        bottomLeft = null,
        bottomRight = null,
        ...rest
    } = props;

    return (
        <div className={`badgeable-container ${className}`}>
            {React.cloneElement(React.Children.only(children), rest)}
            <div className="badges">
                {topLeft && <div className="top-left-badge">{topLeft}</div>}
                {topRight && <div className="top-right-badge">{topRight}</div>}
                {bottomLeft && <div className="bottom-left-badge">{bottomLeft}</div>}
                {bottomRight && <div className="bottom-right-badge">{bottomRight}</div>}
            </div>
        </div>
    );
};

export default Badgeable;
