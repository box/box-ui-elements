import React from 'react';
import { render } from '@testing-library/react';

// Data Providers
import { TooltipProvider } from '@box/blueprint-web';
import { IntlProvider } from 'react-intl';
import { AutofillContextProvider } from '@box/metadata-editor';

jest.unmock('react-intl');

const Wrapper = ({ children }) => (
    <AutofillContextProvider isAiSuggestionsFeatureEnabled={false}>
        <TooltipProvider>
            <IntlProvider locale="en">{children}</IntlProvider>
        </TooltipProvider>
    </AutofillContextProvider>
);

const renderConnected = (element, options = {}) => render(element, { wrapper: Wrapper, ...options });

export * from '@testing-library/react';
export { renderConnected as render };
