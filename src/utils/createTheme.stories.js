/* eslint-disable no-underscore-dangle */
// @ts-nocheck
import * as React from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { color, text } from '@storybook/addon-knobs';

import * as vars from '../styles/variables';
import defaultTheme from '../styles/theme';
import BoxButton from '../components/button';
import BoxLogo from '../icon/logo/BoxLogo';
import { createTheme } from './createTheme';
import notes from './createTheme.stories.md';

import IconAllFiles from '../features/left-sidebar/icons/IconAllFiles';
import IconNotes from '../features/left-sidebar/icons/IconNotes';
import IconRecents from '../features/left-sidebar/icons/IconRecents';
import IconTrash from '../features/left-sidebar/icons/IconTrash';
import IconFavorites from '../features/left-sidebar/icons/IconFavorites';
import IconDevConsole from '../features/left-sidebar/icons/IconDevConsole';

const Swatch = styled.div`
    display: inline-block;
    background: ${p => p.color};
    border: 1px solid ${vars.bdlGray30};
    height: 1em;
    width: 1em;
    border-radius: ${vars.bdlBorderRadiusSize};
`;

const BaseButton = styled(BoxButton)`
    background: ${props => props.theme.base.buttonBackground};
    border-color: ${props => props.theme.base.buttonBorder};
    color: ${props => props.theme.base.buttonForeground};

    font-weight: bold;
    border-radius: ${vars.bdlBorderRadiusSizeMed};
    font-size: ${vars.bdlFontSizeDejaBlue};

    .btn:not(.is-disabled)&:hover {
        background: ${props => props.theme.base.buttonBackgroundHover};
        border-color: ${props => props.theme.base.buttonBorderHover};
    }
    .btn:not(.is-disabled)&:active {
        background: ${props => props.theme.base.buttonBackgroundActive};
        border-color: ${props => props.theme.base.buttonBorderActive};
    }
`;

const PrimaryButton = styled(BoxButton)`
    background: ${props => props.theme.primary.buttonBackground};
    border-color: ${props => props.theme.primary.buttonBorder};
    color: ${props => props.theme.primary.buttonForeground};

    font-weight: bold;
    border-radius: ${vars.bdlBorderRadiusSizeMed};
    font-size: ${vars.bdlFontSizeDejaBlue};

    .btn:not(.is-disabled)&:hover {
        background: ${props => props.theme.primary.buttonBackgroundHover};
        border-color: ${props => props.theme.primary.buttonBorderHover};
    }
    .btn:not(.is-disabled)&:active {
        background: ${props => props.theme.primary.buttonBackgroundActive};
        border-color: ${props => props.theme.primary.buttonBorderActive};
    }
`;

const ThemeDemo = styled.div`
    width: 200px;
    min-height: 500px;
    padding: 8px;
    border-radius: ${vars.bdlBorderRadiusSize};
    display: flex;
    flex-direction: column;
    color: ${p => p.theme.primary.foreground};

    border: 1px solid ${p => p.theme.primary.border};
    background: ${p => p.theme.primary.background};
`;

const ThemeDemoMenuItem = styled.div`
    cursor: pointer;
    padding: 8px 12px;
    margin: 2px 4px;
    border-radius: ${vars.bdlBorderRadiusSizeLarge};
    font-weight: bold;
    transition: 0.15s;
    border: 1px solid;
    border-color: transparent;
    &:hover {
        background: ${p => p.theme.primary.backgroundHover};
    }
    &.active,
    &:active {
        background: ${p => p.theme.primary.backgroundActive};
    }

    &:focus,
    &:active {
        border-color: ${p => p.theme.primary.foreground};
    }

    &.alt {
        background: ${p => p.theme.primary.backgroundHover};

        &:hover {
            background: ${p => p.theme.primary.backgroundActive};
        }
    }
`;

const scroll = keyframes`
    0% {
        right: 100%;
        left: 0%;
    }

    50% {
        right: 0%;
        left: 0%;
    }

    100% {
        right: 0%;
        left: 100%;
    }
`;

const ThemeDemoProgressBar = styled.div`
    position: relative;
    display: inline-block;
    height: 6px;
    width: 300px;
    padding: 0;

    &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        content: '';
        background-color: ${props => props.theme.primary.progressBarBackground};
        will-change: left, right;
        animation: 2s ${scroll} infinite;
    }
`;

const ThemeDemoLogo = styled(BoxLogo)`
    width: 61px;
    height: 32px;
    margin: 4px 4px 16px 4px;
    & path,
    & .fill-color {
        fill: ${props => props.theme.primary.foreground};
    }
`;

const ThemeDemoIcon = styled.span`
    margin-right: 8px;
    & svg {
        top: 2px;
        position: relative;
    }
    & path,
    & .fill-color {
        fill: ${props => props.theme.primary.foreground};
    }
`;

const Footer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

export const ThemeExample = () => {
    const colorText = text('Primary Color Hex');
    const colorMap = color('Primary Color', '#0061d5');

    const colorHex = /^#[0-9A-F]{6}$/i.test(colorText) ? colorText : colorMap;

    const theme = colorHex ? createTheme(colorHex) : defaultTheme;

    return (
        <ThemeProvider theme={theme}>
            <div style={{ float: 'right' }}>
                <section>
                    <h4>theme.primary</h4>
                    {Object.entries(theme.primary)
                        .filter(([key]) => key !== '_debug')
                        .map(([key, val]) => (
                            <div key={key}>
                                <Swatch color={val} /> {key} <code>{val}</code>
                            </div>
                        ))}
                    <span>Theme Color Range: {theme.primary._debug.colorRange}</span>
                    <br />
                    <h4>theme.base</h4>
                    {Object.entries(theme.base).map(([key, val]) => (
                        <div key={key}>
                            <Swatch color={val} /> {key} <code>{val}</code>
                        </div>
                    ))}
                </section>
            </div>
            <div style={{ marginLeft: -5 }}>
                <BaseButton>Base</BaseButton>
                <PrimaryButton>Primary</PrimaryButton>
            </div>
            <br />
            <ThemeDemoProgressBar />
            <br />
            <br />
            <ThemeDemo>
                <ThemeDemoLogo />
                <ThemeDemoMenuItem className="active">
                    <ThemeDemoIcon>
                        <IconAllFiles />
                    </ThemeDemoIcon>
                    All Files
                </ThemeDemoMenuItem>
                <ThemeDemoMenuItem>
                    <ThemeDemoIcon>
                        <IconRecents />
                    </ThemeDemoIcon>
                    Recents
                </ThemeDemoMenuItem>
                <ThemeDemoMenuItem>
                    <ThemeDemoIcon>
                        <IconFavorites />
                    </ThemeDemoIcon>
                    Favorites
                </ThemeDemoMenuItem>
                <ThemeDemoMenuItem>
                    <ThemeDemoIcon>
                        <IconTrash />
                    </ThemeDemoIcon>
                    Trash
                </ThemeDemoMenuItem>
                <Footer>
                    <ThemeDemoMenuItem className="alt">
                        <ThemeDemoIcon>
                            <IconNotes />
                        </ThemeDemoIcon>
                        Notes
                    </ThemeDemoMenuItem>
                    <ThemeDemoMenuItem className="alt">
                        <ThemeDemoIcon>
                            <IconDevConsole />
                        </ThemeDemoIcon>
                        Developer Console
                    </ThemeDemoMenuItem>
                </Footer>
            </ThemeDemo>
            <br />
            <section>
                <details>
                    <summary>JSON Theme</summary>
                    <pre>
                        <code>{JSON.stringify(theme, null, 2)}</code>
                    </pre>
                </details>
            </section>
        </ThemeProvider>
    );
};

export default {
    title: 'Theming/Theme',
    component: ThemeExample,
    parameters: {
        notes,
        chromatic: {
            disableSnapshot: true,
        },
    },
};
