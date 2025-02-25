import * as React from 'react';

import Button from '../button/Button';
import Tooltip, { TooltipPosition, TooltipTheme } from './Tooltip';
import notes from './Tooltip.stories.md';

const addSpacing = (component: React.ReactElement) => (
    <div style={{ textAlign: 'center', marginTop: '125px', marginBottom: '125px' }}>{component}</div>
);

export const positioning = () => {
    return addSpacing(
        <div>
            <Tooltip
                isShown
                position={TooltipPosition.TOP_CENTER}
                text="tooltips are constrained to window by default so if you scroll until there is no room for this tooltip above the button, it will flip below the button"
            >
                <Button>top center</Button>
            </Tooltip>
        </div>,
    );
};
positioning.story = {
    name: 'Positioning',
};

export const themes = () => {
    return addSpacing(
        <Tooltip isShown position={TooltipPosition.TOP_RIGHT} text="Theme this tooltip" theme={TooltipTheme.CALLOUT}>
            <Button>Theme Option: callout</Button>
        </Tooltip>,
    );
};
themes.story = {
    name: 'Themes',
};

export const withCloseButton = () => {
    return addSpacing(
        <Tooltip
            isShown
            position={TooltipPosition.TOP_CENTER}
            showCloseButton
            text="Tooltips can have a close button and still work even if the text is long and wrapping"
            theme={TooltipTheme.DEFAULT}
        >
            <Button>Learn more</Button>
        </Tooltip>,
    );
};
withCloseButton.story = {
    name: 'With close button',
};

export const isShown = () =>
    addSpacing(
        <Tooltip isShown text="Force show or hide">
            <Button>Learn more</Button>
        </Tooltip>,
    );
isShown.story = {
    name: 'Force show and hide',
};

export const withOffset = () => {
    return addSpacing(
        <Tooltip isShown position={TooltipPosition.MIDDLE_LEFT} text="this tooltip has 20px offset" offset="0 20px">
            <Button>Learn more</Button>
        </Tooltip>,
    );
};
withOffset.story = {
    name: 'With offset',
};

export const withDisabled = () =>
    addSpacing(
        <Tooltip
            isDisabled
            position={TooltipPosition.MIDDLE_RIGHT}
            text="controlled tooltip that is shown based only on the isDisabled prop"
        >
            <Button>Learn more</Button>
        </Tooltip>,
    );
withDisabled.story = {
    name: 'With disabled tooltip',
};

export const attachedToDisabledButton = () =>
    addSpacing(
        <Tooltip text="Tooltip works on disabled buttons">
            <Button isDisabled>Save changes</Button>
        </Tooltip>,
    );
attachedToDisabledButton.story = {
    name: 'Attached to disabled button',
};

export const withLongText = () =>
    addSpacing(
        <Tooltip
            position={TooltipPosition.MIDDLE_LEFT}
            text="this is a long tooltip that will addSpacing past 200px width, add a tooltipClass to override"
        >
            <Button>Learn more</Button>
        </Tooltip>,
    );
withLongText.story = {
    name: 'With long tooltip text',
};

export default {
    title: 'Components/Tooltip',
    component: Tooltip,
    parameters: {
        notes,
    },
};
