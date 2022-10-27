import PropTypes from 'prop-types';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import FocusTrap from '../../components/focus-trap';

import DragCloud from './DragCloud';
import DropCloud from './DropCloud';
import messages from './messages';
import { checkOverlap, getGridPosition, getRandomCloudPosition } from './utils';

import './SecurityCloudGame.scss';

// pick these numbers to balance accessibility and game complexity
const CLOUD_SIZE_RATIO = 5;
const GRID_TRACK_SIZE_RATIO = 20;

const SecurityCloudGame = ({ height, intl: { formatMessage }, onValidDrop, width }) => {
    const [dropCloudPosition, setDropCloudPosition] = useState(null);
    const [dragCloudPosition, setDragCloudPosition] = useState(null);
    const [layout, setLayout] = useState({});
    const [gameState, setGameState] = useState({
        isValidDrop: false,
        isOverlap: false,
        liveText: '',
    });

    const messageElementRef = useRef();
    // to handle resize events
    const gameBoardSizeRef = useRef({});

    const { cloudSize, gameBoardHeight, gridTrackSize } = layout;
    const { liveText, isOverlap, isValidDrop } = gameState;

    useLayoutEffect(() => {
        const { current: messageElement } = messageElementRef;
        const newGameBoardHeight = height - messageElement.getBoundingClientRect().height;
        const minGameBoardLength = Math.min(newGameBoardHeight, width);
        setLayout({
            gameBoardHeight: newGameBoardHeight,
            cloudSize: minGameBoardLength / CLOUD_SIZE_RATIO,
            gridTrackSize: minGameBoardLength / GRID_TRACK_SIZE_RATIO,
        });

        messageElement.focus();
    }, [height, width]);

    useEffect(() => {
        if (!gameBoardHeight) {
            return;
        }

        const { height: prevHeight, width: prevWidth } = gameBoardSizeRef.current;
        const heightRatio = prevHeight ? gameBoardHeight / prevHeight : 1;
        const widthRatio = prevWidth ? width / prevWidth : 1;

        let newDropCloudPosition;
        setDropCloudPosition(prevPos => {
            newDropCloudPosition = !prevPos
                ? getRandomCloudPosition(cloudSize, gameBoardHeight, width)
                : { x: prevPos.x * widthRatio, y: prevPos.y * heightRatio };
            return newDropCloudPosition;
        });
        setDragCloudPosition(prevPos => {
            if (prevPos) {
                return { x: prevPos.x * widthRatio, y: prevPos.y * heightRatio };
            }
            let nextPos = getRandomCloudPosition(cloudSize, gameBoardHeight, width);
            while (checkOverlap(nextPos, newDropCloudPosition, cloudSize)) {
                nextPos = getRandomCloudPosition(cloudSize, gameBoardHeight, width);
            }
            return nextPos;
        });

        // update previous height and width for ratio calculation
        gameBoardSizeRef.current = { height: gameBoardHeight, width };
    }, [cloudSize, gameBoardHeight, width]);

    /**
     * Update real-time instructional messages for screen reader users.
     * @param {string}} text - assistive text for screen readers
     * @param {boolean} includeTargetPosition - if target/drop cloud position should be included
     */
    const updateLiveText = (text, includeTargetPosition = false) => {
        if (includeTargetPosition) {
            const targetPositionText = formatMessage(
                messages.targetPosition,
                getGridPosition(dropCloudPosition, gridTrackSize),
            );
            text += ` ${targetPositionText}`;
        }

        setGameState(prevState => ({ ...prevState, liveText: text }));
    };

    /**
     * DragCloud drop event handler. Checks if it's valid drop and handles valid drop if it is.
     * @param {MouseEvent} e - The Drop event
     * @param {object} {x, y} - Object which contains x and y coordiante of the drop event.
     * @returns {void}
     */
    const onDrop = () => {
        if (isOverlap) {
            setGameState(prevState => ({ ...prevState, isValidDrop: true }));
            updateLiveText(formatMessage(messages.success));

            if (onValidDrop) {
                // call onValidDrop if passed in through props
                onValidDrop();
            }
        }
    };

    /**
     * Pass along to the drag cloud to set position on moving.
     * @param {number} position - new drag cloud position
     * @returns {void}
     */
    const updatePosition = (newPosition, shouldUpdateLiveText = false) => {
        setDragCloudPosition(newPosition);
        const isOverlapping = checkOverlap(newPosition, dropCloudPosition, cloudSize);
        setGameState(prevState => ({ ...prevState, isOverlap: isOverlapping }));

        if (shouldUpdateLiveText) {
            const newliveText = isOverlap
                ? formatMessage(messages.targetInRange)
                : formatMessage(messages.currentPosition, getGridPosition(newPosition, gridTrackSize));
            updateLiveText(newliveText, !isOverlap);
        }
    };

    /**
     * Get aria label for the message element.
     * @returns {string|null}
     */
    const getAccessibilityInstructions = () =>
        gameBoardHeight &&
        cloudSize &&
        gridTrackSize &&
        formatMessage(
            messages.accessibilityInstructions,
            getGridPosition({ x: width - cloudSize, y: gameBoardHeight - cloudSize }, gridTrackSize),
        );

    /**
     * Renders the drop cloud.
     * @returns {JSX}
     */
    const renderDropCloud = () => {
        if (dropCloudPosition && !isValidDrop) {
            return (
                <DropCloud className={isOverlap ? 'is-over' : ''} cloudSize={cloudSize} position={dropCloudPosition} />
            );
        }

        return null;
    };

    /**
     * Renders the drag cloud.
     * @returns {JSX}
     */
    const renderDragCloud = () => {
        const { current: gameBoardSize } = gameBoardSizeRef;

        if (dragCloudPosition) {
            return (
                <DragCloud
                    gameBoardSize={gameBoardSize}
                    cloudSize={cloudSize}
                    disabled={isValidDrop}
                    gridTrackSize={gridTrackSize}
                    onDrop={onDrop}
                    position={dragCloudPosition}
                    updateLiveText={updateLiveText}
                    updatePosition={updatePosition}
                />
            );
        }

        return null;
    };

    /**
     * Renders the message shown to the user
     * @returns {JSX}
     */
    const renderMessage = () => {
        if (isValidDrop) {
            return <FormattedMessage {...messages.success} />;
        }

        return <FormattedMessage {...messages.instructions} />;
    };

    const renderAriaLiveText = () => (
        <div className="bdl-SecurityCloudGame-liveText" aria-live="polite">
            {liveText}
        </div>
    );

    /**
     * Renders the cloud game
     * @returns {JSX}
     */
    return (
        <FocusTrap>
            {renderAriaLiveText()}
            <div className="bdl-SecurityCloudGame" style={{ height: `${height}px`, width: `${width}px` }}>
                <div
                    ref={messageElementRef}
                    className="bdl-SecurityCloudGame-message"
                    aria-label={getAccessibilityInstructions()}
                    tabIndex={-1}
                >
                    {renderMessage()}
                </div>
                <div className="bdl-SecurityCloudGame-board">
                    {renderDropCloud()}
                    {renderDragCloud()}
                </div>
            </div>
        </FocusTrap>
    );
};

SecurityCloudGame.displayName = 'SecurityCloudGame';

SecurityCloudGame.propTypes = {
    /** Height to set the game to */
    height: PropTypes.number.isRequired,
    /* Intl object */
    intl: PropTypes.any,
    /** Function to call when the `DragCloud` is successfully dropped onto the `DropCloud` */
    onValidDrop: PropTypes.func,
    /** Width to set the game to */
    width: PropTypes.number.isRequired,
};

export { SecurityCloudGame as SecurityCloudGameBase };
export default injectIntl(SecurityCloudGame);
