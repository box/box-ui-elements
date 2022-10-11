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

const SecurityCloudGame = ({ height, intl, onValidDrop, width }) => {
    const [cloudSize, setCloudSize] = useState(null);
    const [gridTrackSize, setGridTrackSize] = useState(null);
    const [dropCloudPosition, setDropCloudPosition] = useState(null);
    const [dragCloudPosition, setDragCloudPosition] = useState(null);
    const [gameBoardHeight, setGameBoardHeight] = useState(null);
    const [gameState, setGameState] = useState({
        isValidDrop: false,
        isOverlap: false,
        liveText: '',
    });

    const messageElementRef = useRef();
    // to handle resize events
    const prevHeight = useRef();
    const prevWidth = useRef();

    useLayoutEffect(() => {
        const { current: messageElement } = messageElementRef;
        const newGameBoardHeight = height - messageElement.getBoundingClientRect().height;
        const smallerDimension = Math.min(newGameBoardHeight, width);
        const newGridTrackSize = smallerDimension / GRID_TRACK_SIZE_RATIO;
        const newCloudSize = smallerDimension / CLOUD_SIZE_RATIO;
        setGameBoardHeight(newGameBoardHeight);
        setGridTrackSize(newGridTrackSize);
        setCloudSize(newCloudSize);

        messageElement.setAttribute(
            'aria-label',
            intl.formatMessage(
                messages.accessibilityInstructions,
                getGridPosition({ x: width - newCloudSize, y: newGameBoardHeight - newCloudSize }, newGridTrackSize),
            ),
        );
        messageElement.focus();
    }, [height, intl, width]);

    useEffect(() => {
        if (!gameBoardHeight) {
            return;
        }

        const heightRatio = prevHeight.current ? gameBoardHeight / prevHeight.current : 1;
        const widthRatio = prevWidth.current ? width / prevWidth.current : 1;

        let newDropCloudPosition;
        setDropCloudPosition(prevPos => {
            newDropCloudPosition = !prevPos
                ? getRandomCloudPosition(cloudSize, gameBoardHeight, width)
                : { x: prevPos.x * widthRatio, y: prevPos.y * heightRatio };
            return newDropCloudPosition;
        });
        setDragCloudPosition(prevPos => {
            if (!prevPos) {
                let newPos = getRandomCloudPosition(cloudSize, gameBoardHeight, width);
                while (checkOverlap(newPos, newDropCloudPosition, cloudSize)) {
                    newPos = getRandomCloudPosition(cloudSize, gameBoardHeight, width);
                }
                return newPos;
            }
            return { x: prevPos.x * widthRatio, y: prevPos.y * heightRatio };
        });

        // update previous height and width for ratio calculation
        prevHeight.current = gameBoardHeight;
        prevWidth.current = width;
    }, [cloudSize, gameBoardHeight, width]);

    /**
     * Update real-time instructional messages for screen reader users.
     * @param {string}} text - assistive text for screen readers
     * @param {boolean} includeTargetPosition - if target/drop cloud position should be included
     */
    const updateLiveText = (text, includeTargetPosition = false) => {
        if (includeTargetPosition) {
            const targetPositionText = intl.formatMessage(
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
        if (gameState.isOverlap) {
            setGameState(prevState => ({ ...prevState, isValidDrop: true }));
            updateLiveText(intl.formatMessage(messages.success));

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
        const isOverlap = checkOverlap(newPosition, dropCloudPosition, cloudSize);
        setGameState(prevState => ({ ...prevState, isOverlap }));

        if (shouldUpdateLiveText) {
            const liveText = isOverlap
                ? intl.formatMessage(messages.targetInRange)
                : intl.formatMessage(messages.currentPosition, getGridPosition(newPosition, gridTrackSize));
            updateLiveText(liveText, !isOverlap);
        }
    };

    /**
     * Renders the drop cloud.
     * @returns {JSX}
     */
    const renderDropCloud = () => {
        const { isValidDrop, isOverlap } = gameState;

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
        if (dragCloudPosition) {
            return (
                <DragCloud
                    boardHeight={gameBoardHeight}
                    boardWidth={width}
                    cloudSize={cloudSize}
                    disabled={gameState.isValidDrop}
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
        if (gameState.isValidDrop) {
            return <FormattedMessage {...messages.success} />;
        }

        return <FormattedMessage {...messages.instructions} />;
    };

    const renderAriaLiveText = () => {
        return (
            <div aria-live="assertive">
                <span className="live-text">{gameState.liveText}</span>
            </div>
        );
    };

    /**
     * Renders the cloud game
     * @returns {JSX}
     */
    return (
        <FocusTrap>
            {renderAriaLiveText()}
            <div className="box-ui-security-cloud-game" style={{ height: `${height}px`, width: `${width}px` }}>
                <div ref={messageElementRef} className="box-ui-security-cloud-game-message" tabIndex={-1}>
                    {renderMessage()}
                </div>
                <div className="box-ui-security-cloud-game-board">
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
    /** Function to call when the `DragCloud` is successfuly dropped onto the `DropCloud` */
    onValidDrop: PropTypes.func,
    /** Width to set the game to */
    width: PropTypes.number.isRequired,
};

export { SecurityCloudGame as SecurityCloudGameBase };
export default injectIntl(SecurityCloudGame);
