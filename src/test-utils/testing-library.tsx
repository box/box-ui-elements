import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEventInit from '@testing-library/user-event';

// Data Providers
import { TooltipProvider } from '@box/blueprint-web';
import { IntlProvider } from 'react-intl';
import { FeatureProvider } from '../elements/common/feature-checking';

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

const userEvent = userEventInit.setup(); // enable userEvent APIs

export * from '@testing-library/react';
export { renderConnected as render, userEvent };
