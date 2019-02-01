import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import throttle from 'lodash/throttle';
import Draggable from 'react-draggable';

import DragCloud from './DragCloud';
import DropCloud from './DropCloud';
import messages from './messages';

import './SecurityCloudGame.scss';

class SecurityCloudGame extends Component {
    static propTypes = {
        /** Width/Height to set the drag and drop clouds to.  Defaults to 64 */
        cloudSize: PropTypes.number,
        /** Height to set the game to */
        height: PropTypes.number.isRequired,
        /** Function to call when the `DragCloud` is successfuly dropped onto the `DropCloud` */
        onValidDrop: PropTypes.func,
        /** Width to set the game to */
        width: PropTypes.number.isRequired,
    };

    static defaultProps = {
        cloudSize: 64,
    };

    constructor(props) {
        super(props);
        this.occupiedRegions = [];
        this.state = {
            isValidDrop: false,
            isOverlap: false,
        };

        this.onDrag = throttle(this.onDrag, 100, {
            leading: true,
            trailing: true,
        });

        this.setGameBoardHeight = this.setGameBoardHeight.bind(this);
    }

    /**
     * If message height was set, calculate cloud positions and save to state.
     * @param {object} prevProps - previous props.
     * @param {object} prevState - previous state.
     * @returns {void}
     */
    componentDidUpdate(prevProps, prevState) {
        // This should only happen once when game board height is calculated
        if (this.state.gameBoardHeight !== prevState.gameBoardHeight) {
            const dropCloudPosition = this.getRandomCloudPosition();
            let dragCloudPosition = this.getRandomCloudPosition();

            while (this.checkOverlap(dragCloudPosition, dropCloudPosition)) {
                dragCloudPosition = this.getRandomCloudPosition();
            }

            // we're relying on rendering of the initial DOM to measure message height and set states accordingly.
            // Calling setState in componentDidUpdate in this case is a fine use case.
            this.setState({ dropCloudPosition, dragCloudPosition }); // eslint-disable-line
        }
    }

    /**
     * DragCloud drop event handler. Checks if it's valid drop and handles valid drop if it is.
     * @param {MouseEvent} e - The Drop event
     * @param {object} {x, y} - Object which contains x and y coordiante of the drop event.
     * @returns {void}
     */
    onDragStop = () => {
        const { onValidDrop } = this.props;

        if (this.state.isOverlap) {
            this.setState({
                isValidDrop: true,
            });

            if (onValidDrop) {
                // call onValidDrop if passed in through props
                onValidDrop();
            }
        }
    };

    /**
     * DragCloud drag event handler. Sets isOverlap state depending on coordinates.
     * @param {MouseEvent} e - The drag event
     * @param {object} {x, y} - Object which contains x and y coordiante of the drag event.
     * @returns {void}
     */
    onDrag = (e, { x, y }) => {
        // x and y from the event handler passes the offset from starting point.
        // Add to initial value to calculate actual position.
        const newPosition = {
            x: this.state.dragCloudPosition.x + x,
            y: this.state.dragCloudPosition.y + y,
        };

        const isOverlap = this.checkOverlap(newPosition, this.state.dropCloudPosition);

        this.setState({ isOverlap });
    };

    /**
     * A wrapper function for Math.random for testing purposes.
     * @returns {float} number between 0 and 1.
     */
    getRandom() {
        // eslint-disable-line class-methods-use-this
        return Math.random();
    }

    /**
     * Gets a random {x,y} position to place a cloud within the game board dimensions.
     * @returns {Object} - the {x,y} coordinates for the cloud
     */
    getRandomCloudPosition() {
        const { cloudSize, width } = this.props;
        const height = this.state.gameBoardHeight;

        // get random x position.  calculate using width of board - cloudSize - some extra padding (1% of width);
        const x = this.getRandom() * (width - cloudSize - width * 0.01);
        // get random y position.  calculate using height of board - cloudSize - some extra padding (1% of height);
        const y = this.getRandom() * (height - cloudSize - height * 0.01);

        return { x, y };
    }

    /**
     * When message element is rendered, calculates board game dimenstions.
     * @param {node} messageElement - The message element.
     * @returns {void}
     */
    setGameBoardHeight(messageElement) {
        // Only calculate game board height on mount.
        if (messageElement) {
            this.setState({
                gameBoardHeight: this.props.height - messageElement.getBoundingClientRect().height,
            });
        }
    }

    /**
     * Checks if a given position has already been occupied.
     * The actual calculations checks if the midpoint of the dropcloud image is contained within the drag cloud image.
     * @param {object} dragCloudPosition - the x,y coordinates of drag cloud
     * @param {object} dropCloudPosition - the x,y coordinates of drop cloud
     * @returns boolean - true if there is an overlap, false otherwise
     */
    checkOverlap(dragCloudPosition, dropCloudPosition) {
        const { cloudSize } = this.props;
        const { x: dragLeft, y: dragTop } = dragCloudPosition;

        const dragRight = dragLeft + cloudSize;
        const dragBottom = dragTop + cloudSize;

        const { x: dropLeft, y: dropTop } = dropCloudPosition;
        const dropMidX = dropLeft + cloudSize / 2;
        const dropMidY = dropTop + cloudSize / 2;

        return !(dragBottom < dropMidY || dragTop > dropMidY || dragLeft > dropMidX || dragRight < dropMidX);
    }

    /**
     * Renders the drop cloud.
     * @returns {JSX}
     */
    renderDropCloud() {
        const { isValidDrop, dropCloudPosition } = this.state;

        if (dropCloudPosition && !isValidDrop) {
            const { cloudSize } = this.props;

            // return the drop region with a DragCloud and DropCloud by default
            return (
                <DropCloud
                    className={this.state.isOverlap ? 'is-over' : ''}
                    cloudSize={cloudSize}
                    position={dropCloudPosition}
                />
            );
        }

        return null;
    }

    /**
     * Renders the drag cloud.
     * @returns {JSX}
     */
    renderDragCloud() {
        const { isValidDrop, dragCloudPosition } = this.state;

        if (dragCloudPosition) {
            return (
                <Draggable bounds="parent" disabled={isValidDrop} onDrag={this.onDrag} onStop={this.onDragStop}>
                    <DragCloud cloudSize={this.props.cloudSize} position={this.state.dragCloudPosition} />
                </Draggable>
            );
        }

        return null;
    }

    /**
     * Renders the message shown to the user
     * @returns {JSX}
     */
    renderMessage() {
        if (this.state.isValidDrop) {
            return <FormattedMessage {...messages.success} />;
        }

        return <FormattedMessage {...messages.instructions} />;
    }

    /**
     * Renders the cloud game
     * @returns {JSX}
     */
    render() {
        const { height, width } = this.props;

        return (
            <div className="box-ui-security-cloud-game" style={{ height: `${height}px`, width: `${width}px` }}>
                <div ref={this.setGameBoardHeight} className="box-ui-security-cloud-game-message">
                    {this.renderMessage()}
                </div>
                <div className="box-ui-security-cloud-game-board">
                    {this.renderDropCloud()}
                    {this.renderDragCloud()}
                </div>
            </div>
        );
    }
}

export default SecurityCloudGame;
