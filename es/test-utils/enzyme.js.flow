/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { mount as baseMount, shallow as baseShallow } from 'enzyme';

// Global providers that need setup
import { ThemeProvider } from 'styled-components';
import defaultTheme from '../styles/theme';

// Wrap this around every component so they can use app-wide context.
// Prevents breaking due to missing providers.
// See https://github.com/airbnb/enzyme/blob/master/docs/api/ReactWrapper/getWrappingComponent.md
/* eslint-disable react/prop-types */
const Wrappers = ({ children }) => {
    return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
};

/**
 * mount() from Enzyme but with required app-wide context providers included by default
 */
const mountConnected = (element, options = {}) => baseMount(element, { wrappingComponent: Wrappers, ...options });

/**
 * shallow() from Enzyme but with required app-wide context providers included by default.
 */
const shallowConnected = (element, options = {}) => baseShallow(element, { wrappingComponent: Wrappers, ...options });

// Re-export everything from Enzyme
export * from 'enzyme';
// Export wrapped methods
export { mountConnected, shallowConnected };
