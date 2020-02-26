// @flow
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import merge from 'lodash/merge';
import { select } from '@storybook/addon-knobs';

import BoxButton from '../components/button';
import BoxLogo from '../icon/logo/BoxLogo';
import defaultTheme from '../styles/theme';
import { createTheme } from './createTheme';
import notes from './createTheme.stories.md';

import IconAllFiles from '../features/left-sidebar/icons/IconAllFiles';
import IconNotes from '../features/left-sidebar/icons/IconNotes';
import IconRecents from '../features/left-sidebar/icons/IconRecents';
import IconTrash from '../features/left-sidebar/icons/IconTrash';
import IconFavorites from '../features/left-sidebar/icons/IconFavorites';
import IconDevConsole from '../features/left-sidebar/icons/IconDevConsole';

const BaseButton = styled(BoxButton)`
    background: ${props => props.theme.base.buttonBackground};
    border-color: ${props => props.theme.base.buttonBorder};
    color: ${props => props.theme.base.buttonForeground};
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
    .btn:not(.is-disabled)&:hover {
        background: ${props => props.theme.primary.buttonBackgroundHover};
        border-color: ${props => props.theme.primary.buttonBorderHover};
    }
    .btn:not(.is-disabled)&:active {
        background: ${props => props.theme.primary.buttonBackgroundActive};
        border-color: ${props => props.theme.primary.buttonBorderActive};
    }
`;

const options = {
    Default: null,
    Blue: '#1122cc',
    Red: '#cc1100',
    Yellow: '#ffdd11',
    Green: '#118811',
    Black: '#000000',
    White: '#ffffff',
};

const ThemeDemo = styled.div`
    width: 200px;
    min-height: 500px;
    padding: 8px;
    margin: 5px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    color: ${p => p.theme.primary.foreground};

    border: 1px solid ${p => p.theme.primary.border};
    background: ${p => p.theme.primary.background};
    background-image: linear-gradient(
        to bottom,
        ${props => props.theme.primary.background} 50%,
        ${props => props.theme.primary.backgroundGradient} 100%
    );
`;

const ThemeDemoMenuItem = styled.div`
    cursor: pointer;
    padding: 4px 8px;
    margin: 4px;
    border-radius: 4px;
    transition: 0.15s;
    &:hover {
        background: ${p => p.theme.primary.backgroundHover};
    }
    &.active,
    &:active {
        background: ${p => p.theme.primary.backgroundActive};
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

    & .item {
        background-color: ${props => props.theme.primary.background};
    }
`;

export const ThemeExample = () => {
    const colorKey = select('Primary Color', options);
    const dynamicTheme = colorKey ? createTheme(colorKey) : {};
    const theme = merge({}, defaultTheme, dynamicTheme);

    return (
        <ThemeProvider theme={theme}>
            <pre style={{ float: 'right' }}>
                <code>{JSON.stringify(theme, null, 2)}</code>
            </pre>
            <BaseButton>Base</BaseButton>
            <PrimaryButton>Primary</PrimaryButton>
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
                    <ThemeDemoMenuItem className="item">
                        <ThemeDemoIcon>
                            <IconNotes />
                        </ThemeDemoIcon>
                        Notes
                    </ThemeDemoMenuItem>
                    <ThemeDemoMenuItem className="item">
                        <ThemeDemoIcon>
                            <IconDevConsole />
                        </ThemeDemoIcon>
                        Developer Console
                    </ThemeDemoMenuItem>
                </Footer>
            </ThemeDemo>
        </ThemeProvider>
    );
};

export default {
    title: 'Theming|Theme',
    component: ThemeExample,
    parameters: { notes },
};
