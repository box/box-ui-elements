import PropTypes from 'prop-types';
import React from 'react';

import IconCloud from '../../icons/general/IconCloud';

const DropShadowFilter = () => (
    <filter id="drop-shadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feOffset dx="2" dy="2" result="offsetblur" />
        <feFlood floodColor="black" floodOpacity="0.3" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
    </filter>
);

/**
 * react-draggable requires component that supports onMouseDown, onMouseUp, onTouchStart, and onTouchEnd so we need
 * to explicitly pass them through here.
 */
const DragCloud = ({
    className,
    cloudSize = 64,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    onTouchStart,
    position,
    style,
}) => {
    const { x, y } = position;
    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={`drag-cloud ${className}`}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
            style={{ ...style, top: `${y}px`, left: `${x}px` }}
        >
            <IconCloud
                filter={{ id: 'drop-shadow', definition: <DropShadowFilter /> }}
                height={cloudSize}
                width={cloudSize}
            />
        </div>
    );
};

DragCloud.displayName = 'DragCloud';

DragCloud.propTypes = {
    className: PropTypes.string,
    cloudSize: PropTypes.number,
    onMouseUp: PropTypes.func,
    onMouseDown: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchStart: PropTypes.func,
    position: PropTypes.objectOf(PropTypes.number).isRequired,
    style: PropTypes.object,
};

// Actual export
export default DragCloud;
