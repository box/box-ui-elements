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
        // guardrail to prevent further rendering if the game board height is not positive
        if (newGameBoardHeight <= 0) return;

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

        // declare and update this variable first in order to generate the starting position for drag cloud
        let newDropCloudPosition;
        // use prevState => {} to avoid referencing and updating the state at the same time
        setDropCloudPosition(prevPos => {
            newDropCloudPosition = !prevPos
                ? getRandomCloudPosition(cloudSize, gameBoardHeight, width) // initial render
                : { x: prevPos.x * widthRatio, y: prevPos.y * heightRatio }; // on board resize
            return newDropCloudPosition;
        });
        setDragCloudPosition(prevPos => {
            // on board resize
            if (prevPos) {
                return { x: prevPos.x * widthRatio, y: prevPos.y * heightRatio };
            }
            let nextPos = getRandomCloudPosition(cloudSize, gameBoardHeight, width);
            // keep generating new random position until there is no overlap
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
     * @param {number} newPosition - new drag cloud position
     * @param {boolean} shouldUpdateLiveText - default to false
     * @returns {void}
     */
    const updatePosition = (newPosition, shouldUpdateLiveText = false) => {
        setDragCloudPosition(newPosition);
        const isOverlapping = checkOverlap(newPosition, dropCloudPosition, cloudSize);
        setGameState(prevState => ({ ...prevState, isOverlap: isOverlapping }));

        if (shouldUpdateLiveText) {
            const newliveText = isOverlapping
                ? formatMessage(messages.targetInRange)
                : formatMessage(messages.currentPosition, getGridPosition(newPosition, gridTrackSize));
            updateLiveText(newliveText, !isOverlapping);
        }
    };

    /**
     * Get aria label for the message element.
     * @returns {string|undefined}
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
                    cloudSize={cloudSize}
                    disabled={isValidDrop}
                    gameBoardSize={gameBoardSize}
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

    /**
     * Renders the cloud game
     * @returns {JSX}
     */
    return (
        <FocusTrap>
            <div className="bdl-SecurityCloudGame-liveText" aria-live="polite">
                {liveText}
            </div>
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
