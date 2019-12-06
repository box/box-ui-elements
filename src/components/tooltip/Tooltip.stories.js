// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import Button from '../button/Button';
import Tooltip from './Tooltip';
import notes from './Tooltip.stories.md';

const addSpacing = component => <div style={{ textAlign: 'center' }}>{component}</div>;

export const topLeft = () =>
    addSpacing(
        <Tooltip
            position="top-left"
            text="tooltips are constrained to window by default so if you scroll until there is no room for this tooltip above the button, it will flip below the button"
        >
            <Button>top-left</Button>
        </Tooltip>,
    );

topLeft.story = {
    name: 'Top-left, basic',
};

export const topCenter = () =>
    addSpacing(
        <Tooltip text="default tooltip with top-center positioning and default theme, works on disabled buttons">
            <Button isDisabled>top-center</Button>
        </Tooltip>,
    );

topCenter.story = {
    name: 'Top-center, disabled button',
};

export const calloutTheme = () =>
    addSpacing(
        <Tooltip position="top-right" text="callout theme" theme="callout">
            <Button>Callout</Button>
        </Tooltip>,
    );
calloutTheme.story = {
    name: 'Top-right, callout theme',
};

export const withCloseButton = () =>
    addSpacing(
        <Tooltip
            isShown={boolean('isShown', true)}
            position="middle-right"
            showCloseButton
            text="callout theme"
            theme="callout"
        >
            <Button>Callout With Close Button</Button>
        </Tooltip>,
    );
withCloseButton.story = {
    name: 'Middle-right, callout theme, force shown with close button',
};

export const errorTheme = () =>
    addSpacing(
        <Tooltip isShown={boolean('isShown', true)} position="top-right" text="error theme" theme="error">
            <Button>top-right</Button>
        </Tooltip>,
    );
errorTheme.story = {
    name: 'Top-right, error theme',
};

export const withLongText = () =>
    addSpacing(
        <Tooltip
            position="middle-left"
            text="this is a long tooltip that will addSpacing past 200px width, add a tooltipClass to override"
        >
            <Button>middle-left</Button>
        </Tooltip>,
    );
withLongText.story = {
    name: 'Middle-left, long tooltip text',
};

export const shownByDefault = () =>
    addSpacing(
        <Tooltip
            isShown={boolean('isShown', true)}
            position="middle-right"
            text="controlled tooltip that is shown based only on the isShown prop"
        >
            <Button>middle-right</Button>
        </Tooltip>,
    );
shownByDefault.story = {
    name: 'Middle-right, isShown prop set to true',
};

export const bottomLeft = () =>
    addSpacing(
        <Tooltip position="bottom-left" text="bottom-left positioning">
            <Button>bottom-left</Button>
        </Tooltip>,
    );
bottomLeft.story = {
    name: 'Bottom-left',
};

export const bottomCenter = () =>
    addSpacing(
        <Tooltip position="bottom-center" text="bottom-center positioning">
            <Button>bottom-center</Button>
        </Tooltip>,
    );
bottomCenter.story = {
    name: 'Bottom-center',
};

export const bottomRight = () =>
    addSpacing(
        <Tooltip position="bottom-right" text="bottom-right positioning">
            <Button>bottom-right</Button>
        </Tooltip>,
    );
bottomRight.story = {
    name: 'Bottom-right',
};

export default {
    title: 'Components|Tooltip',
    component: Tooltip,
    parameters: {
        notes,
    },
};
