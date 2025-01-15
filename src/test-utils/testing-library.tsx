import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { createMemoryHistory } from 'history';

// Data Providers
import { TooltipProvider } from '@box/blueprint-web';
import { IntlProvider } from 'react-intl';
import { FeatureProvider } from '../elements/common/feature-checking';
import { NavRouter } from '../elements/common/nav-router';

jest.unmock('react-intl');

interface WrapperProps {
    children?: React.ReactNode;
    features?: Record<string, unknown>;
    initialEntries?: string[];
}

const Wrapper = ({ children, features = {}, initialEntries = ['/'] }: WrapperProps) => {
    const history = createMemoryHistory({ initialEntries });
    return (
        <FeatureProvider features={features}>
            <TooltipProvider>
                <IntlProvider locale="en">
                    <NavRouter history={history}>{children}</NavRouter>
                </IntlProvider>
            </TooltipProvider>
        </FeatureProvider>
    );
};

type RenderConnectedOptions = RenderOptions & {
    wrapperProps?: WrapperProps;
};

const renderConnected = (element, options: RenderConnectedOptions = {}) =>
    render(element, {
        wrapper: options.wrapper ? options.wrapper : props => <Wrapper {...props} {...options.wrapperProps} />,
        ...options,
    });

export * from '@testing-library/react';
export { renderConnected as render };
