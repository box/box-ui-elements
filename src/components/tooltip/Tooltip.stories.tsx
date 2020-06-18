import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import Button from '../button/Button';
import Tooltip, { TooltipPosition, TooltipTheme } from './Tooltip';
import notes from './Tooltip.stories.md';

const addSpacing = (component: JSX.Element) => <div style={{ textAlign: 'center' }}>{component}</div>;

export const topLeft = () =>
    addSpacing(
        <Tooltip
            position={TooltipPosition.TOP_LEFT}
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
        <Tooltip position={TooltipPosition.TOP_RIGHT} text="callout theme" theme={TooltipTheme.CALLOUT}>
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
            position={TooltipPosition.MIDDLE_RIGHT}
            showCloseButton
            text="callout theme"
            theme={TooltipTheme.CALLOUT}
        >
            <Button>Callout With Close Button</Button>
        </Tooltip>,
    );
withCloseButton.story = {
    name: 'Middle-right, callout theme, force shown with close button',
};

export const errorTheme = () =>
    addSpacing(
        <Tooltip
            isShown={boolean('isShown', true)}
            position={TooltipPosition.TOP_RIGHT}
            text="error theme"
            theme={TooltipTheme.ERROR}
        >
            <Button>top-right</Button>
        </Tooltip>,
    );
errorTheme.story = {
    name: 'Top-right, error theme',
};

export const withLongText = () =>
    addSpacing(
        <Tooltip
            position={TooltipPosition.MIDDLE_LEFT}
            text="this is a long tooltip that will addSpacing past 200px width, add a tooltipClass to override"
        >
            <Button>middle-left</Button>
        </Tooltip>,
    );
withLongText.story = {
    name: 'Middle-left, long tooltip text',
};

export const withOffset = () =>
    addSpacing(
        <Tooltip position={TooltipPosition.MIDDLE_LEFT} text="this tooltip has 20px offset" offset="0 20px">
            <Button>middle-left</Button>
        </Tooltip>,
    );
withOffset.story = {
    name: 'Middle-left, with offset',
};

export const shownByDefault = () =>
    addSpacing(
        <Tooltip
            isShown={boolean('isShown', true)}
            position={TooltipPosition.MIDDLE_RIGHT}
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
        <Tooltip position={TooltipPosition.BOTTOM_LEFT} text="bottom-left positioning">
            <Button>bottom-left</Button>
        </Tooltip>,
    );
bottomLeft.story = {
    name: 'Bottom-left',
};

export const bottomCenter = () =>
    addSpacing(
        <Tooltip position={TooltipPosition.BOTTOM_CENTER} text="bottom-center positioning">
            <Button>bottom-center</Button>
        </Tooltip>,
    );
bottomCenter.story = {
    name: 'Bottom-center',
};

export const bottomRight = () =>
    addSpacing(
        <Tooltip
            isShown
            position={TooltipPosition.BOTTOM_RIGHT}
            showCloseButton
            text="bottom-right positioning with text that spans multiple lines and has a close button"
        >
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
