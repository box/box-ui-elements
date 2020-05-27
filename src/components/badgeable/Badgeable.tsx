import * as React from 'react';
import classnames from 'classnames';

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

const Badgeable = (props: Props) => {
    const { children, className = '', topLeft = null, topRight = null, bottomLeft = null, bottomRight = null } = props;

    return (
        <div className={classnames('badgeable-container', className)}>
            {children}
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
