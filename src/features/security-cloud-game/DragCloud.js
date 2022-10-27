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
    gameBoardSize: { height, width },
    cloudSize,
    disabled,
    gridTrackSize,
    intl: { formatMessage },
    onDrop,
    position,
    updateLiveText,
    updatePosition,
}) => {
    const [isMoving, setIsMoving] = useState(false);

    const dragCloudClasses = classNames('bdl-DragCloud', {
        'is-moving': isMoving,
    });

    const moveLeft = () => {
        const newX = position.x - gridTrackSize;
        if (newX >= 0) {
            updatePosition({ ...position, x: newX }, true);
        } else {
            updateLiveText(formatMessage(messages.reachLeftEdge));
        }
    };

    const moveRight = () => {
        const newX = position.x + gridTrackSize;
        if (newX + cloudSize <= width) {
            updatePosition({ ...position, x: newX }, true);
        } else {
            updateLiveText(formatMessage(messages.reachRightEdge));
        }
    };

    const moveUp = () => {
        const newY = position.y - gridTrackSize;
        if (newY >= 0) {
            updatePosition({ ...position, y: newY }, true);
        } else {
            updateLiveText(formatMessage(messages.reachTopEdge));
        }
    };

    const moveDown = () => {
        const newY = position.y + gridTrackSize;
        if (newY + cloudSize <= height) {
            updatePosition({ ...position, y: newY }, true);
        } else {
            updateLiveText(formatMessage(messages.reachBottomEdge));
        }
    };

    const handleSpaceBar = () => {
        const cloudStatusText = formatMessage(isMoving ? messages.cloudDropped : messages.cloudGrabbed);
        const currentPositionText = formatMessage(messages.currentPosition, getGridPosition(position, gridTrackSize));
        updateLiveText(`${cloudStatusText} ${currentPositionText}`, true);

        if (isMoving) {
            onDrop();
        }

        setIsMoving(!isMoving);
    };

    /**
     * DragCloud keyboard event handler. Supports Up/Down/Left/Right arrow keys and Space Bar
     * @param {KeyboardEvent} event - The drag event
     * @returns {void}
     */
    const onKeyDown = event => {
        if (disabled) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (event.key === ' ') {
            handleSpaceBar();
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
        <Draggable bounds="parent" disabled={disabled} onDrag={onDrag} onStop={onDrop} position={position}>
            {/* eslint-disable-next-line */}
            <div className={dragCloudClasses} onBlur={onBlur} onKeyDown={onKeyDown} tabIndex={0}>
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
    gameBoardSize: PropTypes.objectOf(PropTypes.number),
    cloudSize: PropTypes.number,
    disabled: PropTypes.bool,
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
