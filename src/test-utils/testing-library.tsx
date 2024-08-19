import React from 'react';
import { render } from '@testing-library/react';

// Data Providers
import { TooltipProvider } from '@box/blueprint-web';
import { IntlProvider } from 'react-intl';

jest.unmock('react-intl');

const Wrapper = ({ children }) => (
    <TooltipProvider>
        <IntlProvider locale="en">{children}</IntlProvider>
    </TooltipProvider>
);

const renderConnected = (element, options = {}) => render(element, { wrapper: Wrapper, ...options });

export * from '@testing-library/react';
export { renderConnected as render };
