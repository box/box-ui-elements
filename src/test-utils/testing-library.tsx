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

const renderConnected = (element: React.ReactElement, options: RenderConnectedOptions = {}) =>
    render(element, {
        wrapper: options.wrapper ? options.wrapper : props => <Wrapper {...props} {...options.wrapperProps} />,
        ...options,
    });

const createUserEvent = () => userEventInit.setup(); // factory function to create isolated userEvent instances

export * from '@testing-library/react';
export { renderConnected as render, createUserEvent as userEvent };
