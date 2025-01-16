import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';

// Data Providers
import { IntlProvider } from 'react-intl';
import { TooltipProvider } from '@box/blueprint-web';
import { FeatureProvider } from '../elements/common/feature-checking';

// Import the actual TooltipProvider from blueprint-web

jest.unmock('react-intl');

const Wrapper = ({ children, features = {} }) => (
    <FeatureProvider features={features}>
        <TooltipProvider>
            <IntlProvider locale="en">{children}</IntlProvider>
        </TooltipProvider>
    </FeatureProvider>
);

type RenderConnectedOptions = RenderOptions & {
    wrapperProps?: Record<string, unknown>;
};

const renderConnected = (element, options: RenderConnectedOptions = {}) =>
    render(element, {
        wrapper: options.wrapper ? options.wrapper : props => <Wrapper {...props} {...options.wrapperProps} />,
        ...options,
    });

export * from '@testing-library/react';
export { renderConnected as render };
