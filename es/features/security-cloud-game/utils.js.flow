/**
 * Gets a random {x,y} position to place a cloud within the game board dimensions.
 * @returns {Object} - the {x,y} coordinates for the cloud
 */
const getRandomCloudPosition = (cloudSize, height, width) => {
    // get random x position.  calculate using width of board - cloudSize - some extra padding (1% of width);
    const x = Math.random() * (width - cloudSize - width * 0.01);
    // get random y position.  calculate using height of board - cloudSize - some extra padding (1% of height);
    const y = Math.random() * (height - cloudSize - height * 0.01);

    return { x, y };
};

/**
 * Checks if a given position has already been occupied.
 * The actual calculations checks if the midpoint of the dropcloud image is contained within the drag cloud image.
 * @param {object} dragCloudPosition - the x,y coordinates of drag cloud
 * @param {object} dropCloudPosition - the x,y coordinates of drop cloud
 * @param {number} cloudSize - size of the cloud objects
 * @returns {boolean} - true if there is an overlap, false otherwise
 */
const checkOverlap = (dragCloudPosition, dropCloudPosition, cloudSize) => {
    const { x: dragLeft, y: dragTop } = dragCloudPosition;
    const dragRight = dragLeft + cloudSize;
    const dragBottom = dragTop + cloudSize;

    const { x: dropLeft, y: dropTop } = dropCloudPosition;
    const dropMidX = dropLeft + cloudSize / 2;
    const dropMidY = dropTop + cloudSize / 2;

    return !(dragBottom < dropMidY || dragTop > dropMidY || dragLeft > dropMidX || dragRight < dropMidX);
};

/**
 * Get row and column numbers in grid.
 * @param {object} position - the x,y coordinates
 * @param {number} gridTrackSize - size of the space between two adjacent grid lines
 * @returns {object}
 */
const getGridPosition = (position, gridTrackSize) => ({
    row: Math.floor(position.y / gridTrackSize),
    column: Math.floor(position.x / gridTrackSize),
});

export { checkOverlap, getGridPosition, getRandomCloudPosition };
