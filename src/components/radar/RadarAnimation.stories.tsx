import * as React from 'react';
import RadarAnimation, { RadarAnimationPosition } from './RadarAnimation';
import Button from '../button';
import notes from './RadarAnimation.stories.md';

export const bottomLeft = () => (
    <RadarAnimation position={RadarAnimationPosition.BOTTOM_LEFT}>
        <Button>Bottom Left</Button>
    </RadarAnimation>
);

export const bottomCenter = () => (
    <RadarAnimation position={RadarAnimationPosition.BOTTOM_CENTER}>
        <Button>Bottom Center</Button>
    </RadarAnimation>
);

export const bottomRight = () => (
    <RadarAnimation position={RadarAnimationPosition.BOTTOM_RIGHT}>
        <Button>Bottom Right</Button>
    </RadarAnimation>
);

export const middleLeft = () => (
    <RadarAnimation position={RadarAnimationPosition.MIDDLE_LEFT}>
        <Button>Middle Left</Button>
    </RadarAnimation>
);

export const middleCenter = () => (
    <RadarAnimation position={RadarAnimationPosition.MIDDLE_CENTER}>
        <Button>Middle Center</Button>
    </RadarAnimation>
);

export const middleRight = () => (
    <RadarAnimation position={RadarAnimationPosition.MIDDLE_RIGHT}>
        <Button>Middle Right</Button>
    </RadarAnimation>
);

export const topLeft = () => (
    <RadarAnimation position={RadarAnimationPosition.TOP_LEFT}>
        <Button>Top Left</Button>
    </RadarAnimation>
);

export const topCenter = () => (
    <RadarAnimation position={RadarAnimationPosition.TOP_CENTER}>
        <Button>Top Center</Button>
    </RadarAnimation>
);

export const topRight = () => (
    <RadarAnimation position={RadarAnimationPosition.TOP_RIGHT}>
        <Button>Top Right</Button>
    </RadarAnimation>
);

export const withOffset = () => (
    <div style={{ marginLeft: 5 }}>
        <RadarAnimation position={RadarAnimationPosition.MIDDLE_LEFT} offset="0 20px">
            <Button>Middle Left, with offset</Button>
        </RadarAnimation>
    </div>
);

export default {
    title: 'Components/RadarAnimation',
    component: RadarAnimation,
    parameters: {
        notes,
    },
};
