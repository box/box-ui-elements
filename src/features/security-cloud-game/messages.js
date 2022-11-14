import { defineMessages } from 'react-intl';

const messages = defineMessages({
    success: {
        defaultMessage: 'Success!',
        description: 'Success message shown when a user successfully drags the cloud into position.',
        id: 'boxui.securityCloudGame.success',
    },
    instructions: {
        defaultMessage:
            'For security purposes, please drag the white cloud onto the dark cloud. Keyboard users: Press spacebar to grab the cloud, arrow keys to move, and spacebar to drop.',
        description: 'Instructional message displayed on the embed widget security drag-drop game',
        id: 'boxui.securityCloudGame.instructions',
    },
    accessibilityInstructions: {
        defaultMessage:
            'For security purposes, please drag the cloud object onto the target. You are on a {row} by {column} grid with a movable cloud object and a target area. Press spacebar to grab the cloud object, arrow keys to move, and spacebar to drop on the target.',
        description: 'Instructional message displayed on the embed widget security drag-drop game for screen readers',
        id: 'boxui.securityCloudGame.accessibilityInstructions',
    },
    cloudObject: {
        defaultMessage: 'Cloud object',
        description: 'White cloud title.',
        id: 'boxui.securityCloudGame.cloudObject',
    },
    target: {
        defaultMessage: 'Target',
        description: 'Target dark cloud title.',
        id: 'boxui.securityCloudGame.target',
    },
    currentPosition: {
        defaultMessage: 'Current position: Row {row}, Column {column}.',
        description: 'Message for the screen reader to tell the current position of the cloud.',
        id: 'boxui.securityCloudGame.currentPosition',
    },
    targetPosition: {
        defaultMessage: 'Target position: Row {row}, Column {column}.',
        description: 'Message for the screen reader to tell the position of the target.',
        id: 'boxui.securityCloudGame.targetPosition',
    },
    cloudGrabbed: {
        defaultMessage: 'Cloud object grabbed.',
        description: 'Message for the screen reader to tell when user grab the cloud.',
        id: 'boxui.securityCloudGame.cloudGrabbed',
    },
    cloudDropped: {
        defaultMessage: 'Cloud object dropped.',
        description: 'Message for the screen reader to tell when user drop the cloud.',
        id: 'boxui.securityCloudGame.cloudDropped',
    },
    reachLeftEdge: {
        defaultMessage: 'Reached left edge of grid.',
        description: 'Message for the screen reader to tell when the cloud hits the left edge of game board.',
        id: 'boxui.securityCloudGame.reachLeftEdge',
    },
    reachRightEdge: {
        defaultMessage: 'Reached right edge of grid.',
        description: 'Message for the screen reader to tell when the cloud hits the right edge of game board.',
        id: 'boxui.securityCloudGame.reachRightEdge',
    },
    reachTopEdge: {
        defaultMessage: 'Reached top edge of grid.',
        description: 'Message for the screen reader to tell when the cloud hits the top edge of game board.',
        id: 'boxui.securityCloudGame.reachTopEdge',
    },
    reachBottomEdge: {
        defaultMessage: 'Reached bottom edge of grid.',
        description: 'Message for the screen reader to tell when the cloud hits the bottom edge of game board.',
        id: 'boxui.securityCloudGame.reachBottomEdge',
    },
    targetInRange: {
        defaultMessage: 'Target in range, you can drop the cloud object.',
        description: 'Message for the screen reader to tell when the white cloud overlaps with the target cloud.',
        id: 'boxui.securityCloudGame.targetInRange',
    },
});

export default messages;
