import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import Draggable from 'react-draggable';

import IconCloud from '../../icons/general/IconCloud';
import messages from './messages';
import { getGridPosition } from './utils';

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

const DragCloud = ({
    cloudSize,
    disabled,
    gameBoardSize: { height, width },
    gridTrackSize,
    intl: { formatMessage },
    onDrop,
    position,
    updateLiveText,
    updatePosition,
}) => {
    const nodeRef = React.useRef({});
    const [isMoving, setIsMoving] = useState(false);

    const dragCloudClasses = classNames('bdl-DragCloud', {
        'is-moving': isMoving,
    });

    const moveLeft = () => {
        const newX = position.x - gridTrackSize;
        updatePosition({ ...position, x: Math.max(newX, 0) }, true);
        if (newX < 0) {
            updateLiveText(formatMessage(messages.reachLeftEdge));
        }
    };

    const moveRight = () => {
        const maxX = width - cloudSize;
        const newX = position.x + gridTrackSize;
        updatePosition({ ...position, x: Math.min(newX, maxX) }, true);
        if (newX > maxX) {
            updateLiveText(formatMessage(messages.reachRightEdge));
        }
    };

    const moveUp = () => {
        const newY = position.y - gridTrackSize;
        updatePosition({ ...position, y: Math.max(newY, 0) }, true);
        if (newY < 0) {
            updateLiveText(formatMessage(messages.reachTopEdge));
        }
    };

    const moveDown = () => {
        const maxY = height - cloudSize;
        const newY = position.y + gridTrackSize;
        updatePosition({ ...position, y: Math.min(newY, maxY) }, true);
        if (newY > maxY) {
            updateLiveText(formatMessage(messages.reachBottomEdge));
        }
    };

    const handleSpacebar = () => {
        const cloudStatusText = formatMessage(isMoving ? messages.cloudDropped : messages.cloudGrabbed);
        const currentPositionText = formatMessage(messages.currentPosition, getGridPosition(position, gridTrackSize));
        updateLiveText(`${cloudStatusText} ${currentPositionText}`, true);

        if (isMoving) {
            onDrop();
        }

        setIsMoving(!isMoving);
    };

    /**
     * DragCloud keyboard event handler. Supports Up/Down/Left/Right arrow keys and Spacebar
     * @param {KeyboardEvent} event - The drag event
     * @returns {void}
     */
    const onKeyDown = event => {
        if (disabled) {
            return;
        }

        if (isMoving) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (event.key === ' ') {
            handleSpacebar();
        } else if (isMoving) {
            switch (event.key) {
                case 'ArrowUp':
                    moveUp();
                    break;
                case 'ArrowDown':
                    moveDown();
                    break;
                case 'ArrowLeft':
                    moveLeft();
                    break;
                case 'ArrowRight':
                    moveRight();
                    break;
                default:
                    break;
            }
        }
    };

    /**
     * Reset isMoving state when DragCloud loses focus
     * @returns {void}
     */
    const onBlur = () => setIsMoving(false);

    /**
     * DragCloud drag event handler. Updates current position.
     * @param {MouseEvent} e - The drag event
     * @param {object} { x, y } - Object which contains x and y coordinate of the drag event.
     * @returns {void}
     */
    const onDrag = throttle((e, { x, y }) => updatePosition({ x, y }), 100, { leading: true, trailing: true });

    return (
        <Draggable
            nodeRef={nodeRef}
            bounds="parent"
            disabled={disabled}
            onDrag={onDrag}
            onStop={onDrop}
            position={position}
        >
            <div
                ref={nodeRef}
                className={dragCloudClasses}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                role="button"
                tabIndex={0}
            >
                <IconCloud
                    filter={{ id: 'drop-shadow', definition: <DropShadowFilter /> }}
                    height={cloudSize}
                    title={formatMessage(messages.cloudObject)}
                    width={cloudSize}
                />
            </div>
        </Draggable>
    );
};

DragCloud.displayName = 'DragCloud';

DragCloud.propTypes = {
    cloudSize: PropTypes.number,
    disabled: PropTypes.bool,
    gameBoardSize: PropTypes.objectOf(PropTypes.number),
    gridTrackSize: PropTypes.number,
    intl: PropTypes.any,
    position: PropTypes.objectOf(PropTypes.number).isRequired,
    onDrop: PropTypes.func,
    updateLiveText: PropTypes.func,
    updatePosition: PropTypes.func,
};

// Actual export
export { DragCloud as DragCloudBase };
export default injectIntl(DragCloud);
