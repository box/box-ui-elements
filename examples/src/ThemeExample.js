// @flow
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import merge from 'lodash/merge';

import BoxButton from '../../src/components/button';
import { generateContrastColors, theme as defaultTheme } from '../../src/components/theme';

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

type Props = {
    colorKey: ?String,
};

const ThemeExample = ({ colorKey }: Props) => {
    const dynamicTheme = colorKey ? generateContrastColors(colorKey) : {};
    const theme = merge({}, defaultTheme, dynamicTheme);

    return (
        <ThemeProvider theme={theme}>
            <BaseButton>Base</BaseButton>
            <PrimaryButton>Primary</PrimaryButton>
        </ThemeProvider>
    );
};

export default ThemeExample;
